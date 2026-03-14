import { create } from 'zustand'

export type SpeakerType = 'internal' | 'external'

export interface Speaker {
  id: string
  name: string
  type: SpeakerType
  bio: string
  avatar?: string
}

export type ProductType =
  | 'ebook'
  | 'course'
  | 'expansion1'
  | 'expansion2'
  | 'expansion3'
  | 'expansion4'
  | 'expansion5'

export interface Product {
  id: string
  title: string
  type: ProductType
  description: string
  coverImage: string
  price: number
  promotionalPrice?: number | null
  isPublished: boolean
  speakerId?: string
  fileUrl?: string
  courseId?: string
}

interface CommercialStore {
  speakers: Speaker[]
  products: Product[]
  addSpeaker: (s: Speaker) => void
  updateSpeaker: (s: Speaker) => void
  deleteSpeaker: (id: string) => void
  addProduct: (p: Product) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: string) => void
}

const MOCK_SPEAKERS: Speaker[] = [
  {
    id: 'sp1',
    name: 'Dr. Renato Santos',
    type: 'internal',
    bio: 'Pesquisador e membro oficial focado em políticas de segurança e mobilidade urbana.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=sp1',
  },
  {
    id: 'sp2',
    name: 'Ana Oliveira',
    type: 'external',
    bio: 'Consultora independente especialista em engenharia de tráfego rodoviário.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=sp2',
  },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'eBook: Manual Prático de Segurança Viária',
    type: 'ebook',
    description:
      'Um guia completo desenvolvido pelo Observatório sobre as melhores práticas para redução de acidentes e conscientização no trânsito urbano.',
    coverImage: 'https://img.usecurling.com/p/600/800?q=book&color=blue',
    price: 49.9,
    promotionalPrice: 29.9,
    isPublished: true,
    speakerId: 'sp1',
    fileUrl: 'https://exemplo.com/manual-seguranca-viaria.pdf',
  },
  {
    id: 'p2',
    title: 'Curso Master: Gestão Integrada de Tráfego',
    type: 'course',
    description:
      'Aprenda do zero ao avançado como gerenciar o tráfego urbano utilizando tecnologias modernas e as diretrizes de segurança vigentes.',
    coverImage: 'https://img.usecurling.com/p/800/600?q=traffic&color=orange',
    price: 297.0,
    isPublished: true,
    speakerId: 'sp2',
    courseId: 'c1',
  },
]

export const useCommercialStore = create<CommercialStore>((set) => ({
  speakers: MOCK_SPEAKERS,
  products: MOCK_PRODUCTS,
  addSpeaker: (s) => set((state) => ({ speakers: [...state.speakers, s] })),
  updateSpeaker: (s) =>
    set((state) => ({ speakers: state.speakers.map((x) => (x.id === s.id ? s : x)) })),
  deleteSpeaker: (id) => set((state) => ({ speakers: state.speakers.filter((x) => x.id !== id) })),
  addProduct: (p) => set((state) => ({ products: [...state.products, p] })),
  updateProduct: (p) =>
    set((state) => ({ products: state.products.map((x) => (x.id === p.id ? p : x)) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((x) => x.id !== id) })),
}))
