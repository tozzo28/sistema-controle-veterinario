const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
      const result = await client.query('SELECT * FROM leishmaniasis_cases ORDER BY id DESC');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows),
      };
    }
    
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const result = await client.query(`
        INSERT INTO leishmaniasis_cases 
        ("nomeAnimal", "tipoAnimal", "idade", "raca", "sexo", "pelagem", "corPelagem", "nomeTutor", "status", "area", "quadra", "cpf", "telefone", "endereco", "dataNotificacao")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        data.nomeAnimal, data.tipoAnimal, data.idade, data.raca, data.sexo,
        data.pelagem, data.corPelagem, data.nomeTutor, data.status, data.area,
        data.quadra, data.cpf, data.telefone, data.endereco, new Date()
      ]);
      
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows[0]),
      };
    }
    
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await client.query('DELETE FROM leishmaniasis_cases WHERE id = $1', [id]);
      
      return {
        statusCode: 204,
        headers,
        body: '',
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};