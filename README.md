# Stugether — Plataforma de Alquiler Estudiantil

## Stack
- **Frontend**: React 18 + Vite + React Router v6 + TanStack Query
- **Backend**: Django 4.2 + Django REST Framework + JWT
- **Base de datos**: SQLite (dev) / PostgreSQL (prod)
- **Mapas**: OpenStreetMap + Leaflet (sin API key)

## Inicio rápido

### Backend
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env          # editar SECRET_KEY al menos
python manage.py migrate
python manage.py createsuperuser  # acceso al admin Django
python manage.py runserver
# API disponible en http://localhost:8000/api/
# Admin Django en http://localhost:8000/admin/
# Docs API (Swagger) en http://localhost:8000/api/docs/
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173/
```

## Variables de entorno
Copia `.env.example` a `.env` en la carpeta `backend/` y ajusta los valores:
- `SECRET_KEY` — clave Django (obligatoria en producción)
- `DB_*` — solo necesario para producción con PostgreSQL; en desarrollo se usa SQLite automáticamente

## Estructura
```
stuguether/
├── backend/          Django API + modelos + auth JWT
│   ├── apps/users/           Usuarios, perfiles, documentos KYC
│   ├── apps/properties/      Pisos, universidades, favoritos, filtros
│   ├── apps/reservations/    Reservas con sistema Escrow
│   ├── apps/messages_app/    Mensajería interna
│   └── apps/reviews/         Reseñas verificadas
└── frontend/         React SPA
    ├── pages/Home/           Landing page
    ├── pages/Auth/           Login + Registro con rol
    ├── pages/Search/         Búsqueda con mapa Leaflet
    ├── pages/Property/       Detalle + formulario de reserva
    └── pages/Dashboard/
        ├── Student/          Reservas, favoritos, mensajes, docs, config
        └── Owner/            Anuncios, nuevo anuncio, solicitudes, verificación
```

## API Endpoints principales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register/ | Registro (rol en body) |
| POST | /api/auth/login/ | Login → devuelve JWT |
| GET | /api/auth/me/ | Perfil del usuario autenticado |
| GET | /api/properties/ | Listado con filtros y paginación |
| POST | /api/properties/ | Crear anuncio (propietarios) |
| GET | /api/properties/{id}/ | Detalle de propiedad |
| GET/POST | /api/reservations/ | Mis reservas / Crear reserva |
| PATCH | /api/reservations/{id}/ | Aceptar/rechazar/cancelar |
| GET/POST | /api/auth/documents/ | Documentos KYC |
| GET/POST | /api/messages/conversations/ | Mensajería |
