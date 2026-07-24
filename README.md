# vite-ness API

Backend REST API yang berjalan di Cloudflare Workers. Project ini menggunakan
[Hono](https://hono.dev/) untuk pola routing dan middleware yang mirip Express,
tetapi tetap memakai API native Cloudflare Workers—tidak ada `app.listen()` atau
server Node.js yang harus dipelihara.

Resource contoh `todos` sudah memiliki CRUD persisten melalui SQLite-backed
Durable Object. Tidak diperlukan `database_id` atau layanan database eksternal
untuk menjalankannya.

## Arsitektur

```text
Browser / API client
        |
        v
Hono Worker: CORS, request ID, error handler, optional API key
        |
        v
TodoStore Durable Object: SQLite dan CRUD todos
```

`TodoStore` menggunakan satu instance bernama `default`, sehingga semua operasi
CRUD konsisten dan data tetap tersimpan setelah Worker restart. Saat aplikasi
sudah memiliki tenant atau pengguna, ubah nama instance di `src/worker/app.ts`
agar di-shard berdasarkan tenant/user.

## Menjalankan lokal

```bash
npm install
npm run cf-typegen
npm run dev
```

Wrangler akan menampilkan URL lokal, biasanya `http://localhost:8787`.

```bash
curl http://localhost:8787/api/v1/health

curl -X POST http://localhost:8787/api/v1/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Deploy API ke Workers","description":"Coba CRUD lokal"}'

curl 'http://localhost:8787/api/v1/todos?completed=false&limit=20'
```

## Endpoint

| Method | Path | Keterangan |
| --- | --- | --- |
| `GET` | `/` | Metadata service singkat |
| `GET` | `/api/v1` | Daftar resource API |
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/todos?page=1&limit=20&completed=false` | Daftar todo dengan pagination/filter |
| `POST` | `/api/v1/todos` | Buat todo |
| `GET` | `/api/v1/todos/:id` | Ambil satu todo |
| `PATCH` | `/api/v1/todos/:id` | Ubah todo |
| `DELETE` | `/api/v1/todos/:id` | Hapus todo (`204`) |

Contoh body untuk membuat todo:

```json
{
  "title": "Deploy API ke Workers",
  "description": "Opsional; maksimal 2000 karakter",
  "completed": false
}
```

Contoh respons sukses:

```json
{
  "data": {
    "id": "b94860d7-e9ee-4d2d-ac4c-e12aa9a9d5df",
    "title": "Deploy API ke Workers",
    "description": null,
    "completed": false,
    "createdAt": "2026-07-24T00:00:00.000Z",
    "updatedAt": "2026-07-24T00:00:00.000Z"
  },
  "meta": {
    "requestId": "..."
  }
}
```

Semua error menggunakan bentuk berikut:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title tidak boleh kosong."
  },
  "meta": {
    "requestId": "..."
  }
}
```

## Konfigurasi produksi

`wrangler.json` sudah mendaftarkan binding `TODO_STORE` dan migrasi Durable
Object SQLite. Cloudflare akan menyiapkan namespace-nya saat deploy pertama.

`CORS_ORIGIN` secara default bernilai `*`. Untuk production, ganti nilainya
menjadi origin frontend yang diizinkan, misalnya:

```json
"vars": {
  "CORS_ORIGIN": "https://app.example.com,https://admin.example.com"
}
```

Autentikasi API key bersifat opsional. Setelah secret ini dibuat, seluruh route
`/api/v1/todos` wajib menyertakan `Authorization: Bearer <nilai-secret>`:

```bash
npx wrangler secret put API_KEY
```

Health check dan metadata API tetap terbuka agar bisa dipakai monitoring.

## Perintah

```bash
npm run dev         # Worker lokal dengan hot reload
npm run typecheck   # Validasi TypeScript
npm run lint        # Lint source Worker
npm run build       # Typecheck + validasi bundle/deploy tanpa mengunggah
npm run check       # Lint + build
npm run deploy      # Deploy ke Cloudflare Workers
```

Sebelum deploy pertama, autentikasi ke akun Cloudflare Anda lalu jalankan:

```bash
npx wrangler login
npm run cf-typegen
npm run check
npm run deploy
```
