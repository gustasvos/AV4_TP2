import { createContext, useContext, useState } from 'react'

const AppContext = createContext(undefined)

const ACCOMMODATIONS = [
    { id: 1, nome: 'Casal Simples',    camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
    { id: 2, nome: 'Família Simples',  camaSolteiro: 2, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
    { id: 3, nome: 'Família Mais',     camaSolteiro: 5, camaCasal: 1, suite: 2, climatizacao: true, garagem: 2 },
    { id: 4, nome: 'Família Super',    camaSolteiro: 6, camaCasal: 2, suite: 3, climatizacao: true, garagem: 2 },
    { id: 5, nome: 'Solteiro Simples', camaSolteiro: 1, camaCasal: 0, suite: 1, climatizacao: true, garagem: 0 },
    { id: 6, nome: 'Solteiro Mais',    camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
]

export function AppProvider({ children }) {
    const [clientes, setClientes] = useState([
        { id: 1, nome: 'João Silva', cpf: '123.456.789-00', email: 'joao@email.com', telefone: '(11) 99999-0001', dataNasc: '1985-03-12' },
        { id: 2, nome: 'Maria Oliveira', cpf: '987.654.321-00', email: 'maria@email.com', telefone: '(11) 99999-0002', dataNasc: '1992-07-24' },
    ])
    const [hospedagens, setHospedagens] = useState([
        { id: 1, clienteId: 1, acomodacaoId: 2, checkIn: '2026-05-18', checkOut: '2026-05-22', status: 'ativo' },
        { id: 2, clienteId: 2, acomodacaoId: 5, checkIn: '2026-05-20', checkOut: '2026-05-23', status: 'ativo' },
    ])
    const [activePage, setActivePage] = useState('dashboard')

    const addCliente = (cliente) => {
        const newId = Math.max(0, ...clientes.map(c => c.id)) + 1
        setClientes(prev => [...prev, { ...cliente, id: newId }])
    }

    const updateCliente = (id, data) => {
        setClientes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    }

    const deleteCliente = (id) => {
        setClientes(prev => prev.filter(c => c.id !== id))
    }

    const addHospedagem = (hospedagem) => {
        const newId = Math.max(0, ...hospedagens.map(h => h.id)) + 1
        setHospedagens(prev => [...prev, { ...hospedagem, id: newId, status: 'ativo' }])
    }

    const updateHospedagem = (id, data) => {
        setHospedagens(prev => prev.map(h => h.id === id ? { ...h, ...data } : h))
    }

    const getClienteById = (id) => clientes.find(c => c.id === id)
    const getAcomodacaoById = (id) => ACCOMMODATIONS.find(a => a.id === id)

    return (
        <AppContext.Provider value={{
            clientes, addCliente, updateCliente, deleteCliente,
            hospedagens, addHospedagem, updateHospedagem,
            acomodacoes: ACCOMMODATIONS,
            getClienteById, getAcomodacaoById,
            activePage, setActivePage,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)