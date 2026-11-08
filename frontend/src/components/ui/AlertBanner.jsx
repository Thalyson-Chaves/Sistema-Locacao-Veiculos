import { useEffect } from 'react';

export default function AlertBanner({ feedback, onClose, duracaoMs = 5000 }) {
  useEffect(() => {
    if (!feedback || !feedback.mensagem) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duracaoMs);

    return () => clearTimeout(timer);
  }, [feedback, onClose, duracaoMs]);

  if (!feedback || !feedback.mensagem) {
    return null;
  }

  const isErro = feedback.tipo === 'erro';

  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl mb-6 border-2 shadow-sm transition-all ${
        isErro
          ? 'bg-red-50 border-red-400 text-red-900'
          : 'bg-brand-accent-soft border-brand-accent text-brand-primary-dark'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md ${
            isErro
              ? 'bg-red-800 text-white'
              : 'bg-brand-primary text-brand-accent'
          }`}
        >
          {isErro ? 'Erro' : 'Sucesso'}
        </span>
        <span className="font-semibold text-sm">{feedback.mensagem}</span>
      </div>
      <button
        type="button"
        className="text-current font-bold text-base px-2 py-1 rounded-md opacity-75 hover:opacity-100 hover:bg-black/5 cursor-pointer"
        onClick={onClose}
        aria-label="Fechar mensagem"
      >
        ✕
      </button>
    </div>
  );
}
