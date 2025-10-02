const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event, context) => {
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
      const [total, caes, gatos, dosesPerdidas, centro, clinica, hospital] = await Promise.all([
        prisma.rabiesVaccineRecord.count(),
        prisma.rabiesVaccineRecord.count({ where: { tipo: 'cao' } }),
        prisma.rabiesVaccineRecord.count({ where: { tipo: 'gato' } }),
        prisma.rabiesVaccineRecord.count({ where: { dosePerdida: true } }),
        prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['centro_municipal', 'Centro Veterinário Municipal'] } } }),
        prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['clinica_pet_care', 'Clínica Pet Care'] } } }),
        prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['hospital_sao_francisco', 'Hospital Veterinário São Francisco'] } } }),
      ]);
      
      const stats = { total, caes, gatos, dosesPerdidas, locais: { centro, clinica, hospital } };
      
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
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
