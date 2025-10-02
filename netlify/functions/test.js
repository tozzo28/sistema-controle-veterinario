exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message: 'Netlify Function working!',
      env: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set'
    }),
  };
};
