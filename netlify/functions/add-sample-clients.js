const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let client;
  
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    console.log('Conectado ao banco de dados. Adicionando 10 clientes...');
    
    // Dados dos 5 cachorros
    const cachorros = [
      {
        nomeAnimal: 'Rex',
        tipoAnimal: 'cao',
        idade: '3 anos',
        raca: 'Pastor Alemão',
        sexo: 'Macho',
        pelagem: 'Curta',
        corPelagem: 'Preto',
        nomeTutor: 'João Silva',
        status: 'positivo',
        area: 'Centro',
        quadra: 'A',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        endereco: 'Rua das Flores, 123'
      },
      {
        nomeAnimal: 'Max',
        tipoAnimal: 'cao',
        idade: '5 anos',
        raca: 'Labrador',
        sexo: 'Macho',
        pelagem: 'Curta',
        corPelagem: 'Dourado',
        nomeTutor: 'Pedro Costa',
        status: 'tratamento',
        area: 'Norte',
        quadra: 'B',
        cpf: '456.789.123-00',
        telefone: '(11) 88888-8888',
        endereco: 'Av. Principal, 456'
      },
      {
        nomeAnimal: 'Thor',
        tipoAnimal: 'cao',
        idade: '4 anos',
        raca: 'Rottweiler',
        sexo: 'Macho',
        pelagem: 'Curta',
        corPelagem: 'Preto',
        nomeTutor: 'Carlos Mendes',
        status: 'notificado',
        area: 'Sul',
        quadra: 'C',
        cpf: '321.654.987-00',
        telefone: '(11) 77777-7777',
        endereco: 'Rua do Sol, 789'
      },
      {
        nomeAnimal: 'Zeus',
        tipoAnimal: 'cao',
        idade: '2 anos',
        raca: 'Golden Retriever',
        sexo: 'Macho',
        pelagem: 'Longa',
        corPelagem: 'Dourado',
        nomeTutor: 'Roberto Santos',
        status: 'positivo',
        area: 'Leste',
        quadra: 'D',
        cpf: '147.258.369-00',
        telefone: '(11) 66666-6666',
        endereco: 'Av. Central, 147'
      },
      {
        nomeAnimal: 'Rocky',
        tipoAnimal: 'cao',
        idade: '7 anos',
        raca: 'Bulldog',
        sexo: 'Macho',
        pelagem: 'Curta',
        corPelagem: 'Branco',
        nomeTutor: 'Marcos Pereira',
        status: 'tratamento',
        area: 'Oeste',
        quadra: 'E',
        cpf: '258.147.369-00',
        telefone: '(11) 55555-5555',
        endereco: 'Av. dos Eucaliptos, 369'
      }
    ];

    // Dados dos 5 gatos
    const gatos = [
      {
        nomeAnimal: 'Mimi',
        tipoAnimal: 'gato',
        idade: '2 anos',
        raca: 'Siamês',
        sexo: 'Fêmea',
        pelagem: 'Curta',
        corPelagem: 'Branco',
        nomeTutor: 'Maria Santos',
        status: 'notificado',
        area: 'Centro',
        quadra: 'A',
        cpf: '987.654.321-00',
        telefone: '(11) 44444-4444',
        endereco: 'Rua da Paz, 321'
      },
      {
        nomeAnimal: 'Bella',
        tipoAnimal: 'gato',
        idade: '1 ano',
        raca: 'Persa',
        sexo: 'Fêmea',
        pelagem: 'Longa',
        corPelagem: 'Cinza',
        nomeTutor: 'Ana Oliveira',
        status: 'positivo',
        area: 'Norte',
        quadra: 'B',
        cpf: '789.123.456-00',
        telefone: '(11) 33333-3333',
        endereco: 'Rua dos Lírios, 987'
      },
      {
        nomeAnimal: 'Luna',
        tipoAnimal: 'gato',
        idade: '6 meses',
        raca: 'Maine Coon',
        sexo: 'Fêmea',
        pelagem: 'Longa',
        corPelagem: 'Tigrado',
        nomeTutor: 'Patricia Lima',
        status: 'tratamento',
        area: 'Sul',
        quadra: 'C',
        cpf: '654.321.789-00',
        telefone: '(11) 22222-2222',
        endereco: 'Av. das Palmeiras, 654'
      },
      {
        nomeAnimal: 'Nina',
        tipoAnimal: 'gato',
        idade: '3 anos',
        raca: 'Siamês',
        sexo: 'Fêmea',
        pelagem: 'Curta',
        corPelagem: 'Branco',
        nomeTutor: 'Fernanda Costa',
        status: 'notificado',
        area: 'Leste',
        quadra: 'D',
        cpf: '369.258.147-00',
        telefone: '(11) 11111-1111',
        endereco: 'Rua das Acácias, 258'
      },
      {
        nomeAnimal: 'Mel',
        tipoAnimal: 'gato',
        idade: '4 anos',
        raca: 'Angorá',
        sexo: 'Fêmea',
        pelagem: 'Longa',
        corPelagem: 'Branco',
        nomeTutor: 'Lucia Ferreira',
        status: 'positivo',
        area: 'Oeste',
        quadra: 'E',
        cpf: '741.852.963-00',
        telefone: '(11) 00000-0000',
        endereco: 'Rua das Rosas, 741'
      }
    ];

    // Inserir cachorros
    for (const cachorro of cachorros) {
      await client.query(`
        INSERT INTO leishmaniasis_cases 
        ("nomeAnimal", "tipoAnimal", "idade", "raca", "sexo", "pelagem", "corPelagem", "nomeTutor", "status", "area", "quadra", "cpf", "telefone", "endereco", "dataNotificacao")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        cachorro.nomeAnimal, cachorro.tipoAnimal, cachorro.idade, cachorro.raca,
        cachorro.sexo, cachorro.pelagem, cachorro.corPelagem, cachorro.nomeTutor,
        cachorro.status, cachorro.area, cachorro.quadra, cachorro.cpf,
        cachorro.telefone, cachorro.endereco, new Date()
      ]);
    }

    // Inserir gatos
    for (const gato of gatos) {
      await client.query(`
        INSERT INTO leishmaniasis_cases 
        ("nomeAnimal", "tipoAnimal", "idade", "raca", "sexo", "pelagem", "corPelagem", "nomeTutor", "status", "area", "quadra", "cpf", "telefone", "endereco", "dataNotificacao")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        gato.nomeAnimal, gato.tipoAnimal, gato.idade, gato.raca,
        gato.sexo, gato.pelagem, gato.corPelagem, gato.nomeTutor,
        gato.status, gato.area, gato.quadra, gato.cpf,
        gato.telefone, gato.endereco, new Date()
      ]);
    }

    console.log('10 clientes adicionados com sucesso!');
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: '10 clientes adicionados com sucesso!',
        details: {
          cachorros: 5,
          gatos: 5,
          total: 10
        }
      }),
    };
    
  } catch (error) {
    console.error('Erro ao adicionar clientes:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Erro ao adicionar clientes', 
        details: error.message 
      }),
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
