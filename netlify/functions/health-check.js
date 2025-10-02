const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const prisma = new PrismaClient();
    
    // Teste de conexão
    await prisma.$connect();
    
    // Teste de operações básicas
    const casesCount = await prisma.leishmaniasisCase.count();
    const rabiesCount = await prisma.rabiesVaccineRecord.count();
    
    // Teste de criação de um registro temporário
    const testCase = await prisma.leishmaniasisCase.create({
      data: {
        nomeAnimal: "Teste",
        tipoAnimal: "cão",
        nomeTutor: "Teste",
        status: "Teste",
        area: "Teste",
        quadra: "Teste"
      }
    });
    
    // Deletar o registro de teste
    await prisma.leishmaniasisCase.delete({
      where: { id: testCase.id }
    });
    
    const result = {
      status: "SUCCESS",
      message: "Database connection and operations working!",
      environment: {
        nodeVersion: process.version,
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
      },
      database: {
        casesCount,
        rabiesCount,
        testOperation: "PASSED"
      },
      timestamp: new Date().toISOString()
    };
    
    await prisma.$disconnect();
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Health check error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: "ERROR",
        error: error.message,
        environment: {
          nodeVersion: process.version,
          databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
        }
      }),
    };
  }
};
