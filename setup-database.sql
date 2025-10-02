-- Criar tabela de casos de leishmaniose
CREATE TABLE IF NOT EXISTS leishmaniasis_cases (
    id SERIAL PRIMARY KEY,
    nome_animal VARCHAR(255) NOT NULL,
    tipo_animal VARCHAR(100) NOT NULL,
    idade VARCHAR(50),
    raca VARCHAR(100),
    sexo VARCHAR(20),
    pelagem VARCHAR(100),
    cor_pelagem VARCHAR(100),
    nome_tutor VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    quadra VARCHAR(50) NOT NULL,
    data_notificacao TIMESTAMP DEFAULT NOW(),
    cpf VARCHAR(20),
    telefone VARCHAR(20),
    endereco TEXT
);

-- Criar tabela de registros de vacina antirrábica
CREATE TABLE IF NOT EXISTS rabies_vaccine_records (
    id SERIAL PRIMARY KEY,
    nome_animal VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    idade VARCHAR(50),
    raca VARCHAR(100),
    sexo VARCHAR(20),
    nome_tutor VARCHAR(255) NOT NULL,
    cpf VARCHAR(20),
    telefone VARCHAR(20),
    endereco TEXT,
    data_vacinacao TIMESTAMP DEFAULT NOW(),
    local_vacinacao VARCHAR(100) NOT NULL,
    lote_vacina VARCHAR(100) NOT NULL,
    veterinario VARCHAR(255),
    clinica VARCHAR(255),
    quadra VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    dose_perdida BOOLEAN DEFAULT FALSE
);

-- Inserir alguns dados de exemplo
INSERT INTO leishmaniasis_cases (nome_animal, tipo_animal, nome_tutor, status, area, quadra) VALUES
('Rex', 'cão', 'João Silva', 'Ativo', 'Centro', 'A'),
('Mimi', 'gato', 'Maria Santos', 'Ativo', 'Norte', 'B');

INSERT INTO rabies_vaccine_records (nome_animal, tipo, nome_tutor, local_vacinacao, lote_vacina, quadra, area) VALUES
('Bella', 'gato', 'Maria Santos', 'centro_municipal', 'LOTE-2024-001', 'B', 'Norte'),
('Max', 'cão', 'Pedro Costa', 'clinica_pet_care', 'LOTE-2024-002', 'C', 'Sul');
