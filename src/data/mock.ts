export const MOCK_USER = {
  name: 'Carlos Silva',
  role: 'Motorista Profissional',
  level: 12,
  xp: 4500,
  xpNext: 5000,
  hours: 124,
  certificates: 5,
  rank: 142,
  avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=carlos',
}

export const MOCK_COURSES = [
  {
    id: 'c1',
    title: 'Direção Defensiva Avançada',
    instructor: 'Prof. Marcos',
    progress: 75,
    thumbnail: 'https://img.usecurling.com/p/400/250?q=steering%20wheel&color=orange',
    tags: ['Obrigatório', '10h'],
  },
  {
    id: 'c2',
    title: 'Legislação de Trânsito Atualizada',
    instructor: 'Dra. Ana Paula',
    progress: 30,
    thumbnail: 'https://img.usecurling.com/p/400/250?q=law&color=blue',
    tags: ['Teórico', '5h'],
  },
  {
    id: 'c3',
    title: 'Primeiros Socorros nas Estradas',
    instructor: 'Bombeiro João',
    progress: 0,
    thumbnail: 'https://img.usecurling.com/p/400/250?q=ambulance&color=red',
    tags: ['Prático', '8h'],
  },
]

export const MOCK_ACTIVITY = [
  {
    id: 'a1',
    user: 'Ana P.',
    action: 'ganhou a medalha',
    target: 'Mestre da Chuva',
    time: 'Há 10 min',
  },
  {
    id: 'a2',
    user: 'Você',
    action: 'concluiu o módulo',
    target: 'Sinalização',
    time: 'Há 2 horas',
  },
  { id: 'a3', user: 'Pedro S.', action: 'atingiu o nível', target: '15', time: 'Há 5 horas' },
]

export const MOCK_SKILLS = [
  { subject: 'Direção Defensiva', score: 90 },
  { subject: 'Legislação', score: 85 },
  { subject: 'Primeiros Socorros', score: 60 },
  { subject: 'Mecânica Básica', score: 40 },
  { subject: 'Eco-condução', score: 75 },
  { subject: 'Psicologia no Trânsito', score: 80 },
]

export const MOCK_BADGES = [
  {
    id: 'b1',
    title: 'Viajante Seguro',
    desc: '1000km sem infrações simuladas',
    icon: 'ShieldCheck',
    date: '10 Fev 2026',
  },
  {
    id: 'b2',
    title: 'Coruja da Noite',
    desc: 'Concluiu o módulo de direção noturna',
    icon: 'Moon',
    date: '05 Jan 2026',
  },
  {
    id: 'b3',
    title: 'Salva-Vidas',
    desc: 'Nota máxima em Primeiros Socorros',
    icon: 'HeartPulse',
    date: '20 Dez 2025',
  },
]

export const MOCK_POSTS = [
  {
    id: 'p1',
    author: 'João Silva',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=joao',
    title: 'Dica para aquaplanagem',
    content: 'Sempre mantenha a calma e evite frear bruscamente...',
    upvotes: 42,
    replies: 5,
  },
  {
    id: 'p2',
    author: 'Mariana Costa',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=mari',
    title: 'Dúvida sobre a nova lei da cadeirinha',
    content: 'Alguém sabe se a regra mudou para veículos utilitários?',
    upvotes: 15,
    replies: 12,
  },
]
