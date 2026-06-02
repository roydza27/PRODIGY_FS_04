export const normalizeUsername = (value: string) => {
  return value.toLowerCase().replace(/\s+/g, "");
};

export const passwordsMatch = (
  password: string,
  confirmPassword: string
) => {
  return password === confirmPassword;
};

export const hasResetToken = (token?: string | null) => {
  return Boolean(token);
};