exports.handler = async (event, context) => {
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
      // GET /api/cases - retorna dados mockados temporariamente
      const mockCases = [
        {
          id: 1,
          nomeAnimal: "Rex",
          tipoAnimal: "cão",
          idade: "3 anos",
          raca: "Pastor Alemão",
          sexo: "Macho",
          pelagem: "Curta",
          corPelagem: "Preto",
          nomeTutor: "João Silva",
          status: "Ativo",
          area: "Centro",
          quadra: "A",
          dataNotificacao: "2024-01-15T10:30:00.000Z",
          cpf: "123.456.789-00",
          telefone: "(11) 99999-9999",
          endereco: "Rua das Flores, 123"
        }
      ];
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCases),
      };
    }

    if (event.httpMethod === 'POST') {
      // POST /api/cases
      const data = JSON.parse(event.body);
      const mockResponse = {
        id: Date.now(),
        ...data,
        dataNotificacao: new Date().toISOString(),
      };
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockResponse),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // DELETE /api/cases (id via body)
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
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};