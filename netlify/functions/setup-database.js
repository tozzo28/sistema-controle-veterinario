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
    
    // Criar tabela de casos de leishmaniose
    await client.query(`
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
      )
    `);
    
    // Criar tabela de registros de vacina antirrábica
    await client.query(`
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
      )
    `);
    
    // Verificar se as tabelas foram criadas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('leishmaniasis_cases', 'rabies_vaccine_records')
    `);
    
    // Contar registros em cada tabela
    const casesCount = await client.query('SELECT COUNT(*) as count FROM leishmaniasis_cases');
    const rabiesCount = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
    
    const response = {
      status: 'SUCCESS',
      message: 'Database setup completed!',
      tables: tablesResult.rows.map(row => row.table_name),
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
    console.error('Setup error:', error);
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
