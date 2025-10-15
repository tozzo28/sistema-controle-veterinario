import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LeishmaniasisControl from './components/LeishmaniasisControl';
import RabiesVaccineControl from './components/RabiesVaccineControl';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { fetchCases, createCase, deleteCase } from './api';
import './styles/theme.css';

// Interface para os casos de leishmaniose
interface LeishmaniasisCase {
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
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Estado compartilhado para os casos de leishmaniose
  const [leishmaniasisCases, setLeishmaniasisCases] = useState<LeishmaniasisCase[]>([]);

  useEffect(() => {
    fetchCases()
      .then(setLeishmaniasisCases)
      .catch(() => {
        // fallback silencioso inicial
        setLeishmaniasisCases([]);
      });
  }, []);

  // Função para adicionar novo caso
  const handleAddLeishmaniasisCase = async (newCase: Omit<LeishmaniasisCase, 'id'>) => {
    const { dataNotificacao, ...payload } = newCase as any;
    const created = await createCase(payload as any);
    setLeishmaniasisCases(prev => [created, ...prev]);
  };

  // Função para deletar caso
  const handleDeleteLeishmaniasisCase = async (id: number) => {
    await deleteCase(id);
    setLeishmaniasisCases(prev => prev.filter(c => c.id !== id));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard leishmaniasisCases={leishmaniasisCases} />;
      case 'leishmaniasis':
        return (
          <LeishmaniasisControl 
            cases={leishmaniasisCases}
            onAddCase={handleAddLeishmaniasisCase}
            onDeleteCase={handleDeleteLeishmaniasisCase}
          />
        );
      case 'rabies':
        return <RabiesVaccineControl />;
      default:
        return <Dashboard leishmaniasisCases={leishmaniasisCases} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <ThemeToggle />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          {renderActiveSection()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;