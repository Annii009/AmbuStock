

export function useValidation() {
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string, minLength: number = 6): boolean => {
    return password.length >= minLength;
  };

  const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };

  return {
    validateEmail,
    validatePassword,
    validateRequired
  };
}
