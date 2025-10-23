const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    
    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      const { id, ...updateData } = data;
      
      const result = await client.query(`
        UPDATE leishmaniasis_cases 
        SET "nomeAnimal" = $1, "tipoAnimal" = $2, "idade" = $3, "raca" = $4, 
            "sexo" = $5, "pelagem" = $6, "corPelagem" = $7, "nomeTutor" = $8, 
            "status" = $9, "area" = $10, "quadra" = $11, "cpf" = $12, 
            "telefone" = $13, "endereco" = $14
        WHERE id = $15
        RETURNING *
      `, [
        updateData.nomeAnimal, updateData.tipoAnimal, updateData.idade, updateData.raca,
        updateData.sexo, updateData.pelagem, updateData.corPelagem, updateData.nomeTutor,
        updateData.status, updateData.area, updateData.quadra, updateData.cpf,
        updateData.telefone, updateData.endereco, id
      ]);
      
      return {
        statusCode: 200,
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