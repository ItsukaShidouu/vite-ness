import { Hono } from "hono";

// Hapus atau sesuaikan <{ Bindings: Env }> jika Env belum didefinisikan
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => {
  return c.json({
    message: "not found babe<3",
    backend: "ness cibaduyut"
  });
});

export default app;
