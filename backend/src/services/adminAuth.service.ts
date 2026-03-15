import { AppError } from "../utils/AppError";
import { loginUser } from "./auth.service";

export const loginAdmin = async (input: { email: string; password: string }) => {
  const result = await loginUser(input);
  if (result.user.role !== "admin") {
    throw new AppError("Invalid credentials.", 401);
  }

  return {
    admin: {
      id: result.user.id,
      email: result.user.email,
      role: "admin"
    },
    token: result.token
  };
};
