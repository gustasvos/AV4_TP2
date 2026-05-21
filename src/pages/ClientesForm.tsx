import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function ClientesForm({ editId }) {
    const { addCliente, updateCliente, clientes, setActivePage } = useApp()

    const clienteExistente = editId ? clientes.find(c => c.id === editId) : null

    const [form, setForm] = useState({
        nome: '', cpf: '', email: '', telefone: '', dataNasc: ''
    })
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (clienteExistente) setForm(clienteExistente)
    }, [editId])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editId) {
            updateCliente(editId, form)
        } else {
            addCliente(form)
        }
        setSaved(true)
        setTimeout(() => {
            setSaved(false)
            setActivePage('clientes-listar')
        }, 1200)
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="brand-font text-2xl font-800 text-base-content">
                    {editId ? 'Editar Cliente' : 'Cadastrar Cliente'}
                </h2>
                <p className="text-sm text-base-content/50 mt-1">
                    {editId ? 'Atualize os dados do hóspede.' : 'Preencha os dados do novo hóspede.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="label"><span className="label-text font-medium">Nome completo</span></label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Ex: João Silva"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-medium">CPF</span></label>
                            <input
                                type="text"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                className="input input-bordered w-full font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-medium">Data de nascimento</span></label>
                            <input
                                type="date"
                                name="dataNasc"
                                value={form.dataNasc}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-medium">E-mail</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="joao@email.com"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label"><span className="label-text font-medium">Telefone</span></label>
                            <input
                                type="text"
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                placeholder="(11) 99999-0000"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    {saved && (
                        <div className="alert alert-success py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Cliente salvo com sucesso!</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Salvar alterações' : 'Cadastrar cliente'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setActivePage('clientes-listar')}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}