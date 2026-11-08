export default function Navbar({
  usuario,
  abaAtiva,
  onMudarAba,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-50 bg-linear-to-br from-brand-primary to-brand-primary-dark text-white border-b-4 border-brand-accent shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-xl bg-brand-accent text-brand-primary font-black text-lg flex items-center justify-center tracking-tight shadow-md shadow-brand-accent/30"
            aria-hidden="true"
          >
            <span><img src="/logoEco.png" alt="logoEco.png" /></span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-tight text-white">
              EcoDrive
            </h1>
            <p className="text-xs font-medium text-brand-accent">
              Sistema de Locação de Veículos
            </p>
          </div>
        </div>

        {usuario ? (
          <>
            <nav
              className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-full"
              aria-label="Navegação principal"
            >
              <button
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'veiculos'
                    ? 'bg-brand-accent text-brand-primary-dark font-bold shadow-sm shadow-brand-accent/40'
                    : 'text-emerald-50 hover:bg-white/15 hover:text-white'
                }`}
                onClick={() => onMudarAba('veiculos')}
              >
                Veículos
              </button>
              <button
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  abaAtiva === 'locacoes'
                    ? 'bg-brand-accent text-brand-primary-dark font-bold shadow-sm shadow-brand-accent/40'
                    : 'text-emerald-50 hover:bg-white/15 hover:text-white'
                }`}
                onClick={() => onMudarAba('locacoes')}
              >
                Minhas Locações
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end leading-tight">
                <strong className="text-sm text-white">{usuario.nome}</strong>
              </div>
              <button
                type="button"
                className="bg-transparent text-white border-2 border-brand-accent px-4 py-1.5 rounded-lg font-bold text-sm transition-all cursor-pointer hover:bg-brand-accent hover:text-brand-primary-dark"
                onClick={onLogout}
              >
                Sair
              </button>
            </div>
          </>
        ) : (
          <div>
          </div>
        )}
      </div>
    </header>
  );
}
