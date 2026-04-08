export const generateRefNo = (): string => {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `REF-${random}`;
};