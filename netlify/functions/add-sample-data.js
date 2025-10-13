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
      ('Mel', 'gato', '4 anos', 'Angorá', 'Fêmea', 'Longa', 'Branco', 'Lucia Ferreira', 'positivo', 'Centro', 'A', '741.852.963-00', '(11) 00000-0000', 'Rua das Rosas, 741')
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
      ('Mel', 'gato', 'Lucia Ferreira', 'hospital_sao_francisco', 'LOTE-2024-009', 'A', 'Centro', false)
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
