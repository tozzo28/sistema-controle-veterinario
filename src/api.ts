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
};

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchCases(): Promise<LeishmaniasisCase[]> {
  const res = await fetch(`${BASE_URL}/api/cases`);
  if (!res.ok) throw new Error('Falha ao carregar casos');
  return res.json();
}

export async function createCase(data: Omit<LeishmaniasisCase, 'id' | 'dataNotificacao'>): Promise<LeishmaniasisCase> {
  const res = await fetch(`${BASE_URL}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar caso');
  return res.json();
}

export async function deleteCase(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cases/${id}`, { method: 'DELETE' });
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
};

export async function fetchRabies(): Promise<RabiesVaccineRecord[]> {
  const res = await fetch(`${BASE_URL}/api/rabies`);
  if (!res.ok) throw new Error('Falha ao carregar vacinações');
  return res.json();
}

export async function createRabies(data: Omit<RabiesVaccineRecord, 'id' | 'dataVacinacao'>): Promise<RabiesVaccineRecord> {
  const res = await fetch(`${BASE_URL}/api/rabies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar vacinação');
  return res.json();
}

export async function deleteRabies(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/rabies/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Falha ao excluir vacinação');
}


