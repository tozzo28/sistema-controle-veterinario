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
      const result = await client.query('SELECT * FROM rabies_vaccine_records ORDER BY id DESC');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows),
      };
    }
    
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const result = await client.query(`
        INSERT INTO rabies_vaccine_records 
        ("nomeAnimal", "tipo", "nomeTutor", "localVacinacao", "loteVacina", "quadra", "area", "dosePerdida", "endereco", "latitude", "longitude")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        data.nomeAnimal, data.tipo, data.nomeTutor, data.localVacinacao, data.loteVacina,
        data.quadra, data.area, data.dosePerdida || false, data.endereco,
        data.latitude ? parseFloat(data.latitude) : null,
        data.longitude ? parseFloat(data.longitude) : null
      ]);
      
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows[0]),
      };
    }
    
    if (event.httpMethod === 'PUT') {
      const { id, ...data } = JSON.parse(event.body);
      
      console.log('🔄 [PUT] Atualizando registro:', { id, data });
      
      // Converter dataVacinacao para Date se fornecida
      let dataVacinacao = data.dataVacinacao ? new Date(data.dataVacinacao) : null;
      
      // Garantir que latitude e longitude sejam números ou null
      const latitude = (data.latitude !== null && data.latitude !== undefined && data.latitude !== '') 
        ? parseFloat(data.latitude) 
        : null;
      const longitude = (data.longitude !== null && data.longitude !== undefined && data.longitude !== '') 
        ? parseFloat(data.longitude) 
        : null;
      
      // Verificar se o registro existe
      const checkResult = await client.query('SELECT id FROM rabies_vaccine_records WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Registro não encontrado' }),
        };
      }
      
      const result = await client.query(`
        UPDATE rabies_vaccine_records 
        SET "nomeAnimal" = $1, "tipo" = $2, "nomeTutor" = $3, 
            "dataVacinacao" = COALESCE($4, "dataVacinacao"),
            "localVacinacao" = $5, "loteVacina" = $6, "quadra" = $7, 
            "area" = $8, "dosePerdida" = $9, "endereco" = $10, 
            "latitude" = $11, "longitude" = $12
        WHERE id = $13
        RETURNING *
      `, [
        data.nomeAnimal, data.tipo, data.nomeTutor, dataVacinacao,
        data.localVacinacao, data.loteVacina, data.quadra, data.area, 
        data.dosePerdida || false, data.endereco || null,
        isNaN(latitude) ? null : latitude,
        isNaN(longitude) ? null : longitude,
        id
      ]);
      
      console.log('✅ [PUT] Registro atualizado:', result.rows[0]);
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows[0]),
      };
    }
    
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await client.query('DELETE FROM rabies_vaccine_records WHERE id = $1', [id]);
      
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
