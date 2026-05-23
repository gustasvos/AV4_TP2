import { useApp } from '../context/AppContext'

interface NavItem {
  id: string
  label: string
}

interface NavSection {
  section: string
  icon: React.ReactNode
  items: NavItem[]
}

const navItems: NavSection[] = [
  {
    section: 'Gerenciar Clientes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: [
      { id: 'clientes-listar', label: 'Hóspedes' },
      { id: 'clientes-cadastrar', label: 'Cadastrar Hóspedes' },
    ]
  },
  {
    section: 'Gestão',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    items: [
      { id: 'acomodacoes', label: 'Acomodações' },
      { id: 'hospedagens', label: 'Registrar Hospedagens' },
    ]
  },
]

export default function Sidebar() {
  const { activePage, setActivePage } = useApp()

  return (
    <aside className="w-64 min-h-screen bg-base-200 flex flex-col border-r border-base-300">
      {/* Brand */}<div className="px-6 py-6 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-widest uppercase text-primary">
              Atlantis
            </h1>
            <p className="text-xs text-base-content/50 font-medium">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
            ${activePage === 'dashboard'
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
          </svg>
          Dashboard
        </button>

        {navItems.map(({ section, icon, items }) => (
          <div key={section}>
            <div className="flex items-center gap-2 px-3 mb-1.5">
              <span className="text-base-content/40">{icon}</span>
              <span className="text-xs font-700 uppercase tracking-widest text-base-content/40 brand-font">
                {section}
              </span>
            </div>
            <div className="space-y-0.5">
              {items.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActivePage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                    ${activePage === id
                      ? 'bg-primary/10 text-primary font-600'
                      : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-base-300">
        <div className="flex items-center gap-3 px-2">
          <div className="avatar placeholder">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-700">
              A
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 text-base-content truncate">Admin</p>
            <p className="text-xs text-base-content/40 truncate">admin@atlantis.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}