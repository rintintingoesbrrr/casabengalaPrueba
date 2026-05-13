# Corona Capital 2026 — Entrega

## URL del proyecto

http://3.142.219.219

## Repositorio

https://github.com/rintintingoesbrrr/casabengalaPrueba

---

## Descripcion

Landing page interactiva para el evento Corona Capital 2026 con formulario de registro, temporizador y galeria multimedia.

---

## Requisitos cubiertos

**Front-End**
- React + Vite + TypeScript
- Seccion de inicio con animacion de entrada al cargar la pagina
- Seccion de informacion del evento
- Formulario de registro con temporizador regresivo: al expirar desaparece el formulario
- Galeria multimedia con imagenes del evento
- Hover effects y animaciones al hacer scroll

**Back-End**
- Node.js + Express
- Recibe nombre, correo y mensaje desde el formulario
- Guarda los datos en una base de datos MySQL (Amazon RDS)
- Validaciones de entrada en frontend y backend

---

## Instalacion

### 1. Clonar

```bash
git clone https://github.com/rintintingoesbrrr/casabengalaPrueba.git
cd casabengalaPrueba
```

### 2. Backend

```bash
cd backend
sudo apt update && sudo apt install nodejs npm
npm install
touch .env
```

`.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=ip_base_de_datos
DB_PORT=3306
DB_NAME=nombre_db
DB_USER=admin
DB_PASSWORD=contrasena
CORS_ORIGIN=http://ip-del-servidor
```

```bash
node src/index.js
```

### 3. Frontend

```bash
cd frontend
npm install
touch .env
```

`.env`:

```env
VITE_API_URL=http://ip-del-servidor:3000
```

```bash
npm run dev
```

### 4. Produccion (puerto 80)

```bash
sudo systemctl stop nginx
npm install -g pm2
sudo pm2 start "npx vite --host 0.0.0.0 --port 80" --name frontend
pm2 start src/index.js --name backend
pm2 save
```

---

## Verificar backend

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```