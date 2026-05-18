package com.aquasense.backend;

import com.aquasense.backend.model.Equipamento;
import com.aquasense.backend.model.Projeto;
import com.aquasense.backend.model.Usuario;
import com.aquasense.backend.repository.EquipamentoRepository;
import com.aquasense.backend.repository.ProjetoRepository;
import com.aquasense.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    // Os 8 componenteIds canónicos da planta ETAP, em ordem de processo
    private static final List<String> COMPONENTES = List.of(
            "bomba_captacao",
            "reja_tamiz",
            "coagulacion",
            "decantador",
            "filtracion",
            "desinfeccion",
            "reservorio",
            "bomba_distribucion"
    );

    // Layout inicial: 8 componentes alinhados da esquerda para a direita,
    // separados 150px, centrados verticalmente em y=200.
    private static final String LAYOUT_INICIAL = buildLayout();

    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Corre apenas se o utilizador demo ainda não existir
        if (usuarioRepository.existsByEmail("operador@aquasense.com")) {
            log.info("=== Seed já aplicado — nada a fazer ===");
            return;
        }

        // 1. Criar utilizador demo
        Usuario operador = usuarioRepository.save(Usuario.builder()
                .email("operador@aquasense.com")
                .password(passwordEncoder.encode("password123"))
                .nombre("Operador Demo")
                .language("pt")
                .build());

        // 2. Criar projeto demo
        Projeto demo = projetoRepository.save(Projeto.builder()
                .nombre("ETAP Demo")
                .descripcion("Planta de tratamento de água — ambiente demo")
                .ubicacion("Lisboa, Portugal")
                .usuario(operador)
                .simulacaoAtiva(true)
                .layout(LAYOUT_INICIAL)
                .build());

        // 3. Criar os 8 equipamentos com componenteIds canónicos
        for (int i = 0; i < COMPONENTES.size(); i++) {
            equipamentoRepository.save(Equipamento.builder()
                    .projeto(demo)
                    .componenteId(COMPONENTES.get(i))
                    .estado("AUTO")
                    .build());
        }

        log.info("=== Seed aplicado: operador@aquasense.com | projetoId={} ===", demo.getId());
    }

    /**
     * Gera o JSON de layout no formato canónico {componentes, tuberias}.
     * Posições horizontais calculadas para acomodar as bounding boxes reais de cada
     * shape ISA (ver equipShapes.jsx). As 7 ligações do fluxo principal são incluídas
     * com pipeType correto segundo conexiones-equipos.md.
     */
    private static String buildLayout() {
        // id, componenteId, label, x, y
        String[][] comps = {
            {"inst_bc",  "bomba_captacao",    "B. Captação",  "60",  "100"},
            {"inst_rt",  "reja_tamiz",        "Reja/Tamiz",              "220", "90" },
            {"inst_cg",  "coagulacion",       "Coagulação",   "370", "90" },
            {"inst_dc",  "decantador",        "Decantador",              "545", "90" },
            {"inst_fi",  "filtracion",        "Filtração",    "730", "80" },
            {"inst_ds",  "desinfeccion",      "Desinfeção",   "900", "96" },
            {"inst_rv",  "reservorio",        "Reservório",         "1085","80" },
            {"inst_bd",  "bomba_distribucion","B. Distribuição","1265","100"},
        };

        // fromInstId, toInstId, fromPort, toPort, pipeType
        String[][] tubes = {
            {"inst_bc","inst_rt","descarga",   "alimentacao","aguaCruda"   },
            {"inst_rt","inst_cg","salida",     "entrada",    "aguaCruda"   },
            {"inst_cg","inst_dc","salida",     "entrada",    "aguaCruda"   },
            {"inst_dc","inst_fi","salida",     "entrada",    "aguaTratada" },
            {"inst_fi","inst_ds","salida",     "entrada",    "aguaTratada" },
            {"inst_ds","inst_rv","salida",     "entrada",    "aguaTratada" },
            {"inst_rv","inst_bd","salida",     "succion",    "aguaTratada" },
        };

        StringBuilder sb = new StringBuilder("{\"componentes\":[");
        for (int i = 0; i < comps.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("{\"id\":\"").append(comps[i][0]).append("\"")
              .append(",\"componenteId\":\"").append(comps[i][1]).append("\"")
              .append(",\"label\":\"").append(comps[i][2]).append("\"")
              .append(",\"x\":").append(comps[i][3])
              .append(",\"y\":").append(comps[i][4]).append("}");
        }
        sb.append("],\"tuberias\":[");
        for (int i = 0; i < tubes.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("{\"id\":\"tub_").append(i).append("\"")
              .append(",\"fromInstanceId\":\"").append(tubes[i][0]).append("\"")
              .append(",\"toInstanceId\":\"").append(tubes[i][1]).append("\"")
              .append(",\"fromPort\":\"").append(tubes[i][2]).append("\"")
              .append(",\"toPort\":\"").append(tubes[i][3]).append("\"")
              .append(",\"pipeType\":\"").append(tubes[i][4]).append("\"}");
        }
        sb.append("]}");
        return sb.toString();
    }
}
