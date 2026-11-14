import { describe, expect, it } from "vitest";
import { formatNumber } from "../formatNumber";

describe("formatNumber", () => {
  it("deve formatar números com duas casas decimais", () => {
    expect(formatNumber(5)).toBe("5,00");
  });

  it("deve utilizar ponto como separador de milhar", () => {
    expect(formatNumber(1250.5)).toBe("1.250,50");
  });

  it("deve permitir personalizar as casas decimais", () => {
    expect(formatNumber(5, 0, 2)).toBe("5");
  });

  it("deve respeitar a quantidade mínima de casas decimais", () => {
    expect(formatNumber(5, 1, 2)).toBe("5,0");
  });

  it("deve alterar a quantidade mínima de casas decimais", () => {
    expect(formatNumber(5, 3)).toBe("5,000");
  });

  it("deve arredondar corretamente os números", () => {
    expect(formatNumber(0.375)).toBe("0,38");
  });
});
