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
      try {
        const body = JSON.parse(event.body);
        const { id, ...data } = body;
        
        console.log('🔄 [PUT] Recebida requisição de atualização');
        console.log('🔄 [PUT] ID:', id);
        console.log('🔄 [PUT] Dados recebidos:', JSON.stringify(data, null, 2));
        
        if (!id) {
          return {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'ID do registro é obrigatório' }),
          };
        }
        
        // Converter dataVacinacao para Date se fornecida
        let dataVacinacao = null;
        if (data.dataVacinacao) {
          try {
            dataVacinacao = new Date(data.dataVacinacao);
            if (isNaN(dataVacinacao.getTime())) {
              console.warn('⚠️ [PUT] Data inválida, usando null:', data.dataVacinacao);
              dataVacinacao = null;
            }
          } catch (e) {
            console.warn('⚠️ [PUT] Erro ao converter data:', e);
            dataVacinacao = null;
          }
        }
        
        // Garantir que latitude e longitude sejam números ou null
        const latitude = (data.latitude !== null && data.latitude !== undefined && data.latitude !== '') 
          ? parseFloat(data.latitude) 
          : null;
        const longitude = (data.longitude !== null && data.longitude !== undefined && data.longitude !== '') 
          ? parseFloat(data.longitude) 
          : null;
        
        console.log('🔄 [PUT] Valores processados:', {
          dataVacinacao: dataVacinacao?.toISOString() || null,
          latitude: isNaN(latitude) ? null : latitude,
          longitude: isNaN(longitude) ? null : longitude,
        });
        
        // Verificar se o registro existe
        const checkResult = await client.query('SELECT id FROM rabies_vaccine_records WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
          console.error('❌ [PUT] Registro não encontrado:', id);
          return {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Registro com ID ${id} não encontrado` }),
          };
        }
        
        console.log('✅ [PUT] Registro encontrado, executando UPDATE...');
        
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
        
        if (result.rows.length === 0) {
          console.error('❌ [PUT] Nenhuma linha foi atualizada');
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Nenhuma linha foi atualizada' }),
          };
        }
        
        console.log('✅ [PUT] Registro atualizado com sucesso:', result.rows[0]);
        console.log('✅ [PUT] Nome animal atualizado:', result.rows[0].nomeAnimal);
        console.log('✅ [PUT] Tutor atualizado:', result.rows[0].nomeTutor);
        
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(result.rows[0]),
        };
      } catch (updateError) {
        console.error('❌ [PUT] Erro ao processar atualização:', updateError);
        console.error('❌ [PUT] Stack:', updateError.stack);
        return {
          statusCode: 500,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            error: 'Erro interno ao atualizar registro',
            details: updateError.message 
          }),
        };
      }
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
