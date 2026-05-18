CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en' NOT NULL
);

CREATE TABLE IF NOT EXISTS proyectos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255),
  descripcion TEXT,
  simulacao_ativa BOOLEAN DEFAULT FALSE NOT NULL,
  layout TEXT,
  usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lecturas_sensor (
  id BIGSERIAL PRIMARY KEY,
  proyecto_id BIGINT REFERENCES proyectos(id) ON DELETE CASCADE NOT NULL,
  componente VARCHAR(100) NOT NULL,
  valores TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alertas (
  id BIGSERIAL PRIMARY KEY,
  proyecto_id BIGINT REFERENCES proyectos(id) ON DELETE CASCADE NOT NULL,
  componente VARCHAR(100) NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  ativa BOOLEAN DEFAULT TRUE NOT NULL,
  accion_automatica VARCHAR(255),
  creada_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipamentos (
  id BIGSERIAL PRIMARY KEY,
  proyecto_id BIGINT REFERENCES proyectos(id) ON DELETE CASCADE NOT NULL,
  componente_id VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'AUTO',
  configuracion TEXT,
  ultima_actualizacion TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lecturas_proyecto ON lecturas_sensor(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_lecturas_componente ON lecturas_sensor(proyecto_id, componente);
CREATE INDEX IF NOT EXISTS idx_lecturas_timestamp ON lecturas_sensor(timestamp);
CREATE INDEX IF NOT EXISTS idx_alertas_proyecto ON alertas(proyecto_id);

-- Demo user — password: "password"
INSERT INTO usuarios (email, password, nombre)
VALUES (
  'admin@aquasense.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator'
) ON CONFLICT DO NOTHING;
