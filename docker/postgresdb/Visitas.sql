// Validar que este creada antes de ejecutar
CREATE DATABASE URLvisitas;

//Crea la tabla de visitas
CREATE TABLE visitas(
    id_visitas SERIAL  NOT NULL PRIMARY key,
	url_id VARCHAR(7) NOT NULL,
    url VARCHAR(2000) NOT null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_id_visitas ON visitas(id_visitas);
CREATE INDEX idx_url_id ON visitas(url_id);