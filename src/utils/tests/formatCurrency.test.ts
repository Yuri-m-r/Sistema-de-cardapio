import { describe, it, expect } from "vitest";
import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  it("deve formatar valores positivos em reais", () => {
    const result = formatCurrency(1234.5);

    expect(result).toBe("R$\u00A01.234,50");
  });

  it("deve formatar zero corretamente", () => {
    const result = formatCurrency(0);

    expect(result).toBe("R$\u00A00,00");
  });

  it("deve formatar valores com centavos", () => {
    const result = formatCurrency(10.5);

    expect(result).toBe("R$\u00A010,50");
  });

  it("deve formatar valores negativos", () => {
    const result = formatCurrency(-50);

    expect(result).toBe("-R$\u00A050,00");
  });
});
