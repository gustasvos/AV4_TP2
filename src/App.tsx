import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ClientesListar from './pages/ClientesListar'
import ClientesForm from './pages/ClientesForm'
import Acomodacoes from './pages/Acomodacoes'
import Hospedagens from './pages/Hospedagens'

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    'clientes-listar': 'Clientes',
    'clientes-cadastrar': 'Cadastrar Cliente',
    acomodacoes: 'Acomodações',
    hospedagens: 'Hospedagens',
}

function PageContent() {
    const { activePage } = useApp()

    if (activePage === 'dashboard') return <Dashboard />
    if (activePage === 'clientes-listar') return <ClientesListar />
    if (activePage === 'clientes-cadastrar') return <ClientesForm editId={undefined} />
    if (activePage === 'acomodacoes') return <Acomodacoes />
    if (activePage === 'hospedagens') return <Hospedagens />

    if (activePage.startsWith('clientes-editar-')) {
        const id = parseInt(activePage.split('-').pop())
        return <ClientesForm editId={id} />
    }

    return <Dashboard />
}

function AppLayout() {
    const { activePage } = useApp()
    const title = activePage.startsWith('clientes-editar-')
        ? 'Editar Cliente'
        : (PAGE_TITLES[activePage] ?? 'Atlantis')

    return (
        <div className="flex min-h-screen bg-base-100">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-base-200 bg-base-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                        <span className="text-base-content/30">Atlantis</span>
                        <span>/</span>
                        <span className="text-base-content font-medium">{title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                    </div>
                </header>

                <div className="flex-1 p-8">
                    <PageContent />
                </div>
            </main>
        </div>
    )
}

export default function App() {
    return (
        <AppProvider>
            <AppLayout />
        </AppProvider>
    )
}