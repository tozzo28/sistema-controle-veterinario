const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  const prisma = new PrismaClient();
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Teste básico de conexão
    await prisma.$connect();
    
    // Teste de contagem nas tabelas
    const casesCount = await prisma.leishmaniasisCase.count();
    const rabiesCount = await prisma.rabiesVaccineRecord.count();
    
    const result = {
      message: 'Database connection successful!',
      databaseUrl: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set',
      tables: {
        leishmaniasis_cases: casesCount,
        rabies_vaccine_records: rabiesCount
      },
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Database test error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Database connection failed', 
        details: error.message,
        databaseUrl: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set'
      }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
