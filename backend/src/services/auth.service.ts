import User from "@/models/user.model";
import { AppError } from "@/utils/app-error";
import { generateToken } from "@/utils/jwt-token";
import { LoginDto, RegisterDto } from "@/validators/auth.validator";

export async function register(data: RegisterDto) {
  const { fullName, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
}

export async function login(data: LoginDto) {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
}
