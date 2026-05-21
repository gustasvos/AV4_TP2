import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Hospedagens() {
    const { hospedagens, clientes, acomodacoes, addHospedagem, updateHospedagem, getClienteById, getAcomodacaoById } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ clienteId: '', acomodacaoId: '', checkIn: '', checkOut: '' })
    const [saved, setSaved] = useState(false)

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()
        addHospedagem({ ...form, clienteId: +form.clienteId, acomodacaoId: +form.acomodacaoId })
        setSaved(true)
        setForm({ clienteId: '', acomodacaoId: '', checkIn: '', checkOut: '' })
        setTimeout(() => { setSaved(false); setShowForm(false) }, 1200)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="brand-font text-2xl font-800 text-base-content">Hospedagens</h2>
                    <p className="text-sm text-base-content/50 mt-1">{hospedagens.length} hospedagem(s) registrada(s)</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Fechar' : '+ Nova Hospedagem'}
                </button>
            </div>

            {/* New hospedagem form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm border border-primary/20">
                    <div className="card-body gap-4">
                        <h3 className="brand-font font-700">Nova Hospedagem</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label"><span className="label-text font-medium">Cliente</span></label>
                                <select
                                    name="clienteId"
                                    value={form.clienteId}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Selecione o hóspede...</option>
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label"><span className="label-text font-medium">Acomodação</span></label>
                                <select
                                    name="acomodacaoId"
                                    value={form.acomodacaoId}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Selecione o tipo...</option>
                                    {acomodacoes.map(a => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label"><span className="label-text font-medium">Check-in</span></label>
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={form.checkIn}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label"><span className="label-text font-medium">Check-out</span></label>
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={form.checkOut}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </div>

                        {saved && (
                            <div className="alert alert-success py-2 text-sm">
                                <span>✓ Hospedagem registrada!</span>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary btn-sm">Registrar</button>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
                        </div>
                    </div>
                </form>
            )}

            {/* Table */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                            <th>#</th>
                            <th>Hóspede</th>
                            <th>Acomodação</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hospedagens.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-base-content/40 py-10">
                                    Nenhuma hospedagem registrada.
                                </td>
                            </tr>
                        ) : (
                            hospedagens.map(h => {
                                const cliente = getClienteById(h.clienteId)
                                const acomodacao = getAcomodacaoById(h.acomodacaoId)
                                return (
                                    <tr key={h.id} className="hover">
                                        <td className="text-base-content/40 text-xs">{h.id}</td>
                                        <td className="font-medium">{cliente?.nome ?? '—'}</td>
                                        <td className="text-base-content/70">{acomodacao?.nome ?? '—'}</td>
                                        <td className="text-base-content/70">{h.checkIn}</td>
                                        <td className="text-base-content/70">{h.checkOut}</td>
                                        <td>
                        <span className={`badge badge-sm ${h.status === 'ativo' ? 'badge-success' : 'badge-ghost'}`}>
                          {h.status}
                        </span>
                                        </td>
                                        <td>
                                            {h.status === 'ativo' && (
                                                <button
                                                    className="btn btn-ghost btn-xs text-warning"
                                                    onClick={() => updateHospedagem(h.id, { status: 'encerrado' })}
                                                >
                                                    Check-out
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}