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
    
    // Verificar quais colunas já existem
    const columnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'rabies_vaccine_records' 
      AND column_name IN ('idade', 'raca', 'sexo', 'cpf', 'telefone', 'veterinario', 'clinica', 'endereco', 'latitude', 'longitude')
    `);
    
    const existingColumns = columnsCheck.rows.map(row => row.column_name);
    const results = [];
    
    // Lista de colunas a adicionar
    const columnsToAdd = [
      { name: 'idade', type: 'VARCHAR(50)' },
      { name: 'raca', type: 'VARCHAR(100)' },
      { name: 'sexo', type: 'VARCHAR(20)' },
      { name: 'cpf', type: 'VARCHAR(20)' },
      { name: 'telefone', type: 'VARCHAR(20)' },
      { name: 'veterinario', type: 'VARCHAR(255)' },
      { name: 'clinica', type: 'VARCHAR(255)' },
      { name: 'endereco', type: 'TEXT' },
      { name: 'latitude', type: 'DECIMAL(10, 8)' },
      { name: 'longitude', type: 'DECIMAL(11, 8)' }
    ];
    
    // Adicionar cada coluna se não existir
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        try {
          await client.query(`
            ALTER TABLE rabies_vaccine_records 
            ADD COLUMN "${column.name}" ${column.type}
          `);
          results.push(`Coluna ${column.name} adicionada com sucesso`);
          console.log(`✅ Coluna ${column.name} adicionada`);
        } catch (error) {
          results.push(`Erro ao adicionar coluna ${column.name}: ${error.message}`);
          console.error(`❌ Erro ao adicionar coluna ${column.name}:`, error);
        }
      } else {
        results.push(`Coluna ${column.name} já existe`);
        console.log(`ℹ️ Coluna ${column.name} já existe`);
      }
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
      message: 'Colunas faltantes verificadas/adicionadas na tabela de vacinação!',
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

