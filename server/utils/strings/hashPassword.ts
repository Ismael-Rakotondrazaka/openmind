import { hashSync } from "bcrypt";

const hashPassword = (password: string): string => {
  const passwordSaltRounds = 10;
  return hashSync(password, passwordSaltRounds);
};

export { hashPassword };
