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
      // Mostrar contagem atual
      const leishmaniasisResult = await client.query('SELECT COUNT(*) as count FROM leishmaniasis_cases');
      const rabiesResult = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Dados atuais no banco:',
          leishmaniasis_cases: parseInt(leishmaniasisResult.rows[0].count),
          rabies_vaccine_records: parseInt(rabiesResult.rows[0].count),
          instruction: 'Para limpar todos os dados, faça uma requisição POST para esta função'
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
          message: '✅ Banco de dados limpo com sucesso!',
          details: {
            leishmaniasis_cases: 'Removidos',
            rabies_vaccine_records: 'Removidos',
            sequences: 'Resetadas para 1'
          }
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
