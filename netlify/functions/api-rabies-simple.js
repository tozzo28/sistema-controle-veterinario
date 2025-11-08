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
      console.log('📥 [GET] Buscando todos os registros de vacinação...');
      const result = await client.query('SELECT * FROM rabies_vaccine_records ORDER BY id DESC');
      
      console.log('✅ [GET] Registros encontrados:', result.rows.length);
      result.rows.forEach(row => {
        console.log('📋 [GET] Registro ID', row.id, ':', {
          nomeAnimal: row.nomeAnimal,
          nomeTutor: row.nomeTutor,
          idade: row.idade,
          raca: row.raca,
          sexo: row.sexo,
          cpf: row.cpf,
          telefone: row.telefone,
          veterinario: row.veterinario,
          clinica: row.clinica,
          localVacinacao: row.localVacinacao,
          area: row.area,
          quadra: row.quadra,
        });
      });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(result.rows),
      };
    }
    
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      // Verificar se as colunas existem, se não, tentar adicioná-las
      try {
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'rabies_vaccine_records' 
          AND column_name = 'idade'
        `);
        
        if (columnCheck.rows.length === 0) {
          console.log('⚠️ [POST] Colunas faltantes detectadas, adicionando...');
          // Adicionar colunas faltantes
          const columnsToAdd = [
            { name: 'idade', type: 'VARCHAR(50)' },
            { name: 'raca', type: 'VARCHAR(100)' },
            { name: 'sexo', type: 'VARCHAR(20)' },
            { name: 'cpf', type: 'VARCHAR(20)' },
            { name: 'telefone', type: 'VARCHAR(20)' },
            { name: 'veterinario', type: 'VARCHAR(255)' },
            { name: 'clinica', type: 'VARCHAR(255)' }
          ];
          
          for (const column of columnsToAdd) {
            try {
              await client.query(`ALTER TABLE rabies_vaccine_records ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}`);
              console.log(`✅ [POST] Coluna ${column.name} adicionada`);
            } catch (colError) {
              console.warn(`⚠️ [POST] Erro ao adicionar coluna ${column.name}:`, colError.message);
            }
          }
        }
      } catch (checkError) {
        console.warn('⚠️ [POST] Erro ao verificar colunas:', checkError.message);
      }
      
      // Converter dataVacinacao para Date se fornecida
      let dataVacinacao = data.dataVacinacao ? new Date(data.dataVacinacao) : new Date();
      if (isNaN(dataVacinacao.getTime())) {
        dataVacinacao = new Date();
      }
      
      const result = await client.query(`
        INSERT INTO rabies_vaccine_records 
        ("nomeAnimal", "tipo", "nomeTutor", "idade", "raca", "sexo", "cpf", "telefone", 
         "dataVacinacao", "localVacinacao", "loteVacina", "veterinario", "clinica", 
         "quadra", "area", "dosePerdida", "endereco", "latitude", "longitude")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `, [
        data.nomeAnimal, 
        data.tipo, 
        data.nomeTutor, 
        data.idade || null,
        data.raca || null,
        data.sexo || null,
        data.cpf || null,
        data.telefone || null,
        dataVacinacao,
        data.localVacinacao, 
        data.loteVacina,
        data.veterinario || null,
        data.clinica || null,
        data.quadra, 
        data.area, 
        data.dosePerdida || false, 
        data.endereco || null,
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
      const data = JSON.parse(event.body);
      const { id, ...updateData } = data;
      
      // Verificar se as colunas existem, se não, tentar adicioná-las
      try {
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'rabies_vaccine_records' 
          AND column_name = 'idade'
        `);
        
        if (columnCheck.rows.length === 0) {
          console.log('⚠️ [PUT] Colunas faltantes detectadas, adicionando...');
          // Adicionar colunas faltantes
          const columnsToAdd = [
            { name: 'idade', type: 'VARCHAR(50)' },
            { name: 'raca', type: 'VARCHAR(100)' },
            { name: 'sexo', type: 'VARCHAR(20)' },
            { name: 'cpf', type: 'VARCHAR(20)' },
            { name: 'telefone', type: 'VARCHAR(20)' },
            { name: 'veterinario', type: 'VARCHAR(255)' },
            { name: 'clinica', type: 'VARCHAR(255)' }
          ];
          
          for (const column of columnsToAdd) {
            try {
              await client.query(`ALTER TABLE rabies_vaccine_records ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}`);
              console.log(`✅ [PUT] Coluna ${column.name} adicionada`);
            } catch (colError) {
              console.warn(`⚠️ [PUT] Erro ao adicionar coluna ${column.name}:`, colError.message);
            }
          }
        }
      } catch (checkError) {
        console.warn('⚠️ [PUT] Erro ao verificar colunas:', checkError.message);
      }
      
      // Converter dataVacinacao para Date se fornecida e válida
      let dataVacinacao = null;
      if (updateData.dataVacinacao) {
        try {
          // Tentar converter a data - pode vir como string "YYYY-MM-DD" ou ISO
          dataVacinacao = new Date(updateData.dataVacinacao);
          // Verificar se a data é válida
          if (isNaN(dataVacinacao.getTime())) {
            dataVacinacao = null;
          }
        } catch (e) {
          dataVacinacao = null;
        }
      }
      
      // Se não há data válida, manter a data atual do registro (usando COALESCE no SQL)
      
      console.log('🔄 [PUT] Executando UPDATE com valores:', {
        id: id,
        nomeAnimal: updateData.nomeAnimal,
        tipo: updateData.tipo,
        nomeTutor: updateData.nomeTutor,
        idade: updateData.idade || null,
        raca: updateData.raca || null,
        sexo: updateData.sexo || null,
        cpf: updateData.cpf || null,
        telefone: updateData.telefone || null,
        dataVacinacao: dataVacinacao?.toISOString() || 'null (manter atual)',
        localVacinacao: updateData.localVacinacao,
        loteVacina: updateData.loteVacina,
        veterinario: updateData.veterinario || null,
        clinica: updateData.clinica || null,
        quadra: updateData.quadra,
        area: updateData.area,
        dosePerdida: updateData.dosePerdida || false,
        endereco: updateData.endereco || null,
        latitude: updateData.latitude ? parseFloat(updateData.latitude) : null,
        longitude: updateData.longitude ? parseFloat(updateData.longitude) : null,
      });
      
      const result = await client.query(`
        UPDATE rabies_vaccine_records 
        SET "nomeAnimal" = $1, "tipo" = $2, "nomeTutor" = $3, 
            "idade" = $4, "raca" = $5, "sexo" = $6,
            "cpf" = $7, "telefone" = $8,
            "dataVacinacao" = COALESCE($9, "dataVacinacao"),
            "localVacinacao" = $10, "loteVacina" = $11, 
            "veterinario" = $12, "clinica" = $13,
            "quadra" = $14, "area" = $15, 
            "dosePerdida" = $16, "endereco" = $17, 
            "latitude" = $18, "longitude" = $19
        WHERE id = $20
        RETURNING *
      `, [
        updateData.nomeAnimal, 
        updateData.tipo, 
        updateData.nomeTutor,
        updateData.idade || null,
        updateData.raca || null,
        updateData.sexo || null,
        updateData.cpf || null,
        updateData.telefone || null,
        dataVacinacao,
        updateData.localVacinacao, 
        updateData.loteVacina,
        updateData.veterinario || null,
        updateData.clinica || null,
        updateData.quadra, 
        updateData.area, 
        updateData.dosePerdida || false, 
        updateData.endereco || null,
        updateData.latitude ? parseFloat(updateData.latitude) : null,
        updateData.longitude ? parseFloat(updateData.longitude) : null,
        id
      ]);
      
      if (!result.rows || result.rows.length === 0) {
        console.error('❌ [PUT] UPDATE não retornou nenhuma linha');
        return {
          statusCode: 500,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'UPDATE não retornou dados' }),
        };
      }
      
      console.log('✅ [PUT] UPDATE executado com sucesso');
      console.log('✅ [PUT] Dados retornados pelo UPDATE:', {
        id: result.rows[0].id,
        nomeAnimal: result.rows[0].nomeAnimal,
        nomeTutor: result.rows[0].nomeTutor,
        idade: result.rows[0].idade,
        raca: result.rows[0].raca,
        sexo: result.rows[0].sexo,
        cpf: result.rows[0].cpf,
        telefone: result.rows[0].telefone,
        localVacinacao: result.rows[0].localVacinacao,
        area: result.rows[0].area,
        quadra: result.rows[0].quadra,
        loteVacina: result.rows[0].loteVacina,
        veterinario: result.rows[0].veterinario,
        clinica: result.rows[0].clinica,
        endereco: result.rows[0].endereco,
        latitude: result.rows[0].latitude,
        longitude: result.rows[0].longitude,
      });
      
      // Verificar diretamente no banco se os dados foram realmente salvos
      const verifyResult = await client.query('SELECT * FROM rabies_vaccine_records WHERE id = $1', [id]);
      if (verifyResult.rows.length > 0) {
        console.log('✅ [PUT] Verificação no banco - dados confirmados:', {
          id: verifyResult.rows[0].id,
          nomeAnimal: verifyResult.rows[0].nomeAnimal,
          nomeTutor: verifyResult.rows[0].nomeTutor,
          idade: verifyResult.rows[0].idade,
          raca: verifyResult.rows[0].raca,
          sexo: verifyResult.rows[0].sexo,
          cpf: verifyResult.rows[0].cpf,
          telefone: verifyResult.rows[0].telefone,
          veterinario: verifyResult.rows[0].veterinario,
          clinica: verifyResult.rows[0].clinica,
          localVacinacao: verifyResult.rows[0].localVacinacao,
          area: verifyResult.rows[0].area,
          quadra: verifyResult.rows[0].quadra,
        });
      } else {
        console.error('❌ [PUT] ERRO: Registro não encontrado no banco após UPDATE!');
      }
      
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
