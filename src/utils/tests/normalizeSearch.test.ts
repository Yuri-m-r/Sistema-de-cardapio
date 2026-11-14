import { describe, it, expect } from "vitest";

import { normalizeSearch } from "../normalizeSearch";

describe("normalizeSearch", () => {
  it("deve remover acentos de caracteres", () => {
    const result = normalizeSearch("Coração");

    expect(result).toBe("coracao");
  });

  it("deve converter letras maiúsculas para minúsculas", () => {
    const result = normalizeSearch("ARROZ");

    expect(result).toBe("arroz");
  });

  it("deve remover acentos e converter para minúsculas", () => {
    const result = normalizeSearch("FEIJÃO");

    expect(result).toBe("feijao");
  });

  it("deve preservar espaços entre palavras", () => {
    const result = normalizeSearch("PRATO PRINCIPAL");

    expect(result).toBe("prato principal");
  });

  it("deve retornar uma string vazia quando receber uma string vazia", () => {
    const result = normalizeSearch("");

    expect(result).toBe("");
  });

  it("deve preservar caracteres que não possuem acentos", () => {
    const result = normalizeSearch("Arroz 123");

    expect(result).toBe("arroz 123");
  });
});
