const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let client;
  
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // Inserir dados de exemplo para casos de leishmaniose
    await client.query(`
      INSERT INTO leishmaniasis_cases 
      ("nomeAnimal", "tipoAnimal", "idade", "raca", "sexo", "pelagem", "corPelagem", "nomeTutor", "status", "area", "quadra", "cpf", "telefone", "endereco")
      VALUES 
      ('Rex', 'cão', '3 anos', 'Pastor Alemão', 'Macho', 'Curta', 'Preto', 'João Silva', 'positivo', 'Centro', 'A', '123.456.789-00', '(11) 99999-9999', 'Rua das Flores, 123'),
      ('Mimi', 'gato', '2 anos', 'Siamês', 'Fêmea', 'Curta', 'Branco', 'Maria Santos', 'notificado', 'Norte', 'B', '987.654.321-00', '(11) 88888-8888', 'Av. Principal, 456'),
      ('Max', 'cão', '5 anos', 'Labrador', 'Macho', 'Curta', 'Dourado', 'Pedro Costa', 'tratamento', 'Sul', 'C', '456.789.123-00', '(11) 77777-7777', 'Rua do Sol, 789'),
      ('Bella', 'gato', '1 ano', 'Persa', 'Fêmea', 'Longa', 'Cinza', 'Ana Oliveira', 'positivo', 'Centro', 'A', '789.123.456-00', '(11) 66666-6666', 'Rua da Paz, 321'),
      ('Thor', 'cão', '4 anos', 'Rottweiler', 'Macho', 'Curta', 'Preto', 'Carlos Mendes', 'notificado', 'Norte', 'B', '321.654.987-00', '(11) 55555-5555', 'Av. das Palmeiras, 654'),
      ('Luna', 'gato', '6 meses', 'Maine Coon', 'Fêmea', 'Longa', 'Tigrado', 'Patricia Lima', 'tratamento', 'Sul', 'C', '654.321.789-00', '(11) 44444-4444', 'Rua dos Lírios, 987'),
      ('Zeus', 'cão', '2 anos', 'Golden Retriever', 'Macho', 'Longa', 'Dourado', 'Roberto Santos', 'positivo', 'Centro', 'A', '147.258.369-00', '(11) 33333-3333', 'Av. Central, 147'),
      ('Nina', 'gato', '3 anos', 'Siamês', 'Fêmea', 'Curta', 'Branco', 'Fernanda Costa', 'notificado', 'Norte', 'B', '369.258.147-00', '(11) 22222-2222', 'Rua das Acácias, 258'),
      ('Rocky', 'cão', '7 anos', 'Bulldog', 'Macho', 'Curta', 'Branco', 'Marcos Pereira', 'tratamento', 'Sul', 'C', '258.147.369-00', '(11) 11111-1111', 'Av. dos Eucaliptos, 369'),
      ('Mel', 'gato', '4 anos', 'Angorá', 'Fêmea', 'Longa', 'Branco', 'Lucia Ferreira', 'positivo', 'Centro', 'A', '741.852.963-00', '(11) 00000-0000', 'Rua das Rosas, 741'),
      ('Toby', 'cão', '1 ano', 'Beagle', 'Macho', 'Curta', 'Tricolor', 'Ricardo Alves', 'notificado', 'Leste', 'D', '852.741.963-00', '(11) 10101-1010', 'Rua dos Canários, 852'),
      ('Lola', 'gato', '5 anos', 'Ragdoll', 'Fêmea', 'Longa', 'Azul', 'Sandra Martins', 'positivo', 'Oeste', 'E', '963.852.741-00', '(11) 20202-2020', 'Av. dos Pássaros, 963'),
      ('Bolt', 'cão', '8 meses', 'Border Collie', 'Macho', 'Longa', 'Preto e Branco', 'Felipe Rocha', 'tratamento', 'Centro', 'A', '159.753.486-00', '(11) 30303-3030', 'Rua das Margaridas, 159'),
      ('Chloe', 'gato', '2 anos', 'British Shorthair', 'Fêmea', 'Curta', 'Cinza', 'Camila Dias', 'notificado', 'Norte', 'B', '486.159.753-00', '(11) 40404-4040', 'Av. das Orquídeas, 486'),
      ('Duke', 'cão', '6 anos', 'Doberman', 'Macho', 'Curta', 'Preto', 'André Nunes', 'positivo', 'Sul', 'C', '753.486.159-00', '(11) 50505-5050', 'Rua dos Girassóis, 753'),
      ('Mia', 'gato', '1 ano', 'Abissínio', 'Fêmea', 'Curta', 'Vermelho', 'Juliana Souza', 'tratamento', 'Leste', 'D', '357.159.486-00', '(11) 60606-6060', 'Av. das Violetas, 357'),
      ('Apollo', 'cão', '3 anos', 'Husky Siberiano', 'Macho', 'Longa', 'Cinza e Branco', 'Diego Lima', 'notificado', 'Oeste', 'E', '159.357.486-00', '(11) 70707-7070', 'Rua dos Cravos, 159'),
      ('Sophie', 'gato', '4 anos', 'Bombay', 'Fêmea', 'Curta', 'Preto', 'Renata Castro', 'positivo', 'Centro', 'A', '486.357.159-00', '(11) 80808-8080', 'Av. das Tulipas, 486'),
      ('Bruno', 'cão', '2 anos', 'Pitbull', 'Macho', 'Curta', 'Branco', 'Gabriel Santos', 'tratamento', 'Norte', 'B', '357.486.159-00', '(11) 90909-9090', 'Rua dos Lírios, 357'),
      ('Lily', 'gato', '6 meses', 'Munchkin', 'Fêmea', 'Curta', 'Tigrado', 'Isabela Costa', 'notificado', 'Sul', 'C', '159.486.357-00', '(11) 10101-1010', 'Av. das Rosas, 159'),
      ('Charlie', 'cão', '4 anos', 'Chihuahua', 'Macho', 'Curta', 'Marrom', 'Lucas Oliveira', 'positivo', 'Leste', 'D', '486.159.357-00', '(11) 20202-2020', 'Rua dos Jasmins, 486'),
      ('Emma', 'gato', '3 anos', 'Scottish Fold', 'Fêmea', 'Curta', 'Cinza', 'Mariana Silva', 'tratamento', 'Oeste', 'E', '357.159.486-00', '(11) 30303-3030', 'Av. das Hortênsias, 357'),
      ('Tank', 'cão', '5 anos', 'Mastiff', 'Macho', 'Curta', 'Fulvo', 'Rodrigo Pereira', 'notificado', 'Centro', 'A', '159.357.486-00', '(11) 40404-4040', 'Rua dos Narcisos, 159'),
      ('Princess', 'gato', '2 anos', 'Sphynx', 'Fêmea', 'Sem pelo', 'Rosa', 'Vanessa Rocha', 'positivo', 'Norte', 'B', '486.357.159-00', '(11) 50505-5050', 'Av. das Begônias, 486'),
      ('Spike', 'cão', '1 ano', 'Dachshund', 'Macho', 'Curta', 'Vermelho', 'Thiago Almeida', 'tratamento', 'Sul', 'C', '357.486.159-00', '(11) 60606-6060', 'Rua dos Crisântemos, 357'),
      ('Whiskers', 'gato', '7 anos', 'Manx', 'Fêmea', 'Curta', 'Tigrado', 'Priscila Nunes', 'notificado', 'Leste', 'D', '159.486.357-00', '(11) 70707-7070', 'Av. das Azaleias, 159'),
      ('Ranger', 'cão', '3 anos', 'German Shepherd', 'Macho', 'Longa', 'Preto e Marrom', 'Eduardo Dias', 'positivo', 'Oeste', 'E', '486.159.357-00', '(11) 80808-8080', 'Rua dos Magnólias, 486'),
      ('Coco', 'gato', '1 ano', 'Oriental', 'Fêmea', 'Curta', 'Chocolate', 'Beatriz Castro', 'tratamento', 'Centro', 'A', '357.159.486-00', '(11) 90909-9090', 'Av. das Camélias, 357'),
      ('Shadow', 'cão', '6 anos', 'Weimaraner', 'Macho', 'Curta', 'Cinza', 'Fábio Lima', 'notificado', 'Norte', 'B', '159.357.486-00', '(11) 10101-1010', 'Rua dos Hibiscos, 159'),
      ('Mittens', 'gato', '4 anos', 'Ragdoll', 'Fêmea', 'Longa', 'Seal Point', 'Carla Souza', 'positivo', 'Sul', 'C', '486.357.159-00', '(11) 20202-2020', 'Av. das Petúnias, 486'),
      ('Ace', 'cão', '2 anos', 'Boxer', 'Macho', 'Curta', 'Tigrado', 'Henrique Santos', 'tratamento', 'Leste', 'D', '357.486.159-00', '(11) 30303-3030', 'Rua dos Antúrios, 357'),
      ('Sasha', 'gato', '5 anos', 'Birman', 'Fêmea', 'Longa', 'Seal Point', 'Natália Costa', 'notificado', 'Oeste', 'E', '159.486.357-00', '(11) 40404-4040', 'Av. das Gardênias, 159'),
      ('Rex', 'cão', '4 anos', 'Akita', 'Macho', 'Longa', 'Vermelho', 'Vinícius Oliveira', 'positivo', 'Centro', 'A', '486.159.357-00', '(11) 50505-5050', 'Rua dos Lótus, 486'),
      ('Misty', 'gato', '3 anos', 'Tonkinese', 'Fêmea', 'Curta', 'Natural Mink', 'Amanda Silva', 'tratamento', 'Norte', 'B', '357.159.486-00', '(11) 60606-6060', 'Av. das Bromélias, 357'),
      ('King', 'cão', '7 anos', 'Great Dane', 'Macho', 'Curta', 'Azul', 'Paulo Rocha', 'notificado', 'Sul', 'C', '159.357.486-00', '(11) 70707-7070', 'Rua dos Lírios do Vale, 159'),
      ('Cleo', 'gato', '2 anos', 'Devon Rex', 'Fêmea', 'Curta', 'Preto', 'Larissa Castro', 'positivo', 'Leste', 'D', '486.357.159-00', '(11) 80808-8080', 'Av. das Estrelícias, 486'),
      ('Bear', 'cão', '1 ano', 'Bernese Mountain Dog', 'Macho', 'Longa', 'Tricolor', 'Marcelo Dias', 'tratamento', 'Oeste', 'E', '357.486.159-00', '(11) 90909-9090', 'Rua dos Copos de Leite, 357')
    `);
    
    // Inserir dados de exemplo para vacinas antirrábicas
    await client.query(`
      INSERT INTO rabies_vaccine_records 
      ("nomeAnimal", "tipo", "nomeTutor", "localVacinacao", "loteVacina", "quadra", "area", "dosePerdida")
      VALUES 
      ('Bella', 'gato', 'Maria Santos', 'centro_municipal', 'LOTE-2024-001', 'B', 'Norte', false),
      ('Rex', 'cão', 'João Silva', 'clinica_pet_care', 'LOTE-2024-002', 'A', 'Centro', false),
      ('Max', 'cão', 'Pedro Costa', 'hospital_sao_francisco', 'LOTE-2024-003', 'C', 'Sul', true),
      ('Thor', 'cão', 'Carlos Mendes', 'centro_municipal', 'LOTE-2024-004', 'B', 'Norte', false),
      ('Luna', 'gato', 'Patricia Lima', 'clinica_pet_care', 'LOTE-2024-005', 'C', 'Sul', false),
      ('Zeus', 'cão', 'Roberto Santos', 'hospital_sao_francisco', 'LOTE-2024-006', 'A', 'Centro', true),
      ('Nina', 'gato', 'Fernanda Costa', 'centro_municipal', 'LOTE-2024-007', 'B', 'Norte', false),
      ('Rocky', 'cão', 'Marcos Pereira', 'clinica_pet_care', 'LOTE-2024-008', 'C', 'Sul', false),
      ('Mel', 'gato', 'Lucia Ferreira', 'hospital_sao_francisco', 'LOTE-2024-009', 'A', 'Centro', false),
      ('Toby', 'cão', 'Ricardo Alves', 'centro_municipal', 'LOTE-2024-010', 'D', 'Leste', false),
      ('Lola', 'gato', 'Sandra Martins', 'clinica_pet_care', 'LOTE-2024-011', 'E', 'Oeste', true),
      ('Bolt', 'cão', 'Felipe Rocha', 'hospital_sao_francisco', 'LOTE-2024-012', 'A', 'Centro', false),
      ('Chloe', 'gato', 'Camila Dias', 'centro_municipal', 'LOTE-2024-013', 'B', 'Norte', false),
      ('Duke', 'cão', 'André Nunes', 'clinica_pet_care', 'LOTE-2024-014', 'C', 'Sul', false),
      ('Mia', 'gato', 'Juliana Souza', 'hospital_sao_francisco', 'LOTE-2024-015', 'D', 'Leste', true),
      ('Apollo', 'cão', 'Diego Lima', 'centro_municipal', 'LOTE-2024-016', 'E', 'Oeste', false),
      ('Sophie', 'gato', 'Renata Castro', 'clinica_pet_care', 'LOTE-2024-017', 'A', 'Centro', false),
      ('Bruno', 'cão', 'Gabriel Santos', 'hospital_sao_francisco', 'LOTE-2024-018', 'B', 'Norte', false),
      ('Lily', 'gato', 'Isabela Costa', 'centro_municipal', 'LOTE-2024-019', 'C', 'Sul', false),
      ('Charlie', 'cão', 'Lucas Oliveira', 'clinica_pet_care', 'LOTE-2024-020', 'D', 'Leste', true),
      ('Emma', 'gato', 'Mariana Silva', 'hospital_sao_francisco', 'LOTE-2024-021', 'E', 'Oeste', false),
      ('Tank', 'cão', 'Rodrigo Pereira', 'centro_municipal', 'LOTE-2024-022', 'A', 'Centro', false),
      ('Princess', 'gato', 'Vanessa Rocha', 'clinica_pet_care', 'LOTE-2024-023', 'B', 'Norte', false),
      ('Spike', 'cão', 'Thiago Almeida', 'hospital_sao_francisco', 'LOTE-2024-024', 'C', 'Sul', false),
      ('Whiskers', 'gato', 'Priscila Nunes', 'centro_municipal', 'LOTE-2024-025', 'D', 'Leste', true),
      ('Ranger', 'cão', 'Eduardo Dias', 'clinica_pet_care', 'LOTE-2024-026', 'E', 'Oeste', false),
      ('Coco', 'gato', 'Beatriz Castro', 'hospital_sao_francisco', 'LOTE-2024-027', 'A', 'Centro', false),
      ('Shadow', 'cão', 'Fábio Lima', 'centro_municipal', 'LOTE-2024-028', 'B', 'Norte', false),
      ('Mittens', 'gato', 'Carla Souza', 'clinica_pet_care', 'LOTE-2024-029', 'C', 'Sul', false),
      ('Ace', 'cão', 'Henrique Santos', 'hospital_sao_francisco', 'LOTE-2024-030', 'D', 'Leste', true),
      ('Sasha', 'gato', 'Natália Costa', 'centro_municipal', 'LOTE-2024-031', 'E', 'Oeste', false),
      ('Rex', 'cão', 'Vinícius Oliveira', 'clinica_pet_care', 'LOTE-2024-032', 'A', 'Centro', false),
      ('Misty', 'gato', 'Amanda Silva', 'hospital_sao_francisco', 'LOTE-2024-033', 'B', 'Norte', false),
      ('King', 'cão', 'Paulo Rocha', 'centro_municipal', 'LOTE-2024-034', 'C', 'Sul', false),
      ('Cleo', 'gato', 'Larissa Castro', 'clinica_pet_care', 'LOTE-2024-035', 'D', 'Leste', true),
      ('Bear', 'cão', 'Marcelo Dias', 'hospital_sao_francisco', 'LOTE-2024-036', 'E', 'Oeste', false)
    `);
    
    // Verificar contagem final
    const casesCount = await client.query('SELECT COUNT(*) as count FROM leishmaniasis_cases');
    const rabiesCount = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
    
    const response = {
      status: 'SUCCESS',
      message: 'Sample data added successfully!',
      counts: {
        leishmaniasis_cases: parseInt(casesCount.rows[0].count),
        rabies_vaccine_records: parseInt(rabiesCount.rows[0].count)
      },
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Add sample data error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'ERROR',
        error: error.message
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
