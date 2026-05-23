import { createContext, useContext, useState, ReactNode } from 'react'

// ─── Domain types ────────────────────────────────────────────────────────────

export type TipoDocumento = 'cpf' | 'rg' | 'passaporte'
export type TipoCliente   = 'titular' | 'dependente'
export type StatusHospedagem = 'ativo' | 'encerrado'

export interface Documento {
  tipo: TipoDocumento
  numero: string
  dataExpedicao: string
}

export interface Endereco {
  rua: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  cep: string
}

export interface Cliente {
  id: number
  tipo: TipoCliente
  titularId: number | null
  nome: string
  nomeSocial: string
  dataNasc: string
  email: string
  telefone: string
  endereco: Endereco
  documentos: Documento[]
}

export interface Acomodacao {
  id: number
  nome: string
  camaSolteiro: number
  camaCasal: number
  suite: number
  climatizacao: boolean
  garagem: number
}

export interface Hospedagem {
  id: number
  clienteId: number
  acomodacaoId: number
  checkIn: string
  checkOut: string
  status: StatusHospedagem
}

// ─── Context shape ───────────────────────────────────────────────────────────

interface AppContextValue {
  clientes: Cliente[]
  addCliente: (c: Omit<Cliente, 'id'>) => void
  updateCliente: (id: number, data: Partial<Cliente>) => void
  deleteCliente: (id: number) => void

  hospedagens: Hospedagem[]
  addHospedagem: (h: Omit<Hospedagem, 'id' | 'status'>) => void
  updateHospedagem: (id: number, data: Partial<Hospedagem>) => void

  acomodacoes: Acomodacao[]
  getClienteById: (id: number) => Cliente | undefined
  getAcomodacaoById: (id: number) => Acomodacao | undefined
  getTitulares: () => Cliente[]
  getDependentes: (titularId: number) => Cliente[]

  activePage: string
  setActivePage: (page: string) => void
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const ACCOMMODATIONS: Acomodacao[] = [
  { id: 1, nome: 'Casal Simples',    camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
  { id: 2, nome: 'Família Simples',  camaSolteiro: 2, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
  { id: 3, nome: 'Família Mais',     camaSolteiro: 5, camaCasal: 1, suite: 2, climatizacao: true, garagem: 2 },
  { id: 4, nome: 'Família Super',    camaSolteiro: 6, camaCasal: 2, suite: 3, climatizacao: true, garagem: 2 },
  { id: 5, nome: 'Solteiro Simples', camaSolteiro: 1, camaCasal: 0, suite: 1, climatizacao: true, garagem: 0 },
  { id: 6, nome: 'Solteiro Mais',    camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
]

const SEED_CLIENTES: Cliente[] = [
  {
    id: 1, tipo: 'titular', titularId: null,
    nome: 'João Silva', nomeSocial: '',
    dataNasc: '1985-03-12',
    email: 'joao@email.com', telefone: '(11) 99999-0001',
    endereco: { rua: 'Rua das Flores, 100', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', pais: 'Brasil', cep: '01000-000' },
    documentos: [{ tipo: 'cpf', numero: '123.456.789-00', dataExpedicao: '2010-01-15' }],
  },
  {
    id: 2, tipo: 'titular', titularId: null,
    nome: 'Maria Oliveira', nomeSocial: 'Mari',
    dataNasc: '1992-07-24',
    email: 'maria@email.com', telefone: '(11) 99999-0002',
    endereco: { rua: 'Av. Paulista, 900', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', pais: 'Brasil', cep: '01310-100' },
    documentos: [{ tipo: 'cpf', numero: '987.654.321-00', dataExpedicao: '2012-06-20' }],
  },
]

// ─── Provider ────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(SEED_CLIENTES)
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([
    { id: 1, clienteId: 1, acomodacaoId: 2, checkIn: '2026-05-18', checkOut: '2026-05-22', status: 'ativo' },
    { id: 2, clienteId: 2, acomodacaoId: 5, checkIn: '2026-05-20', checkOut: '2026-05-23', status: 'ativo' },
  ])
  const [activePage, setActivePage] = useState('dashboard')

  const addCliente = (cliente: Omit<Cliente, 'id'>) => {
    const newId = Math.max(0, ...clientes.map(c => c.id)) + 1
    setClientes(prev => [...prev, { ...cliente, id: newId }])
  }

  const updateCliente = (id: number, data: Partial<Cliente>) =>
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))

  const deleteCliente = (id: number) =>
    setClientes(prev => prev.filter(c => c.id !== id))

  const addHospedagem = (h: Omit<Hospedagem, 'id' | 'status'>) => {
    const newId = Math.max(0, ...hospedagens.map(x => x.id)) + 1
    setHospedagens(prev => [...prev, { ...h, id: newId, status: 'ativo' }])
  }

  const updateHospedagem = (id: number, data: Partial<Hospedagem>) =>
    setHospedagens(prev => prev.map(h => h.id === id ? { ...h, ...data } : h))

  const getClienteById    = (id: number) => clientes.find(c => c.id === id)
  const getAcomodacaoById = (id: number) => ACCOMMODATIONS.find(a => a.id === id)
  const getTitulares      = () => clientes.filter(c => c.tipo === 'titular')
  const getDependentes    = (titularId: number) => clientes.filter(c => c.tipo === 'dependente' && c.titularId === titularId)

  return (
    <AppContext.Provider value={{
      clientes, addCliente, updateCliente, deleteCliente,
      hospedagens, addHospedagem, updateHospedagem,
      acomodacoes: ACCOMMODATIONS,
      getClienteById, getAcomodacaoById,
      getTitulares, getDependentes,
      activePage, setActivePage,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}