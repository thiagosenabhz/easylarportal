export function formatCurrencyBRL(value: number): string {
  if (isNaN(value)) return "R$ 0,00";

  // Valor está em reais (inteiro). Vamos forçar 2 casas decimais.
  const amount = Number(value);

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyBRL(input: string): {
  raw: string;
  value: number;
} {
  // Remove tudo que não é dígito
  const digitsOnly = input.replace(/\D/g, "");

  if (!digitsOnly) {
    return { raw: "", value: 0 };
  }

  // Interpretamos como centavos
  const cents = parseInt(digitsOnly, 10);
  const value = cents / 100;

  const formatted = formatCurrencyBRL(value);
  return { raw: formatted, value };
}
