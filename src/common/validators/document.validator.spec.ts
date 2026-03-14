import { validateBrazilianDocument } from './document.validator';

describe('validateBrazilianDocument', () => {
  it('validates a CPF', () => {
    const result = validateBrazilianDocument('529.982.247-25');

    expect(result).toEqual({
      normalizedDocument: '52998224725',
      type: 'CPF',
    });
  });

  it('validates a CNPJ', () => {
    const result = validateBrazilianDocument('04.252.011/0001-10');

    expect(result).toEqual({
      normalizedDocument: '04252011000110',
      type: 'CNPJ',
    });
  });

  it('returns null for invalid document', () => {
    expect(validateBrazilianDocument('111.111.111-11')).toBeNull();
  });
});
