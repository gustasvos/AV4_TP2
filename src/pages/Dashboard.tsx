import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'

interface StatCardProps {
  label: string
  value: number
  icon: ReactNode
  color: string
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <div className="card bg-base-100 shadow-sm border border-base-200">
    <div className="card-body p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-base-content/50 font-medium">{label}</p>
          <p className="text-3xl font-800 mt-1 brand-font">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const { clientes, hospedagens, acomodacoes, getClienteById, getAcomodacaoById, setActivePage } = useApp()
  const hospedagensAtivas = hospedagens.filter(h => h.status === 'ativo')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="brand-font text-2xl font-800 text-base-content">Visão Geral</h2>
        <p className="text-sm text-base-content/50 mt-1">Sistema de Gestão de Clubes, Hotéis e Resorts - Atlantis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Clientes cadastrados"
          value={clientes.length}
          color="bg-primary/10 text-primary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Hospedagens ativas"
          value={hospedagensAtivas.length}
          color="bg-success/10 text-success"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Tipos de acomodação"
          value={acomodacoes.length}
          color="bg-warning/10 text-warning"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
            <h3 className="brand-font font-700 text-base-content">Hospedagens Recentes</h3>
            <button className="btn btn-ghost btn-xs text-primary" onClick={() => setActivePage('hospedagens')}>
              Ver todas →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                  <th>Hóspede</th><th>Acomodação</th><th>Check-in</th><th>Check-out</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {hospedagens.slice(0, 5).map(h => {
                  const cliente    = getClienteById(h.clienteId)
                  const acomodacao = getAcomodacaoById(h.acomodacaoId)
                  return (
                    <tr key={h.id} className="hover">
                      <td className="font-medium">{cliente?.nome ?? '—'}</td>
                      <td className="text-base-content/70">{acomodacao?.nome ?? '—'}</td>
                      <td className="text-base-content/70">{h.checkIn}</td>
                      <td className="text-base-content/70">{h.checkOut}</td>
                      <td>
                        <span className={`badge badge-sm ${h.status === 'ativo' ? 'badge-success' : 'badge-ghost'}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    // 
  )
}