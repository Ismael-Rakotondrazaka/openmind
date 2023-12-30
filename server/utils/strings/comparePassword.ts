import { compareSync } from "bcrypt";

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return compareSync(password, hashedPassword);
};

export { comparePassword };
