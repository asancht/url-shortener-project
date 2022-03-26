CREATE DATABASE URLvisitas;
CREATE TABLE visitas(
    id_visitas SERIAL  NOT NULL PRIMARY key,
	url_id VARCHAR(7) NOT NULL,
    url VARCHAR(2000) NOT null,
    visita TIMESTAMP NOT NULL
);

CREATE INDEX idx_id_visitas ON visitas(id_visitas);
CREATE INDEX idx_url_id ON visitas(url_id);