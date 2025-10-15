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
    
    if (event.httpMethod === 'GET') {
      // Mostrar dados atuais
      const leishmaniasisCount = await client.query('SELECT COUNT(*) as count FROM leishmaniasis_cases');
      const rabiesCount = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_data: {
            leishmaniasis_cases: parseInt(leishmaniasisCount.rows[0].count),
            rabies_vaccine_records: parseInt(rabiesCount.rows[0].count)
          },
          message: 'Para limpar todos os dados, faça POST para esta função'
        }),
      };
    }
    
    if (event.httpMethod === 'POST') {
      // Limpar todos os dados
      await client.query('DELETE FROM leishmaniasis_cases');
      await client.query('DELETE FROM rabies_vaccine_records');
      
      // Resetar sequências
      await client.query('ALTER SEQUENCE leishmaniasis_cases_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE rabies_vaccine_records_id_seq RESTART WITH 1');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Banco de dados limpo com sucesso!',
          cleared_tables: ['leishmaniasis_cases', 'rabies_vaccine_records'],
          sequences_reset: true
        }),
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Erro ao acessar banco de dados', 
        details: error.message 
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
