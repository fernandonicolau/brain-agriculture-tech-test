type BrazilianDocumentType = 'CPF' | 'CNPJ';

type BrazilianDocumentValidationResult = {
  normalizedDocument: string;
  type: BrazilianDocumentType;
};

function normalizeDocument(document: string): string {
  return document.replace(/\D/g, '');
}

function hasRepeatedDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

function validateCpf(document: string): boolean {
  if (document.length !== 11 || hasRepeatedDigits(document)) {
    return false;
  }

  const digits = document.split('').map(Number);
  const firstCheckDigit =
    (digits.slice(0, 9).reduce((sum, digit, index) => sum + digit * (10 - index), 0) * 10) % 11;
  const normalizedFirstCheckDigit = firstCheckDigit === 10 ? 0 : firstCheckDigit;

  if (normalizedFirstCheckDigit !== digits[9]) {
    return false;
  }

  const secondCheckDigit =
    (digits.slice(0, 10).reduce((sum, digit, index) => sum + digit * (11 - index), 0) * 10) % 11;
  const normalizedSecondCheckDigit = secondCheckDigit === 10 ? 0 : secondCheckDigit;

  return normalizedSecondCheckDigit === digits[10];
}

function validateCnpj(document: string): boolean {
  if (document.length !== 14 || hasRepeatedDigits(document)) {
    return false;
  }

  const digits = document.split('').map(Number);
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstSum = digits
    .slice(0, 12)
    .reduce((sum, digit, index) => sum + digit * firstWeights[index], 0);
  const firstRemainder = firstSum % 11;
  const firstCheckDigit = firstRemainder < 2 ? 0 : 11 - firstRemainder;

  if (firstCheckDigit !== digits[12]) {
    return false;
  }

  const secondSum = digits
    .slice(0, 13)
    .reduce((sum, digit, index) => sum + digit * secondWeights[index], 0);
  const secondRemainder = secondSum % 11;
  const secondCheckDigit = secondRemainder < 2 ? 0 : 11 - secondRemainder;

  return secondCheckDigit === digits[13];
}

export function validateBrazilianDocument(
  document: string,
): BrazilianDocumentValidationResult | null {
  const normalizedDocument = normalizeDocument(document);

  if (validateCpf(normalizedDocument)) {
    return {
      normalizedDocument,
      type: 'CPF',
    };
  }

  if (validateCnpj(normalizedDocument)) {
    return {
      normalizedDocument,
      type: 'CNPJ',
    };
  }

  return null;
}
