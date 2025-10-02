const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  let prisma;
  
  try {
    prisma = new PrismaClient();
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      // GET /api/rabies
      const rabies = await prisma.rabiesVaccineRecord.findMany({
        orderBy: { id: 'desc' },
      });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(rabies),
      };
    }

    if (event.httpMethod === 'POST') {
      // POST /api/rabies
      const data = JSON.parse(event.body);
      const created = await prisma.rabiesVaccineRecord.create({ 
        data: {
          ...data,
          dataVacinacao: new Date()
        }
      });
      
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // DELETE /api/rabies (id via body)
      const { id } = JSON.parse(event.body);
      await prisma.rabiesVaccineRecord.delete({ where: { id } });
      
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
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};