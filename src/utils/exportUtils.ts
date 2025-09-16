/**
 * Utilitários para exportação de relatórios
 */

interface ExportData {
  period: string;
  metrics: any[];
  transactions: any[];
  generatedAt: string;
}

/**
 * Exporta dados em formato JSON
 */
export const exportToJSON = (data: ExportData, filename: string) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

/**
 * Exporta dados em formato CSV
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Gera relatório completo do parceiro
 */
export const generatePartnerReport = (partnerData: any, period: string) => {
  const reportData: ExportData = {
    period,
    metrics: partnerData.metrics,
    transactions: partnerData.transactions,
    generatedAt: new Date().toISOString()
  };
  
  const filename = `relatorio-parceiro-${new Date().toISOString().split('T')[0]}.json`;
  exportToJSON(reportData, filename);
};

/**
 * Formata dados para exibição
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};