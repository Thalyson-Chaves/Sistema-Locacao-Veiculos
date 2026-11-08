export default function Pagination({
  paginaAtual,
  totalPaginas,
  totalItens,
  itensPorPagina,
  onMudarPagina,
}) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginaSegura = Math.min(Math.max(1, paginaAtual), totalPaginas);
  const indiceInicial = (paginaSegura - 1) * itensPorPagina + 1;
  const indiceFinal = Math.min(paginaSegura * itensPorPagina, totalItens);

  const paginas = Array.from({ length: totalPaginas }, (_, idx) => idx + 1);

  return (
    <div className="mt-6 pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-4">
      <p className="text-xs text-slate-600">
        Mostrando <strong className="text-slate-900">{indiceInicial}</strong> a{' '}
        <strong className="text-slate-900">{indiceFinal}</strong> de{' '}
        <strong className="text-slate-900">{totalItens}</strong> registro(s)
      </p>

      <nav
        className="flex items-center gap-1.5"
        aria-label="Navegação de páginas"
      >
        <button
          type="button"
          onClick={() => onMudarPagina(paginaSegura - 1)}
          disabled={paginaSegura <= 1}
          className="px-3 py-1.5 rounded-lg border border-emerald-900/20 bg-white text-brand-primary font-bold text-xs transition-all cursor-pointer hover:bg-brand-primary-light disabled:opacity-45 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {paginas.map((numeroPagina) => {
            const ativa = numeroPagina === paginaSegura;
            return (
              <button
                key={numeroPagina}
                type="button"
                onClick={() => onMudarPagina(numeroPagina)}
                aria-current={ativa ? 'page' : undefined}
                className={`w-8 h-8 rounded-lg font-extrabold text-xs transition-all cursor-pointer ${
                  ativa
                    ? 'bg-brand-primary text-brand-accent border-2 border-brand-accent shadow-xs'
                    : 'bg-brand-primary-light text-brand-primary hover:bg-brand-primary/15'
                }`}
              >
                {numeroPagina}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onMudarPagina(paginaSegura + 1)}
          disabled={paginaSegura >= totalPaginas}
          className="px-3 py-1.5 rounded-lg border border-emerald-900/20 bg-white text-brand-primary font-bold text-xs transition-all cursor-pointer hover:bg-brand-primary-light disabled:opacity-45 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </nav>
    </div>
  );
}
