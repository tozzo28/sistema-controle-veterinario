const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let client;
  
  try {
    // Teste básico de conexão
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // Teste simples - listar tabelas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Teste de contagem em cada tabela
    const results = {};
    for (const table of tablesResult.rows) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        results[table.table_name] = parseInt(countResult.rows[0].count);
      } catch (err) {
        results[table.table_name] = `Error: ${err.message}`;
      }
    }
    
    const response = {
      status: 'SUCCESS',
      message: 'Database connection working!',
      environment: {
        nodeVersion: process.version,
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
      },
      tables: results,
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'ERROR',
        error: error.message,
        environment: {
          nodeVersion: process.version,
          databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
        }
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
