import { useApp } from '../context/AppContext'

const Badge = ({ children, color = 'badge-ghost' }) => (
    <span className={`badge badge-sm ${color}`}>{children}</span>
)

export default function Acomodacoes() {
    const { acomodacoes } = useApp()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="brand-font text-2xl font-800 text-base-content">Acomodações</h2>
                <p className="text-sm text-base-content/50 mt-1">Tipos de acomodação disponíveis no Atlantis</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {acomodacoes.map(a => (
                    <div key={a.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="card-body p-5">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="brand-font font-700 text-base-content">{a.nome}</h3>
                                {a.climatizacao && (
                                    <span className="badge badge-info badge-sm">Climatizado</span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between text-base-content/70">
                                    <span>Cama solteiro</span>
                                    <span className="font-600 text-base-content">{a.camaSolteiro}</span>
                                </div>
                                <div className="flex items-center justify-between text-base-content/70">
                                    <span>Cama casal</span>
                                    <span className="font-600 text-base-content">{a.camaCasal}</span>
                                </div>
                                <div className="flex items-center justify-between text-base-content/70">
                                    <span>Suítes</span>
                                    <span className="font-600 text-base-content">{a.suite}</span>
                                </div>
                                <div className="flex items-center justify-between text-base-content/70">
                                    <span>Vagas de garagem</span>
                                    <span className="font-600 text-base-content">{a.garagem}</span>
                                </div>
                            </div>

                            <div className="divider my-2" />

                            <div className="flex flex-wrap gap-1.5">
                                {a.camaSolteiro > 0 && <Badge color="badge-ghost">{a.camaSolteiro}× solteiro</Badge>}
                                {a.camaCasal > 0 && <Badge color="badge-ghost">{a.camaCasal}× casal</Badge>}
                                {a.suite > 0 && <Badge color="badge-primary badge-outline">{a.suite}× suíte</Badge>}
                                {a.garagem > 0 && <Badge color="badge-ghost">{a.garagem}× garagem</Badge>}
                                {a.garagem === 0 && <Badge color="badge-warning badge-outline">Sem garagem</Badge>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}