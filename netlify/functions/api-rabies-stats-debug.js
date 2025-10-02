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
    console.log('Starting rabies stats function...');
    
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Verificar se a tabela existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rabies_vaccine_records'
      )
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);
    
    if (!tableExists.rows[0].exists) {
      return {
        statusCode: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Table rabies_vaccine_records does not exist',
          suggestion: 'Run setup-database function first'
        }),
      };
    }
    
    // Consultas SQL com tratamento de erro
    let total = 0, caes = 0, gatos = 0, dosesPerdidas = 0;
    let centro = 0, clinica = 0, hospital = 0;
    
    try {
      const totalResult = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
      total = parseInt(totalResult.rows[0].count);
      console.log('Total records:', total);
    } catch (err) {
      console.error('Error counting total:', err.message);
    }
    
    try {
      const caesResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE tipo = 'cao'");
      caes = parseInt(caesResult.rows[0].count);
      console.log('Caes count:', caes);
    } catch (err) {
      console.error('Error counting caes:', err.message);
    }
    
    try {
      const gatosResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE tipo = 'gato'");
      gatos = parseInt(gatosResult.rows[0].count);
      console.log('Gatos count:', gatos);
    } catch (err) {
      console.error('Error counting gatos:', err.message);
    }
    
    try {
      const dosesPerdidasResult = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE dose_perdida = true');
      dosesPerdidas = parseInt(dosesPerdidasResult.rows[0].count);
      console.log('Doses perdidas count:', dosesPerdidas);
    } catch (err) {
      console.error('Error counting doses perdidas:', err.message);
    }
    
    try {
      const centroResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE local_vacinacao = 'centro_municipal'");
      centro = parseInt(centroResult.rows[0].count);
      console.log('Centro count:', centro);
    } catch (err) {
      console.error('Error counting centro:', err.message);
    }
    
    try {
      const clinicaResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE local_vacinacao = 'clinica_pet_care'");
      clinica = parseInt(clinicaResult.rows[0].count);
      console.log('Clinica count:', clinica);
    } catch (err) {
      console.error('Error counting clinica:', err.message);
    }
    
    try {
      const hospitalResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE local_vacinacao = 'hospital_sao_francisco'");
      hospital = parseInt(hospitalResult.rows[0].count);
      console.log('Hospital count:', hospital);
    } catch (err) {
      console.error('Error counting hospital:', err.message);
    }
    
    const stats = {
      total,
      caes,
      gatos,
      dosesPerdidas,
      locais: {
        centro,
        clinica,
        hospital
      }
    };
    
    console.log('Final stats:', stats);
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
    };
  } finally {
    if (client) {
      try {
        await client.end();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
};
