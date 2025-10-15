const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let client;
  
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    console.log('Conectado ao banco de dados. Iniciando limpeza...');
    
    // Limpar todas as tabelas
    await client.query('DELETE FROM leishmaniasis_cases');
    console.log('Dados de leishmaniasis_cases removidos');
    
    await client.query('DELETE FROM rabies_vaccine_records');
    console.log('Dados de rabies_vaccine_records removidos');
    
    // Resetar sequências (auto-increment)
    await client.query('ALTER SEQUENCE leishmaniasis_cases_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE rabies_vaccine_records_id_seq RESTART WITH 1');
    console.log('Sequências resetadas');
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Banco de dados limpo com sucesso!',
        details: {
          leishmaniasis_cases: 'Removidos',
          rabies_vaccine_records: 'Removidos',
          sequences: 'Resetadas'
        }
      }),
    };
    
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Erro ao limpar banco de dados', 
        details: error.message 
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
