import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email y password requeridos" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: "Usuario ya existe" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password_hash: hash },
  });
  return res.status(201).json({ id: Number(user.id), email: user.email });
}

export async function login(req, res) {
  const email = req.body.email || req.body.username;
  const password = req.body.password;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email/usuario y password requeridos" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });
  const token = jwt.sign(
    { sub: String(user.id), email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "2h" },
  );
  return res.json({ token });
}
