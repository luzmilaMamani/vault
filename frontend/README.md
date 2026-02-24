# Mini Vault - Frontend

Frontend simple usando Vite + React con las pantallas solicitadas: Login, listado, crear/editar y detalle.

Run:

```bash
cd "mini-vault/frontend"
npm install
npm run dev
```

Notes:

- La API base se toma de `VITE_API_URL` (por defecto `http://localhost:3000`).
- Los endpoints esperados: `/auth/login`, `/credentials`, `/credentials/:id`.
- Autenticación: token guardado en `localStorage` como `mv_token`.
