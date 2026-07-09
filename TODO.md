# TODO - Premium ringan & interaktif (mobile friendly)

## Step 1 — Audit & refactor interaksi (script.js)
- [ ] Hilangkan duplikasi handler WhatsApp submit (pilih satu: `handleContactForm`).
- [ ] Hilangkan `revealOnScroll()` manual agar tidak bentrok dengan IntersectionObserver.
- [ ] Samakan reveal pakai IntersectionObserver untuk `.reveal, .reveal-left, .reveal-bottom`.
- [ ] Pastikan scroll listener hanya yang perlu (navbar scrolled + scroll spy bila dipakai).

## Step 2 — Premium interaksi ringan (index.html)
- [ ] Tambah UI filter kategori di section Produk.
- [ ] Tambah data kategori pada tiap item produk.
- [ ] Tambah komponen interaktif di Hero yang tetap ringan & touch-friendly.

## Step 3 — Styling premium & bugfix (style.css)
- [ ] Fix bug `cta-button` border `var(#...)`.
- [ ] Style chips filter Produk + animasi hover/active yang ringan.
- [ ] Style marquee Mitra (mobile friendly).

## Step 4 — Interaksi Premium (script.js)
- [ ] Implement filter produk: on-click chip, toggle visibility cepat.
- [ ] Implement interaksi hero (tilt halus) yang aman di mobile.
- [ ] Marquee mitra bila diperlukan.

## Step 5 — Testing
- [ ] Cek mobile: menu, scroll, reveal, filter produk, submit kontak (WA).
- [ ] Cek performa: tidak ada double animation / double submit.

