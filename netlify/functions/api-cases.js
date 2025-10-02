const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  const prisma = new PrismaClient();
  
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
      // GET /api/cases
      const cases = await prisma.leishmaniasisCase.findMany({
        orderBy: { id: 'desc' },
      });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(cases),
      };
    }

    if (event.httpMethod === 'POST') {
      // POST /api/cases
      const data = JSON.parse(event.body);
      const created = await prisma.leishmaniasisCase.create({ 
        data: {
          ...data,
          dataNotificacao: new Date()
        }
      });
      
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // DELETE /api/cases (id via body)
      const { id } = JSON.parse(event.body);
      await prisma.leishmaniasisCase.delete({ where: { id } });
      
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
    await prisma.$disconnect();
  }
};