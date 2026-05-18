package com.aquasense.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        // Aceita tanto "postgresql://" como "jdbc:postgresql://"
        String raw = databaseUrl.startsWith("jdbc:") ? databaseUrl.substring(5) : databaseUrl;

        try {
            URI uri = new URI(raw);
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String db = uri.getPath().replaceFirst("^/", "");

            String username = null;
            String password = null;
            if (uri.getUserInfo() != null) {
                String[] parts = uri.getUserInfo().split(":", 2);
                username = parts[0];
                password = parts.length > 1 ? parts[1] : null;
            }

            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + "/" + db);
            if (username != null) cfg.setUsername(username);
            if (password != null) cfg.setPassword(password);
            cfg.setMaximumPoolSize(20);
            cfg.setMinimumIdle(5);
            cfg.setConnectionTimeout(30000);
            cfg.setDriverClassName("org.postgresql.Driver");

            return new HikariDataSource(cfg);
        } catch (Exception e) {
            throw new RuntimeException("DATABASE_URL inválido: " + e.getMessage(), e);
        }
    }
}
