# Estructura del Proyecto Stugether

Este documento resume de forma estructurada y concisa la función de cada archivo y carpeta en el proyecto **Stugether** (tanto del backend como del frontend).

---

## 📂 Directorio Raíz del Proyecto (`Stugether/`)
*   [.env.example](file:///Users/beltran/Desktop/TFG/Stugether/.env.example): Archivo de plantilla con las variables de entorno necesarias para la ejecución local y en producción (SECRET_KEY, base de datos, CORS, etc.).
*   [README.md](file:///Users/beltran/Desktop/TFG/Stugether/README.md): Guía de inicio rápido con instrucciones para correr el backend, instalar el frontend y un listado de endpoints clave de la API.
*   [index.html](file:///Users/beltran/Desktop/TFG/Stugether/index.html): Documento HTML de prueba/presentación general fuera de la estructura de la aplicación.

---

## 📂 Backend (`backend/`)
El servidor de la aplicación, desarrollado con **Django 4.2** y **Django REST Framework (DRF)**.

### 📁 Archivos de Configuración y Raíz
*   [manage.py](file:///Users/beltran/Desktop/TFG/Stugether/backend/manage.py): Utilidad CLI de Django para ejecutar tareas administrativas (migraciones, servidor de desarrollo, sembrado de datos).
*   [requirements.txt](file:///Users/beltran/Desktop/TFG/Stugether/backend/requirements.txt): Archivo de dependencias del servidor en Python (Django, SimpleJWT, Pillow, drf-spectacular, etc.).
*   **`core/`**: Configuración principal de Django:
    *   `settings.py`: Redirecciona las configuraciones por defecto a `config/settings/development.py`.
    *   `urls.py`: Enrutador global de la API que expone los endpoints en `/api/` y la documentación interactiva.
    *   `wsgi.py` / `asgi.py`: Entrada para el despliegue del servidor en producción.
*   **`config/settings/`**: Módulos de configuración divididos por entornos:
    *   `base.py`: Ajustes comunes del proyecto (apps, middlewares, autenticación JWT, envío de emails).
    *   `development.py`: Ajustes para desarrollo local (Base de datos SQLite local y CORS permisivo).
    *   `production.py`: Ajustes de producción (Base de datos PostgreSQL y seguridad de cabeceras).

### 📁 Aplicaciones de Django (`backend/apps/`)
El backend se organiza en aplicaciones modulares desacopladas por contexto:

1.  **`users/` (Usuarios y Verificación KYC)**:
    *   `models.py`: Define el modelo de usuario personalizado (`CustomUser`), los perfiles de estudiante/propietario y los tokens de verificación por correo.
    *   `views.py` / `serializers.py`: Registro de usuarios, login, verificación de email e interfaces para subir y consultar los documentos de identidad para el KYC.
2.  **`properties/` (Pisos, Habitaciones y Geolocalización)**:
    *   `models.py`: Estructura las propiedades, fotos de habitaciones, listas de favoritos y la información geográfica de Universidades y Campuses.
    *   `views.py` / `serializers.py`: Listados de viviendas, gestión de favoritos, subida de imágenes y cálculo de distancias por fórmula matemática (*Haversine*).
    *   `filters.py`: Lógica de filtros (precio, tipo de vivienda, etc.).
    *   `management/commands/`: Scripts de inicialización `seed_universities.py` y `seed_campuses.py` para cargar los datos de universidades en la BD.
3.  **`reservations/` (Gestión de Reservas y Custodia)**:
    *   `models.py`: Define la reserva (`Reservation`) y su máquina de estados lógica (`PENDING`, `ACCEPTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
    *   `views.py` / `serializers.py`: Procesamiento de reservas, desgloses económicos, aceptación por el propietario y simulación del pago seguro (Escrow).
4.  **`messages_app/` (Chat Interno)**:
    *   `models.py`: Estructura para conversaciones e historial de mensajes.
    *   `views.py`: Gestión del chat en tiempo real por polling y envío automático de correos notificando nuevos mensajes pendientes.
    *   `serializers.py`: Validación de mensajes e implementación del filtro local contra lenguaje inapropiado (*profanity filter*).
5.  **`reviews/` (Valoraciones)**:
    *   `models.py` / `views.py` / `serializers.py`: Lógica de comentarios y puntuaciones verificadas entre inquilinos y propietarios tras finalizar un alquiler.

---

## 📂 Frontend (`frontend/`)
La interfaz de usuario del proyecto, construida como una Single Page Application (SPA) con **React 19** y **Vite**.

### 📁 Archivos de Configuración y Raíz
*   [package.json](file:///Users/beltran/Desktop/TFG/Stugether/frontend/package.json): Gestión de dependencias en JS (React, Axios, Leaflet, TanStack Query) y scripts npm para arrancar la app.
*   [vite.config.js](file:///Users/beltran/Desktop/TFG/Stugether/frontend/vite.config.js): Configuración del compilador y servidor de desarrollo local de Vite.
*   [index.html](file:///Users/beltran/Desktop/TFG/Stugether/frontend/index.html): Documento HTML de base donde se renderiza la aplicación React.

### 📁 Código Fuente (`frontend/src/`)
*   `main.jsx`: Archivo de entrada JavaScript que inicializa y monta React en el DOM.
*   `App.jsx`: Definición del enrutamiento de la aplicación (`react-router-dom`) y estructura de envoltura del sitio.
*   **`styles/`**: Estilos CSS del proyecto.
*   **`contexts/`**:
    *   `AuthContext.jsx`: Contexto global para la gestión del inicio de sesión, almacenamiento del JWT, rol de usuario e información de perfil.
*   **`api/`**:
    *   `client.js`: Cliente Axios configurado para inyectar automáticamente el token JWT en las cabeceras HTTP y comunicarse con la API de Django.
*   **`components/`**: Elementos de UI reutilizables por toda la web (cabeceras, barras de navegación, botones premium, tarjetas de anuncios, modales de confirmación).

### 📁 Vistas y Páginas (`frontend/src/pages/`)
Organización de las secciones y flujos principales de la plataforma web:
1.  **`Home/`**: Landing page principal con buscador integrado y presentación del marketplace.
2.  **`Search/`**: Buscador interactivo de habitaciones. Muestra un listado de inmuebles al lado de un mapa interactivo desarrollado con **Leaflet** y filtros de cercanía.
3.  **`Property/`**: Ficha de detalle de las habitaciones (galería de fotos, datos del propietario, perfil de convivencia, etc.) y flujo para solicitar la reserva.
4.  **`Auth/`**: Vistas de login, registro con selector de rol (estudiante o propietario) y pantalla de verificación de email tras el registro.
5.  **`Dashboard/`**: Panel de control privado estructurado según el rol del usuario:
    *   **`Student/`**: Gestión de solicitudes de reserva enviadas, lista de favoritos, sección para subir los documentos del KYC y configuración personal.
    *   **`Owner/`**: Sección para publicar nuevos pisos, lista de solicitudes de reserva recibidas para gestionar (aceptar o rechazar) y estado de verificación de su cuenta.
    *   **Mensajería / Chat**: Interfaz integrada para chatear entre inquilinos y propietarios de forma segura.
6.  **`Static/`**: Páginas de ayuda al usuario, términos y condiciones del servicio.
7.  **`NotFound.jsx`**: Vista de error para manejar enlaces rotos o inexistentes.
