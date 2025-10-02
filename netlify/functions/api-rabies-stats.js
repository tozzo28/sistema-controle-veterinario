const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  const prisma = new PrismaClient();
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      // GET /api/rabies/stats
      const total = await prisma.rabiesVaccineRecord.count();
      const caes = await prisma.rabiesVaccineRecord.count({ 
        where: { tipo: 'cao' } 
      });
      const gatos = await prisma.rabiesVaccineRecord.count({ 
        where: { tipo: 'gato' } 
      });
      const dosesPerdidas = await prisma.rabiesVaccineRecord.count({ 
        where: { dosePerdida: true } 
      });

      const locais = {
        centro: await prisma.rabiesVaccineRecord.count({ 
          where: { localVacinacao: 'centro_municipal' } 
        }),
        clinica: await prisma.rabiesVaccineRecord.count({ 
          where: { localVacinacao: 'clinica_pet_care' } 
        }),
        hospital: await prisma.rabiesVaccineRecord.count({ 
          where: { localVacinacao: 'hospital_sao_francisco' } 
        }),
      };
      
      const stats = {
        total,
        caes,
        gatos,
        dosesPerdidas,
        locais
      };
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
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
    await prisma.$disconnect();
  }
};