import { useState, useEffect, ReactNode, ChangeEvent } from 'react'
import { useApp } from '../context/AppContext'
import type { Cliente, Documento, Endereco, TipoDocumento, TipoCliente } from '../context/AppContext'


const masks: Record<string, (v: string) => string> = {
  cpf: (v) => v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),

  rg: (v) => v.replace(/\D/g, '').slice(0, 9)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,1})$/, '$1-$2'),

  passaporte: (v) => v.replace(/[^A-Za-z0-9]/g, '').slice(0, 9).toUpperCase(),

  cep: (v) => v.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2'),

  telefone: (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  },
}


type FormErrors = Record<string, string>

const today = (): string => new Date().toISOString().split('T')[0]

function validateDoc(doc: Documento, index: number): FormErrors {
  const errs: FormErrors = {}
  const key = (k: string) => `doc_${index}_${k}`

  if (!doc.numero || doc.numero.length < 3) errs[key('numero')] = 'Número inválido'
  if (doc.tipo === 'cpf'  && doc.numero.replace(/\D/g, '').length !== 11) errs[key('numero')] = 'CPF deve ter 11 dígitos'
  if (doc.tipo === 'rg'   && doc.numero.replace(/\D/g, '').length !== 9)  errs[key('numero')] = 'RG deve ter 9 dígitos'
  if (doc.tipo === 'passaporte' && doc.numero.length < 6)                  errs[key('numero')] = 'Passaporte inválido'
  if (!doc.dataExpedicao)              errs[key('dataExpedicao')] = 'Informe a data de expedição'
  else if (doc.dataExpedicao > today()) errs[key('dataExpedicao')] = 'Data não pode ser futura'
  return errs
}

function validateForm(form: ClienteForm, isDependente: boolean): FormErrors {
  const errs: FormErrors = {}

  if (!form.nome || form.nome.trim().length < 2)
    errs.nome = 'Nome deve ter pelo menos 2 caracteres'
  if (form.nomeSocial && form.nomeSocial.trim().length < 2)
    errs.nomeSocial = 'Nome social deve ter pelo menos 2 caracteres'
  if (!form.dataNasc)
    errs.dataNasc = 'Informe a data de nascimento'
  else if (form.dataNasc > today())
    errs.dataNasc = 'Data de nascimento não pode ser futura'

  if (!isDependente) {
    if (!form.endereco.rua?.trim())    errs['endereco.rua']    = 'Informe a rua'
    if (!form.endereco.bairro?.trim()) errs['endereco.bairro'] = 'Informe o bairro'
    if (!form.endereco.cidade?.trim()) errs['endereco.cidade'] = 'Informe a cidade'
    if (!form.endereco.estado?.trim()) errs['endereco.estado'] = 'Informe o estado'
    if (!form.endereco.pais?.trim())   errs['endereco.pais']   = 'Informe o país'
    if (form.endereco.cep.replace(/\D/g, '').length !== 8) errs['endereco.cep'] = 'CEP inválido'
  }

  if (form.documentos.length === 0) {
    errs.documentos = 'Adicione pelo menos um documento'
  } else {
    form.documentos.forEach((doc, i) => {
      Object.assign(errs, validateDoc(doc, i))
    })
  }

  return errs
}


interface ClienteForm {
  tipo: TipoCliente
  titularId: string
  nome: string
  nomeSocial: string
  dataNasc: string
  email: string
  telefone: string
  endereco: Endereco
  documentos: Documento[]
}

const EMPTY_ENDERECO: Endereco = { rua: '', bairro: '', cidade: '', estado: '', pais: 'Brasil', cep: '' }
const EMPTY_DOC: Documento = { tipo: 'cpf', numero: '', dataExpedicao: '' }
const TIPOS_DOC: TipoDocumento[] = ['cpf', 'rg', 'passaporte']

const emptyForm = (tipo: TipoCliente = 'titular'): ClienteForm => ({
  tipo,
  titularId: '',
  nome: '',
  nomeSocial: '',
  dataNasc: '',
  email: '',
  telefone: '',
  endereco: { ...EMPTY_ENDERECO },
  documentos: [{ ...EMPTY_DOC }],
})

const clienteToForm = (c: Cliente): ClienteForm => ({
  ...c,
  titularId: c.titularId != null ? String(c.titularId) : '',
})

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

const Field = ({ label, error, required, children }: FieldProps) => (
  <div>
    <label className="label pb-1">
      <span className="label-text font-medium text-sm">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </span>
    </label>
    {children}
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
)

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="brand-font font-700 text-base text-base-content border-b border-base-200 pb-2 mb-1">
    {children}
  </h3>
)


interface DocumentoRowProps {
  doc: Documento
  index: number
  onChange: (i: number, doc: Documento) => void
  onRemove: (i: number) => void
  errs: FormErrors
  usedTipos: TipoDocumento[]
}

function DocumentoRow({ doc, index, onChange, onRemove, errs, usedTipos }: DocumentoRowProps) {
  const placeholders: Record<TipoDocumento, string> = { cpf: '000.000.000-00', rg: '00.000.000-0', passaporte: 'AB1234567' }

  return (
    <div className="bg-base-200/50 rounded-xl p-4 space-y-3 border border-base-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-700 text-base-content/50 uppercase tracking-wider">
          Documento {index + 1}
        </span>
        {index > 0 && (
          <button type="button" onClick={() => onRemove(index)} className="btn btn-ghost btn-xs text-error">
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">Tipo<span className="text-error ml-0.5">*</span></span>
          </label>
          <select
            value={doc.tipo}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange(index, { ...doc, tipo: e.target.value as TipoDocumento, numero: '' })}
            className="select select-bordered select-sm w-full"
          >
            {TIPOS_DOC.map(t => (
              <option key={t} value={t} disabled={usedTipos.includes(t) && t !== doc.tipo}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">Número<span className="text-error ml-0.5">*</span></span>
          </label>
          <input
            type="text"
            value={doc.numero}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, { ...doc, numero: masks[doc.tipo]?.(e.target.value) ?? e.target.value })}
            placeholder={placeholders[doc.tipo]}
            className={`input input-bordered input-sm w-full font-mono ${errs[`doc_${index}_numero`] ? 'input-error' : ''}`}
          />
          {errs[`doc_${index}_numero`] && <p className="text-error text-xs mt-1">{errs[`doc_${index}_numero`]}</p>}
        </div>

        <div>
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">Data de expedição<span className="text-error ml-0.5">*</span></span>
          </label>
          <input
            type="date"
            value={doc.dataExpedicao}
            max={today()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(index, { ...doc, dataExpedicao: e.target.value })}
            className={`input input-bordered input-sm w-full ${errs[`doc_${index}_dataExpedicao`] ? 'input-error' : ''}`}
          />
          {errs[`doc_${index}_dataExpedicao`] && <p className="text-error text-xs mt-1">{errs[`doc_${index}_dataExpedicao`]}</p>}
        </div>
      </div>
    </div>
  )
}

interface ClientesFormProps {
  editId?: number
}

export default function ClientesForm({ editId }: ClientesFormProps) {
  const { addCliente, updateCliente, clientes, getTitulares, setActivePage } = useApp()

  const clienteExistente = editId != null ? clientes.find(c => c.id === editId) : undefined
  const titulares = getTitulares()

  const [form, setForm] = useState<ClienteForm>(() =>
    clienteExistente ? clienteToForm(clienteExistente) : emptyForm('titular')
  )
  const [errs, setErrs]   = useState<FormErrors>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (clienteExistente) setForm(clienteToForm(clienteExistente))
  }, [editId])

  const isDependente = form.tipo === 'dependente'

  const set = <K extends keyof ClienteForm>(field: K, value: ClienteForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrs(prev => { const e = { ...prev }; delete e[field as string]; return e })
  }

  const setEndereco = (field: keyof Endereco, value: string) => {
    setForm(prev => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }))
    setErrs(prev => { const e = { ...prev }; delete e[`endereco.${field}`]; return e })
  }

  const setDocs = (docs: Documento[]) => {
    setForm(prev => ({ ...prev, documentos: docs }))
    setErrs(prev => {
      const e = { ...prev }
      Object.keys(e).filter(k => k.startsWith('doc_') || k === 'documentos').forEach(k => delete e[k])
      return e
    })
  }

  const handleDocChange = (i: number, doc: Documento) => {
    const docs = [...form.documentos]; docs[i] = doc; setDocs(docs)
  }
  const handleDocRemove = (i: number) => setDocs(form.documentos.filter((_, idx) => idx !== i))
  const handleAddDoc = () => {
    const usados = form.documentos.map(d => d.tipo)
    const proximo = TIPOS_DOC.find(t => !usados.includes(t))
    if (proximo) setDocs([...form.documentos, { tipo: proximo, numero: '', dataExpedicao: '' }])
  }

  const handleTipoChange = (tipo: TipoCliente) => {
    setForm(emptyForm(tipo)); setErrs({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm(form, isDependente)
    if (isDependente && !form.titularId) errors.titularId = 'Selecione o titular'
    if (Object.keys(errors).length > 0) { setErrs(errors); return }

    const payload: Omit<Cliente, 'id'> = {
      ...form,
      titularId: form.titularId ? parseInt(form.titularId, 10) : null,
    }

    if (editId != null) updateCliente(editId, payload)
    else addCliente(payload)

    setSaved(true)
    setTimeout(() => { setSaved(false); setActivePage('clientes-listar') }, 1200)
  }

  const usedTipos = form.documentos.map(d => d.tipo)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="brand-font text-2xl font-800 text-base-content">
          {editId != null ? 'Editar Cliente' : 'Cadastrar Cliente'}
        </h2>
        <p className="text-sm text-base-content/50 mt-1">
          Campos marcados com <span className="text-error">*</span> são obrigatórios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {editId == null && (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5">
              <SectionTitle>Tipo de cliente</SectionTitle>
              <div className="flex gap-3 pt-1">
                {(['titular', 'dependente'] as TipoCliente[]).map(t => (
                  <label key={t} className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border-2 transition-all flex-1
                    ${form.tipo === t ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-base-300'}`}>
                    <input type="radio" className="radio radio-primary radio-sm"
                      checked={form.tipo === t} onChange={() => handleTipoChange(t)} />
                    <div>
                      <p className="font-600 capitalize text-sm">{t}</p>
                      <p className="text-xs text-base-content/50">
                        {t === 'titular' ? 'Hóspede principal da reserva' : 'Vinculado a um titular'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {isDependente && (
          <div className="card bg-warning/5 shadow-sm border border-warning/30">
            <div className="card-body p-5">
              <SectionTitle>Titular responsável</SectionTitle>
              <Field label="Selecione o titular" required error={errs.titularId}>
                <select
                  value={form.titularId}
                  onChange={e => set('titularId', e.target.value)}
                  className={`select select-bordered w-full ${errs.titularId ? 'select-error' : ''}`}
                >
                  <option value="">— Escolha o titular —</option>
                  {titulares.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </Field>
              {titulares.length === 0 && (
                <p className="text-sm text-warning mt-1">Nenhum titular cadastrado ainda.</p>
              )}
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-4">
            <SectionTitle>Dados pessoais</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome completo" required error={errs.nome}>
                <input type="text" value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Ex: João da Silva"
                  className={`input input-bordered w-full ${errs.nome ? 'input-error' : ''}`} />
              </Field>

              <Field label="Nome social" error={errs.nomeSocial}>
                <input type="text" value={form.nomeSocial}
                  onChange={e => set('nomeSocial', e.target.value)}
                  placeholder="Como prefere ser chamado(a)"
                  className={`input input-bordered w-full ${errs.nomeSocial ? 'input-error' : ''}`} />
              </Field>

              <Field label="Data de nascimento" required error={errs.dataNasc}>
                <input type="date" value={form.dataNasc} max={today()}
                  onChange={e => set('dataNasc', e.target.value)}
                  className={`input input-bordered w-full ${errs.dataNasc ? 'input-error' : ''}`} />
              </Field>

              {!isDependente && <>
                <Field label="E-mail" error={errs.email}>
                  <input type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="joao@email.com"
                    className="input input-bordered w-full" />
                </Field>

                <Field label="Telefone" error={errs.telefone}>
                  <input type="text" value={form.telefone}
                    onChange={e => set('telefone', masks.telefone(e.target.value))}
                    placeholder="(11) 99999-0000"
                    className="input input-bordered w-full font-mono" />
                </Field>
              </>}
            </div>
          </div>
        </div>

        {!isDependente && (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5 gap-4">
              <SectionTitle>Endereço</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['rua',    'Rua / Logradouro', 'Rua das Flores, 100'],
                  ['bairro', 'Bairro',            'Centro'],
                  ['cidade', 'Cidade',             'São Paulo'],
                  ['pais',   'País',               'Brasil'],
                ] as [keyof Endereco, string, string][]).map(([field, label, placeholder]) => (
                  <Field key={field} label={label} required error={errs[`endereco.${field}`]}>
                    <input type="text" value={form.endereco[field]}
                      onChange={e => setEndereco(field, e.target.value)}
                      placeholder={placeholder}
                      className={`input input-bordered w-full ${errs[`endereco.${field}`] ? 'input-error' : ''}`} />
                  </Field>
                ))}

                <Field label="Estado" required error={errs['endereco.estado']}>
                  <input type="text" value={form.endereco.estado}
                    onChange={e => setEndereco('estado', e.target.value.toUpperCase())}
                    placeholder="SP" maxLength={2}
                    className={`input input-bordered w-full uppercase ${errs['endereco.estado'] ? 'input-error' : ''}`} />
                </Field>

                <Field label="CEP" required error={errs['endereco.cep']}>
                  <input type="text" value={form.endereco.cep}
                    onChange={e => setEndereco('cep', masks.cep(e.target.value))}
                    placeholder="00000-000"
                    className={`input input-bordered w-full font-mono ${errs['endereco.cep'] ? 'input-error' : ''}`} />
                </Field>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Documentos<span className="text-error ml-0.5">*</span></SectionTitle>
              {form.documentos.length < 3 && (
                <button type="button" onClick={handleAddDoc} className="btn btn-ghost btn-xs text-primary">
                  + Adicionar documento
                </button>
              )}
            </div>

            {errs.documentos && <p className="text-error text-sm">{errs.documentos}</p>}

            <div className="space-y-3">
              {form.documentos.map((doc, i) => (
                <DocumentoRow key={i} doc={doc} index={i}
                  onChange={handleDocChange} onRemove={handleDocRemove}
                  errs={errs} usedTipos={usedTipos} />
              ))}
            </div>

            <p className="text-xs text-base-content/40">
              Cada tipo (CPF, RG, Passaporte) pode ser cadastrado apenas uma vez. Máximo de 3 documentos.
            </p>
          </div>
        </div>

        {Object.keys(errs).length > 0 && !saved && (
          <div className="alert alert-error py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            <span className="text-sm">Corrija os erros indicados antes de salvar.</span>
          </div>
        )}

        {saved && (
          <div className="alert alert-success py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Cliente salvo com sucesso!</span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            {editId != null ? 'Salvar alterações' : 'Cadastrar cliente'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setActivePage('clientes-listar')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
    // 
  )
}