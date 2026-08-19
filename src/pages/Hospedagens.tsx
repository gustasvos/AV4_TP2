import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react';
import { useApp } from '../context/AppContext'

interface HospedagemForm {
  clienteId: string
  acomodacaoId: string
  checkIn: string
  checkOut: string
}

type FormErrors = Partial<Record<keyof HospedagemForm, string>>

const EMPTY_FORM: HospedagemForm = { clienteId: '', acomodacaoId: '', checkIn: '', checkOut: '' }

const today = (): string => new Date().toISOString().split('T')[0]

function validate(form: HospedagemForm): FormErrors {
  const errs: FormErrors = {}

  if (!form.clienteId) errs.clienteId = 'Selecione um hóspede'
  if (!form.acomodacaoId) errs.acomodacaoId = 'Selecione uma acomodação'

  if (!form.checkIn) {
    errs.checkIn = 'Informe a data de check-in'
  } else if (form.checkIn < today()) {
    errs.checkIn = 'Check-in não pode ser no passado'
  }

  if (!form.checkOut) {
    errs.checkOut = 'Informe a data de check-out'
  } else if (form.checkIn && form.checkOut <= form.checkIn) {
    errs.checkOut = 'Check-out deve ser após o check-in'
  }

  return errs
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="label pb-1">
      <span className="label-text font-medium">
        {label}<span className="text-error ml-0.5">*</span>
      </span>
    </label>
    {children}
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
)

const limitYearDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const input = e.currentTarget
  const [, , year = ''] = input.value.split('-')
  const isDigit = /^\d$/.test(e.key)
  if (isDigit && year.length >= 4) e.preventDefault()
}

export default function Hospedagens() {
  const { hospedagens, clientes, acomodacoes, addHospedagem, updateHospedagem, getClienteById, getAcomodacaoById } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<HospedagemForm>(EMPTY_FORM)
  const [errs, setErrs] = useState<FormErrors>({})
  const [saved, setSaved] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrs(prev => { const next = { ...prev }; delete next[name as keyof HospedagemForm]; return next })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length > 0) { setErrs(errors); return }

    addHospedagem({
      clienteId: parseInt(form.clienteId, 10),
      acomodacaoId: parseInt(form.acomodacaoId, 10),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
    })
    setSaved(true)
    setForm(EMPTY_FORM)
    setErrs({})
    setTimeout(() => { setSaved(false); setShowForm(false) }, 1200)
  }

  const handleOpen = () => { setForm(EMPTY_FORM); setErrs({}); setShowForm(v => !v) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="brand-font text-2xl font-800 text-base-content">Hospedagens</h2>
          <p className="text-sm text-base-content/50 mt-1">{hospedagens.length} hospedagem(s) registrada(s)</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpen}>
          {showForm ? 'Fechar' : '+ Nova Hospedagem'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="card bg-base-100 shadow-sm border border-primary/20">
          <div className="card-body gap-4">
            <h3 className="brand-font font-700">Nova Hospedagem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cliente" error={errs.clienteId}>
                <select name="clienteId" value={form.clienteId} onChange={handleChange}
                  className={`select select-bordered w-full ${errs.clienteId ? 'select-error' : ''}`}>
                  <option value="">Selecione o hóspede...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </Field>

              <Field label="Acomodação" error={errs.acomodacaoId}>
                <select name="acomodacaoId" value={form.acomodacaoId} onChange={handleChange}
                  className={`select select-bordered w-full ${errs.acomodacaoId ? 'select-error' : ''}`}>
                  <option value="">Selecione o tipo...</option>
                  {acomodacoes.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </Field>

              <Field label="Check-in" error={errs.checkIn}>
                <input type="date" name="checkIn" value={form.checkIn}
                  min={today()}
                  onChange={handleChange}
                  onKeyDown={limitYearDigits}
                  className={`input input-bordered w-full ${errs.checkIn ? 'input-error' : ''}`} />
              </Field>

              <Field label="Check-out" error={errs.checkOut}>
                <input type="date" name="checkOut" value={form.checkOut}
                  min={form.checkIn || today()}
                  onChange={handleChange}
                  onKeyDown={limitYearDigits}
                  className={`input input-bordered w-full ${errs.checkOut ? 'input-error' : ''}`} />
              </Field>
            </div>

            {saved && <div className="alert alert-success py-2 text-sm"><span>✓ Hospedagem registrada!</span></div>}

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary btn-sm">Registrar</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </form>
      )}

      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/50 text-xs uppercase tracking-wider">
                <th>#</th><th>Hóspede</th><th>Acomodação</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {hospedagens.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-base-content/40 py-10">Nenhuma hospedagem registrada.</td></tr>
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
                          <button className="btn btn-ghost btn-xs text-warning"
                            onClick={() => updateHospedagem(h.id, { status: 'encerrado' })}>
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
    // 
  )
}