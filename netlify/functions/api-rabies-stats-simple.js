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
    // Conexão direta com PostgreSQL
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // Consultas SQL diretas
    const totalResult = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records');
    const caesResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE tipo = 'cao'");
    const gatosResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE tipo = 'gato'");
    const dosesPerdidasResult = await client.query('SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE "dosePerdida" = true');
    
    const centroResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE \"localVacinacao\" = 'centro_municipal'");
    const clinicaResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE \"localVacinacao\" = 'clinica_pet_care'");
    const hospitalResult = await client.query("SELECT COUNT(*) as count FROM rabies_vaccine_records WHERE \"localVacinacao\" = 'hospital_sao_francisco'");
    
    const stats = {
      total: parseInt(totalResult.rows[0].count),
      caes: parseInt(caesResult.rows[0].count),
      gatos: parseInt(gatosResult.rows[0].count),
      dosesPerdidas: parseInt(dosesPerdidasResult.rows[0].count),
      locais: {
        centro: parseInt(centroResult.rows[0].count),
        clinica: parseInt(clinicaResult.rows[0].count),
        hospital: parseInt(hospitalResult.rows[0].count)
      }
    };
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
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
