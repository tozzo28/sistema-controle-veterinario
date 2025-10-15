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
    console.log('Conectado ao banco de dados');
    
    // Verificar dados antes da limpeza
    const leishmaniasisCount = await client.query('SELECT COUNT(*) FROM leishmaniasis_cases');
    const rabiesCount = await client.query('SELECT COUNT(*) FROM rabies_vaccine_records');
    
    console.log(`Antes da limpeza - Leishmaniasis: ${leishmaniasisCount.rows[0].count}, Rabies: ${rabiesCount.rows[0].count}`);
    
    if (event.httpMethod === 'POST') {
      // Limpar dados
      await client.query('DELETE FROM leishmaniasis_cases');
      await client.query('DELETE FROM rabies_vaccine_records');
      
      // Resetar sequências
      await client.query('ALTER SEQUENCE leishmaniasis_cases_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE rabies_vaccine_records_id_seq RESTART WITH 1');
      
      console.log('Dados limpos com sucesso');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Banco de dados limpo com sucesso!',
          before: {
            leishmaniasis: parseInt(leishmaniasisCount.rows[0].count),
            rabies: parseInt(rabiesCount.rows[0].count)
          },
          after: {
            leishmaniasis: 0,
            rabies: 0
          }
        }),
      };
    } else {
      // GET - apenas mostrar contagem
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          current_data: {
            leishmaniasis: parseInt(leishmaniasisCount.rows[0].count),
            rabies: parseInt(rabiesCount.rows[0].count)
          }
        }),
      };
    }
    
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
