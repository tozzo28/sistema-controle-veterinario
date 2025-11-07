export type LeishmaniasisCase = {
  id: number;
  nomeAnimal: string;
  tipoAnimal: string;
  idade?: string;
  raca?: string;
  sexo?: string;
  pelagem?: string;
  corPelagem?: string;
  nomeTutor: string;
  status: string;
  area: string;
  quadra: string;
  dataNotificacao: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
};

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchCases(): Promise<LeishmaniasisCase[]> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-cases-simple`);
  if (!res.ok) throw new Error('Falha ao carregar casos');
  return res.json();
}

export async function createCase(data: Omit<LeishmaniasisCase, 'id' | 'dataNotificacao'>): Promise<LeishmaniasisCase> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-cases-simple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar caso');
  return res.json();
}

export async function updateCase(id: number, data: Omit<LeishmaniasisCase, 'id' | 'dataNotificacao'>): Promise<LeishmaniasisCase> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-cases-simple`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar caso');
  return res.json();
}

export async function deleteCase(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-cases-simple`, { 
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (!res.ok && res.status !== 204) throw new Error('Falha ao excluir caso');
}

export type RabiesVaccineRecord = {
  id: number;
  nomeAnimal: string;
  tipo: 'cao' | 'gato';
  nomeTutor: string;
  dataVacinacao: string;
  localVacinacao: string;
  area: string;
  quadra: string;
  loteVacina: string;
  dosePerdida?: boolean;
  endereco?: string;
  latitude?: number;
  longitude?: number;
};

export async function fetchRabies(): Promise<RabiesVaccineRecord[]> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-rabies-simple`);
  if (!res.ok) throw new Error('Falha ao carregar vacinações');
  return res.json();
}

export async function createRabies(data: Omit<RabiesVaccineRecord, 'id' | 'dataVacinacao'>): Promise<RabiesVaccineRecord> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-rabies-simple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar vacinação');
  return res.json();
}

export async function updateRabies(id: number, data: Omit<RabiesVaccineRecord, 'id' | 'dataVacinacao'>): Promise<RabiesVaccineRecord> {
  console.log('📡 [API] Enviando requisição PUT:', { id, data });
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-rabies-simple`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  
  console.log('📡 [API] Status da resposta:', res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ [API] Erro na resposta:', errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || `Falha ao atualizar vacinação: ${res.status} ${res.statusText}`);
    } catch {
      throw new Error(`Falha ao atualizar vacinação: ${res.status} ${res.statusText} - ${errorText}`);
    }
  }
  
  const result = await res.json();
  console.log('✅ [API] Dados atualizados recebidos:', result);
  return result;
}

export async function deleteRabies(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/.netlify/functions/api-rabies-simple`, { 
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (!res.ok && res.status !== 204) throw new Error('Falha ao excluir vacinação');
}


