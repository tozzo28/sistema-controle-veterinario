import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await prisma.leishmaniasisCase.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(cases);
  } catch (err) {
    console.error('GET /api/cases error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/cases', async (req, res) => {
  try {
    const data = req.body;
    const created = await prisma.leishmaniasisCase.create({ data });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: 'Invalid payload', details: String(e) });
  }
});

app.delete('/api/cases/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.leishmaniasisCase.delete({ where: { id } });
  res.status(204).send();
});

// Rabies vaccine endpoints
app.get('/api/rabies', async (req, res) => {
  try {
    const rows = await prisma.rabiesVaccineRecord.findMany({ orderBy: { id: 'desc' } });
    res.json(rows);
  } catch (err) {
    console.error('GET /api/rabies error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/rabies', async (req, res) => {
  try {
    const data = req.body;
    const created = await prisma.rabiesVaccineRecord.create({ data });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/rabies error:', err);
    res.status(400).json({ error: 'Invalid payload', details: String(err) });
  }
});

app.delete('/api/rabies/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.rabiesVaccineRecord.delete({ where: { id } });
  res.status(204).send();
});

app.get('/api/rabies/stats', async (req, res) => {
  try {
    const [total, caes, gatos, dosesPerdidas, centro, clinica, hospital] = await Promise.all([
      prisma.rabiesVaccineRecord.count(),
      prisma.rabiesVaccineRecord.count({ where: { tipo: 'cao' } }),
      prisma.rabiesVaccineRecord.count({ where: { tipo: 'gato' } }),
      prisma.rabiesVaccineRecord.count({ where: { dosePerdida: true } }),
      prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['centro_municipal', 'Centro Veterinário Municipal'] } } }),
      prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['clinica_pet_care', 'Clínica Pet Care'] } } }),
      prisma.rabiesVaccineRecord.count({ where: { localVacinacao: { in: ['hospital_sao_francisco', 'Hospital Veterinário São Francisco'] } } }),
    ]);
    res.json({ total, caes, gatos, dosesPerdidas, locais: { centro, clinica, hospital } });
  } catch (err) {
    console.error('GET /api/rabies/stats error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});


