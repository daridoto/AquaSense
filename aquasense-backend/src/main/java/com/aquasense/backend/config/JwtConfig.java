package com.aquasense.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret;
    private long expiration;

    @Autowired
    private Environment env;

    private static final String DEV_SECRET = "dev_secret_key_aquasense_change_in_production_32chars";

    @PostConstruct
    public void validate() {
        boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");
        if (isProd && DEV_SECRET.equals(secret)) {
            throw new IllegalStateException(
                "SEGURIDAD: JWT_SECRET está usando el valor por defecto en producción. " +
                "Define la variable de entorno JWT_SECRET antes de arrancar.");
        }
    }
}
