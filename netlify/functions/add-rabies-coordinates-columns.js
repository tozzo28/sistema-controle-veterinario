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
    
    // Verificar se as colunas já existem
    const columnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'rabies_vaccine_records' 
      AND column_name IN ('endereco', 'latitude', 'longitude')
    `);
    
    const existingColumns = columnsCheck.rows.map(row => row.column_name);
    const results = [];
    
    // Adicionar coluna endereco se não existir
    if (!existingColumns.includes('endereco')) {
      await client.query(`
        ALTER TABLE rabies_vaccine_records 
        ADD COLUMN endereco TEXT
      `);
      results.push('Coluna endereco adicionada');
    } else {
      results.push('Coluna endereco já existe');
    }
    
    // Adicionar coluna latitude se não existir
    if (!existingColumns.includes('latitude')) {
      await client.query(`
        ALTER TABLE rabies_vaccine_records 
        ADD COLUMN latitude DECIMAL(10, 8)
      `);
      results.push('Coluna latitude adicionada');
    } else {
      results.push('Coluna latitude já existe');
    }
    
    // Adicionar coluna longitude se não existir
    if (!existingColumns.includes('longitude')) {
      await client.query(`
        ALTER TABLE rabies_vaccine_records 
        ADD COLUMN longitude DECIMAL(11, 8)
      `);
      results.push('Coluna longitude adicionada');
    } else {
      results.push('Coluna longitude já existe');
    }
    
    // Verificar estrutura final da tabela
    const finalStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'rabies_vaccine_records'
      ORDER BY ordinal_position
    `);
    
    const response = {
      status: 'SUCCESS',
      message: 'Colunas de coordenadas verificadas/adicionadas na tabela de vacinação!',
      changes: results,
      table_structure: finalStructure.rows,
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'ERROR',
        error: error.message,
        details: error.stack
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
