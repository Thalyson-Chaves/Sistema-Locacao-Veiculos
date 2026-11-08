export const MS_POR_DIA = 24 * 60 * 60 * 1000;

export const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const formatarDataHora = (dataIso) => {
  if (!dataIso) return '—';
  const data = new Date(dataIso);
  if (isNaN(data.getTime())) return '—';
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const obterDataLocalISO = (diasAdicionais = 0) => {
  const data = new Date();
  data.setDate(data.getDate() + diasAdicionais);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};
