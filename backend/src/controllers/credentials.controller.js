import prisma from "../db.js";
import { encrypt, decrypt } from "../utils/crypto.js";

function sanitize(c) {
  return {
    id: Number(c.id),
    serviceName: c.service_name,
    accountUsername: c.account_username
      ? Buffer.isBuffer(c.account_username)
        ? c.account_username.toString("utf8")
        : String(c.account_username)
      : null,
    url: c.url,
    notes: c.notes,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

export async function listCredentials(req, res) {
  const userId = Number(req.user.id);
  const items = await prisma.credential.findMany({
    where: { user_id: BigInt(userId) },
    orderBy: { updated_at: "desc" },
  });
  return res.json(items.map(sanitize));
}

export async function createCredential(req, res) {
  const userId = Number(req.user.id);
  const { serviceName, accountUsername, password, url, notes } = req.body;
  if (!serviceName || !accountUsername || !password)
    return res.status(400).json({
      message: "serviceName, accountUsername y password son requeridos",
    });
  const encrypted = encrypt(password);
  const created = await prisma.credential.create({
    data: {
      user_id: BigInt(userId),
      service_name: serviceName,
      // store account username and encrypted password as bytes/blobs
      account_username: accountUsername
        ? Buffer.from(String(accountUsername), "utf8")
        : null,
      password_encrypted: encrypted,
      url,
      notes,
    },
  });
  return res.status(201).json(sanitize(created));
}

export async function getCredential(req, res) {
  const userId = Number(req.user.id);
  const id = Number(req.params.id);
  const c = await prisma.credential.findUnique({ where: { id: BigInt(id) } });
  if (!c) return res.status(404).json({ message: "No encontrada" });
  if (Number(c.user_id) !== userId)
    return res.status(403).json({ message: "No autorizado" });
  return res.json(sanitize(c));
}

export async function revealPassword(req, res) {
  const userId = Number(req.user.id);
  const id = Number(req.params.id);
  const c = await prisma.credential.findUnique({ where: { id: BigInt(id) } });
  if (!c) return res.status(404).json({ message: "No encontrada" });
  if (Number(c.user_id) !== userId)
    return res.status(403).json({ message: "No autorizado" });
  const password = decrypt(c.password_encrypted);
  // audit log
  const meta = { ip: req.ip, ua: req.headers["user-agent"] || null };
  await prisma.auditLog.create({
    data: {
      user_id: BigInt(userId),
      credential_id: BigInt(id),
      action: "SHOW_PASSWORD",
      metadata: meta,
    },
  });
  return res.json({ password });
}

export async function updateCredential(req, res) {
  const userId = Number(req.user.id);
  const id = Number(req.params.id);
  const c = await prisma.credential.findUnique({ where: { id: BigInt(id) } });
  if (!c) return res.status(404).json({ message: "No encontrada" });
  if (Number(c.user_id) !== userId)
    return res.status(403).json({ message: "No autorizado" });
  const { serviceName, accountUsername, password, url, notes } = req.body;
  const data = {};
  if (serviceName) data.service_name = serviceName;
  if (accountUsername)
    data.account_username = Buffer.from(String(accountUsername), "utf8");
  if (password) data.password_encrypted = encrypt(password);
  if (url !== undefined) data.url = url;
  if (notes !== undefined) data.notes = notes;
  const updated = await prisma.credential.update({
    where: { id: BigInt(id) },
    data,
  });
  return res.json(sanitize(updated));
}

export async function deleteCredential(req, res) {
  const userId = Number(req.user.id);
  const id = Number(req.params.id);
  const c = await prisma.credential.findUnique({ where: { id: BigInt(id) } });
  if (!c) return res.status(404).json({ message: "No encontrada" });
  if (Number(c.user_id) !== userId)
    return res.status(403).json({ message: "No autorizado" });
  await prisma.credential.delete({ where: { id: BigInt(id) } });
  return res.status(204).send();
}
