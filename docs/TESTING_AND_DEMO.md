# OttLeszek — Tesztelés és demó (gyors útmutató)

## Előfeltételek

- **Node.js** ≥ 20  
- **pnpm** (`npm install -g pnpm`)  
- **Expo Go** app a telefonon (opcionális, szimulátorral is lehet)

---

## 1. Backend indítása

```bash
cd apps/backend
cp .env.example .env
pnpm run db:generate
pnpm run dev
```

- A backend a **http://localhost:3000** címen fut.  
- Ellenőrzés: böngészőben nyisd meg: http://localhost:3000/health  
  → `{"status":"ok","service":"ottleszek-backend"}`

---

## 2. Mobil app indítása

**Külön terminálban:**

```bash
cd apps/mobile
pnpm run dev
```

- Megjelenik a QR kód és a parancsok (i = iOS, a = Android).  
- **Fontos:** az app a backendhez a **localhost:3000**-et használja alapból.

### API URL beállítása (emulátor / valódi eszköz)

| Környezet            | Parancs / beállítás |
|----------------------|----------------------|
| **iOS szimulátor**   | Nincs teendő, a `localhost` jó. |
| **Android emulátor** | `localhost` helyett a PC = `10.0.2.2`. Indítsd így: `set EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 && pnpm run dev` (Windows) vagy `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 pnpm run dev` (Mac/Linux). |
| **Valódi telefon**   | A telefonnak a **gépedre** kell mutatnia. 1) Tudod a gép IP-jét (pl. `ipconfig` → IPv4). 2) Indítsd: `set EXPO_PUBLIC_API_URL=http://192.168.x.x:3000 && pnpm run dev` (cseréld a 192.168.x.x-et a saját IP-dre). 3) Telefon és PC legyen ugyanazon a Wi‑Fin. |

**Alternatíva:** Hozz létre egy `apps/mobile/.env` fájlt: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` (Android) vagy a géped IP-je (telefon). Így nem kell minden indításkor beállítani.

---

## 3. Mindkettő egy parancsból (gyökérből)

```bash
pnpm run dev:all
```

- Backend és mobile párhuzamosan fut.  
- Ha a mobilon nem a localhost a backend: előbb állítsd be az `EXPO_PUBLIC_API_URL`-t (lásd fent), majd a **mobile** mappában futtasd a `pnpm run dev`-ot külön.

---

## 4. Rövid demó menet (≈2 perc)

1. **App megnyitása** → Üdvözlő képernyő → **Tovább**.
2. **Adatkezelés** → **Elfogadom, tovább**.
3. **Belépés:**  
   - E-mail/telefon: pl. `teszt@example.com` → **Kód kérése**.  
   - Kód: **123456** (fejlesztői) → **Belépés**.
4. **Főoldal** → **Részveszek** → elköteleződés rögzítve.
5. **Terv** fül → **Terv létrehozása** → adj hozzá 2–3 lépést (pl. „Regisztrálok”, „Elmegyek szavazni”) → **Lépés hozzáadása**.
6. **Emlékeztetők** fül → **Emlékeztető hozzáadása (holnap 9:00)**.
7. **Főoldal** → kattints egy lépésre → megjelölés késznek (✓).
8. **Kapcsolat** fül → név + e-mail → **Hozzáadás** → **Emlékeztető** (sablon).
9. **Beállítások** → Értesítések, Export, Kijelentkezés.

---

## 5. Gyors ellenőrzések

| Mit tesztelsz      | Hogyan |
|--------------------|--------|
| Backend él-e       | http://localhost:3000/health → `"status":"ok"` |
| DB él-e            | http://localhost:3000/health/ready → `"ready":true` |
| Belépés            | E-mail + kód **123456** → belépés és főoldal |
| API hiba a mobilon | Ha „Network request failed”: ellenőrizd az API URL-t (Android: 10.0.2.2, telefon: géped IP-je). |

---

## 6. Assetek (ikonok)

- **apps/mobile/assets/**  
  - `icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`  
  - Valódi app ikon (kék kör + pipa, 1024×1024), mindenhol ezek az assetek használatban.

Ha új ikont szeretnél: cseréld ki ezeket a fájlokat, vagy generáld újra a design tokeneknek megfelelő színekkel (#1a1a2e, #6c9eff).
