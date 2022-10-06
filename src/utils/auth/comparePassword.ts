import bcrypt from "bcrypt";

export const comparePassword = async (pass1: string, pass2: string) => {
  const isMatch = await bcrypt.compare(pass1, pass2);
  return isMatch;
};
