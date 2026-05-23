import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function ClientesListar() {
  const { clientes, deleteCliente, getClienteById, setActivePage } = useApp()
  const [search, setSearch]       = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'titular' | 'dependente'>('todos')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filtered = clientes.filter(c => {
    const matchSearch =
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.documentos.some(d => d.numero.includes(search)) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    return matchSearch && matchTipo
  })

  const titulares  = clientes.filter(c => c.tipo === 'titular').length
  const dependentes = clientes.filter(c => c.tipo === 'dependente').length

  const confirmando = deleteConfirm !== null ? clientes.find(c => c.id === deleteConfirm) : undefined
  const temDependentes = deleteConfirm !== null &&
    clientes.some(c => c.tipo === 'dependente' && c.titularId === deleteConfirm)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="brand-font text-2xl font-800 text-base-content">Clientes</h2>
          <p className="text-sm text-base-content/50 mt-1">
            {titulares} titular(es) · {dependentes} dependente(s)
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setActivePage('clientes-cadastrar')}>
          + Novo Cliente
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, documento ou e-mail..."
            className="grow text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>

        <div className="join">
          {(['todos', 'titular', 'dependente'] as const).map(t => (
            <button
              key={t}
              className={`join-item btn btn-sm capitalize ${filtroTipo === t ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
              onClick={() => setFiltroTipo(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                <th>#</th><th>Nome</th><th>Tipo</th><th>Titular / Documento</th><th>Data Nasc.</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-base-content/40 py-10">Nenhum cliente encontrado.</td></tr>
              ) : (
                filtered.map(c => {
                  const titular     = c.tipo === 'dependente' && c.titularId ? getClienteById(c.titularId) : undefined
                  const docPrincipal = c.documentos[0]
                  return (
                    <tr key={c.id} className="hover">
                      <td className="text-base-content/40 text-xs">{c.id}</td>
                      <td>
                        <div>
                          <p className="font-medium">{c.nome}</p>
                          {c.nomeSocial && <p className="text-xs text-base-content/50">"{c.nomeSocial}"</p>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${c.tipo === 'titular' ? 'badge-primary' : 'badge-ghost'}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="text-base-content/70 text-sm">
                        {c.tipo === 'dependente'
                          ? <span className="text-xs">dep. de <strong>{titular?.nome ?? '?'}</strong></span>
                          : docPrincipal
                            ? <span className="font-mono text-xs">{docPrincipal.tipo.toUpperCase()}: {docPrincipal.numero}</span>
                            : '—'
                        }
                      </td>
                      <td className="text-base-content/70 text-sm">{c.dataNasc || '—'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs text-primary"
                            onClick={() => setActivePage(`clientes-editar-${c.id}`)}>Editar</button>
                          <button className="btn btn-ghost btn-xs text-error"
                            onClick={() => setDeleteConfirm(c.id)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="brand-font font-700 text-lg">Confirmar exclusão</h3>
            <p className="py-4 text-sm text-base-content/70">
              Tem certeza que deseja excluir <strong>{confirmando?.nome}</strong>?
              {temDependentes && (
                <span className="block text-warning mt-1">⚠ Este titular possui dependentes vinculados.</span>
              )}
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-error btn-sm"
                onClick={() => { deleteCliente(deleteConfirm); setDeleteConfirm(null) }}>
                Excluir
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)} />
        </dialog>
      )}
    </div>
    // 
  )
}