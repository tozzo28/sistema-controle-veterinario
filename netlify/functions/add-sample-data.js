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
      ('Rex', 'cão', '3 anos', 'Pastor Alemão', 'Macho', 'Curta', 'Preto', 'João Silva', 'Ativo', 'Centro', 'A', '123.456.789-00', '(11) 99999-9999', 'Rua das Flores, 123'),
      ('Mimi', 'gato', '2 anos', 'Siamês', 'Fêmea', 'Curta', 'Branco', 'Maria Santos', 'Ativo', 'Norte', 'B', '987.654.321-00', '(11) 88888-8888', 'Av. Principal, 456'),
      ('Max', 'cão', '5 anos', 'Labrador', 'Macho', 'Curta', 'Dourado', 'Pedro Costa', 'Ativo', 'Sul', 'C', '456.789.123-00', '(11) 77777-7777', 'Rua do Sol, 789')
    `);
    
    // Inserir dados de exemplo para vacinas antirrábicas
    await client.query(`
      INSERT INTO rabies_vaccine_records 
      ("nomeAnimal", "tipo", "nomeTutor", "cpf", "telefone", "endereco", "localVacinacao", "loteVacina", "veterinario", "clinica", "quadra", "area", "dosePerdida")
      VALUES 
      ('Bella', 'gato', 'Maria Santos', '987.654.321-00', '(11) 88888-8888', 'Av. Principal, 456', 'centro_municipal', 'LOTE-2024-001', 'Dr. Carlos', 'Clínica Pet Care', 'B', 'Norte', false),
      ('Rex', 'cão', 'João Silva', '123.456.789-00', '(11) 99999-9999', 'Rua das Flores, 123', 'clinica_pet_care', 'LOTE-2024-002', 'Dr. Ana', 'Clínica Pet Care', 'A', 'Centro', false),
      ('Max', 'cão', 'Pedro Costa', '456.789.123-00', '(11) 77777-7777', 'Rua do Sol, 789', 'hospital_sao_francisco', 'LOTE-2024-003', 'Dr. Roberto', 'Hospital São Francisco', 'C', 'Sul', true)
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
