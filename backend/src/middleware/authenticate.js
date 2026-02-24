import jwt from "jsonwebtoken";
import prisma from "../db.js";

export default async function authenticate(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ message: "No autorizado" });
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await prisma.user.findUnique({
      where: { id: BigInt(payload.sub) },
    });
    if (!user) return res.status(401).json({ message: "No autorizado" });
    req.user = { id: Number(user.id), email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
