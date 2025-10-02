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
      // GET /api/rabies - retorna dados mockados temporariamente
      const mockRabies = [
        {
          id: 1,
          nomeAnimal: "Bella",
          tipo: "gato",
          idade: "2 anos",
          raca: "Siamês",
          sexo: "Fêmea",
          nomeTutor: "Maria Santos",
          cpf: "987.654.321-00",
          telefone: "(11) 88888-8888",
          endereco: "Av. Principal, 456",
          dataVacinacao: "2024-01-10T14:00:00.000Z",
          localVacinacao: "centro_municipal",
          loteVacina: "LOTE-2024-001",
          veterinario: "Dr. Carlos",
          clinica: "Clínica Pet Care",
          quadra: "B",
          area: "Norte",
          dosePerdida: false
        }
      ];
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockRabies),
      };
    }

    if (event.httpMethod === 'POST') {
      // POST /api/rabies
      const data = JSON.parse(event.body);
      const mockResponse = {
        id: Date.now(),
        ...data,
        dataVacinacao: new Date().toISOString(),
      };
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockResponse),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // DELETE /api/rabies (id via body)
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