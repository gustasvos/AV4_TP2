import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function ClientesListar() {
    const { clientes, deleteCliente, setActivePage } = useApp()
    const [search, setSearch] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = clientes.filter(c =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.cpf.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="brand-font text-2xl font-800 text-base-content">Clientes</h2>
                    <p className="text-sm text-base-content/50 mt-1">{clientes.length} cliente(s) cadastrado(s)</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setActivePage('clientes-cadastrar')}>
                    + Novo Cliente
                </button>
            </div>

            <label className="input input-bordered flex items-center gap-2 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nome, CPF ou e-mail..."
                    className="grow text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </label>

            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                            <th>#</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-base-content/40 py-10">
                                    Nenhum cliente encontrado.
                                </td>
                            </tr>
                        ) : (
                            filtered.map(c => (
                                <tr key={c.id} className="hover">
                                    <td className="text-base-content/40 text-xs">{c.id}</td>
                                    <td className="font-medium">{c.nome}</td>
                                    <td className="text-base-content/70 font-mono text-sm">{c.cpf}</td>
                                    <td className="text-base-content/70">{c.email}</td>
                                    <td className="text-base-content/70">{c.telefone}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                className="btn btn-ghost btn-xs text-primary"
                                                onClick={() => setActivePage(`clientes-editar-${c.id}`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-xs text-error"
                                                onClick={() => setDeleteConfirm(c.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete modal */}
            {deleteConfirm && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="brand-font font-700 text-lg">Confirmar exclusão</h3>
                        <p className="py-4 text-sm text-base-content/70">
                            Tem certeza que deseja excluir o cliente <strong>{clientes.find(c => c.id === deleteConfirm)?.nome}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="modal-action">
                            <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button
                                className="btn btn-error btn-sm"
                                onClick={() => { deleteCliente(deleteConfirm); setDeleteConfirm(null) }}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)} />
                </dialog>
            )}
        </div>
    )
}