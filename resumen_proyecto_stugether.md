# Stugether — Plataforma de Alquiler y Convivencia Estudiantil
## Resumen Ejecutivo de Proyecto (TFG - DAM)

Este documento ofrece una visión global y detallada sobre **Stugether** (también referenciado como *Stuguether*), una plataforma web full-stack diseñada específicamente para resolver la problemática del alquiler de habitaciones y la convivencia de estudiantes universitarios en España.

---

## 1. ¿Qué es el proyecto?

**Stugether** es una solución digital de tipo *marketplace* que conecta a dos grupos clave de usuarios: **estudiantes universitarios** que buscan alojamiento seguro y compatible con sus hábitos de vida, y **propietarios** de inmuebles que desean alquilar habitaciones, estudios o pisos completos a un perfil académico.

### La Problemática de Origen
1. **Incompatibilidad de convivencia:** Para los estudiantes, compartir piso no es solo una transacción económica; la convivencia con personas incompatibles en horarios, limpieza o estilo de vida genera fricciones constantes. Las plataformas generales no abordan este aspecto social.
2. **Falta de avales e historial crediticio:** Las inmobiliarias tradicionales exigen nóminas y avales con los que un estudiante rara vez cuenta.
3. **Fraude y opacidad:** La falta de mecanismos de verificación en el alquiler entre particulares deja expuestos a los jóvenes a estafas de anuncios falsos o pérdida de depósitos.
4. **Comisiones abusivas:** Las plataformas especializadas actuales imponen tarifas elevadas que no se adaptan a la realidad económica del estudiante medio.

### La Propuesta de Stugether
Frente a esto, Stugether propone un entorno digital seguro, diseñado desde cero para el colectivo estudiantil, estructurado bajo un **stack tecnológico moderno y escalable** con la siguiente arquitectura desacoplada:

*   **Frontend (Cliente - Single Page Application):** Construido con **React** y **Vite**, gestionando la navegación fluida a través de **React Router v7**. Utiliza **TanStack Query** para la sincronización eficiente y almacenamiento en caché del estado del servidor, y **Leaflet** integrado con **OpenStreetMap** para la geolocalización interactiva de inmuebles sin depender de APIs de pago.
*   **Backend (Servidor - API REST):** Desarrollado con **Django 4.2** y **Django REST Framework (DRF)**. Gestiona la autenticación segura sin estado mediante **SimpleJWT (tokens JWT)**, la lógica de negocio modular en aplicaciones Django independientes, y filtros de búsqueda avanzados.
*   **Base de datos:** Utiliza **PostgreSQL** para producción (debido a su soporte y robustez con datos estructurados y geoespaciales) y **SQLite** para el desarrollo rápido local.
*   **Flujo de datos:** El cliente (React) realiza peticiones HTTP con formato JSON a la API REST (Django), la cual interactúa de forma segura con la base de datos a través del ORM de Django y devuelve las respuestas formateadas en JSON de vuelta al cliente.

---

## 2. Puntos Fuertes (Propuesta de Valor & Fortalezas)

Stugether destaca frente a otras alternativas gracias a una serie de características técnicas y funcionales orientadas a crear confianza y facilitar la experiencia del usuario:

*   **Enfoque 100% Universitario:** Los perfiles de los estudiantes muestran detalles de su vida académica (universidad, carrera, curso) junto con sus hábitos de convivencia.
*   **Perfiles de Convivencia Estructurados:** Los usuarios definen sus preferencias (fumador/no fumador, madrugador/noctámbulo, nivel de orden, sociabilidad, mascotas, etc.). Esto permite comprobar la afinidad antes de contactar.
*   **Búsqueda y Filtrado Geográfico por Proximidad:** Motor de búsqueda capaz de filtrar propiedades por cercanía a universidades específicas, mostrando distancias calculadas.
*   **Flujo de Reserva Seguro con Custodia de Pagos (Escrow):** Lógica que gestiona el ciclo completo de la reserva para proteger los fondos de los estudiantes y asegurar el cobro de los propietarios.
*   **Mensajería Interna Segura con Filtro de Contenido:** Chat integrado entre inquilinos y propietarios que incluye un filtro automático de lenguaje inapropiado (*profanity filter*), normalizando tildes y variantes léxicas en español.
*   **Verificación KYC (Know Your Customer) y Email:** Registro con verificación obligatoria por correo (UUID token) y sección para la carga de documentos de identidad y matrícula.
*   **API REST Documentada:** Interfaz estructurada mediante OpenAPI 3.0 (Swagger), lo que asegura que el backend esté listo para conectarse con cualquier otro cliente (como una futura aplicación móvil).

---

## 3. Competencia en el Mercado (Estado del Arte)

El sector de las tecnologías inmobiliarias (*Proptech*) cuenta con actores consolidados. Sin embargo, ninguno cubre de manera integrada el nicho específico universitario con un modelo de negocio accesible:

1.  **Idealista y Fotocasa (Generalistas):** Líderes en volumen, pero sin adaptación al público joven. Carecen de filtros por universidades, perfiles de convivencia, mensajería integrada fluida y gestión de reservas en línea.
2.  **Badi (Foco en habitabilidad):** Cuenta con perfiles de convivencia de calidad, pero ha adoptado modelos de suscripción de pago agresivos para poder contactar a los anunciantes. Además, carece de un sistema integrado de reservas y pagos en custodia.
3.  **Spotahome y Uniplaces (Internacionales):** Plataformas muy orientadas a estudiantes extranjeros con reserva directa, pero con comisiones altísimas (de hasta el 50% de una mensualidad) y sin posibilidad de chatear o interactuar previamente con los propietarios o compañeros.
4.  **Habitoom (Económica):** Tiene un modelo gratuito, pero carece de verificación de usuarios, filtros complejos o pasarela de reservas, lo que incrementa el riesgo de fraudes.

### Tabla Comparativa de Funcionalidades

| Característica / Funcionalidad | **Stugether** | **Badi** | **Spotahome** | **Uniplaces** | **Idealista** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Perfil de convivencia (hábitos)** | ✅ Sí | ✅ Sí | ❌ No | ❌ No | ❌ No |
| **Filtro por universidad cercana** | ✅ Sí | ❌ No | ❌ No | ✅ Parcial | ❌ No |
| **Mensajería interna integrada** | ✅ Sí | ✅ Sí | ❌ No | ❌ No | ❌ No |
| **Gestión y flujo de reservas** | ✅ Sí | ❌ No | ✅ Sí | ✅ Sí | ❌ No |
| **Custodia de pagos (Escrow)** | ✅ Sí (Lógico) | ❌ No | ✅ Sí | ✅ Sí | ❌ No |
| **Gratuito para buscar y contactar** | ✅ Sí | ⚠️ Limitado | ✅ Sí | ✅ Sí | ✅ Sí |
| **API Pública Documentada (OpenAPI)** | ✅ Sí | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 4. Mejoras y Vías Futuras

Stuguether se ha diseñado siguiendo principios de modularidad y escalabilidad, dejando el terreno preparado para incorporar las siguientes líneas de desarrollo:

### a. Integración de Pasarela de Pagos Reales (Stripe Connect)
La lógica de estados de escrow ya está construida en el backend. El siguiente paso natural es conectar la plataforma con **Stripe Connect** para automatizar el flujo financiero real:
*   Retener la fianza y primer mes en custodia.
*   Liberar el pago al propietario 48 horas después de la entrada del estudiante.
*   Gestionar devoluciones de forma automática en caso de cancelaciones dentro de plazo.

### b. Algoritmo de Matching de Compañeros
Implementar un sistema de recomendación basado en la similitud de cosenos sobre los vectores de hábitos de convivencia. Esto permitiría a los estudiantes encontrar compañeros compatibles y sugerirles pisos vacantes de forma proactiva.

### c. Notificaciones y Chat en Tiempo Real (WebSockets / Channels)
Migrar el sistema actual de consulta periódica (*polling* de 5-10s) a una conexión persistente por WebSockets mediante Django Channels para habilitar:
*   Mensajería instantánea sin latencia.
*   Indicadores de presencia ("en línea", "escribiendo...").
*   Notificaciones push en el navegador.

### d. Verificación de Matrícula mediante OCR y APIs Universitarias
Integrar APIs públicas de las universidades españolas para verificar la condición de estudiante activo en tiempo real. Como alternativa, implementar una lectura inteligente de matrículas en PDF mediante reconocimiento óptico de caracteres (OCR) para automatizar la aprobación KYC.

### e. Aplicación Móvil con React Native
Dado que el frontend está construido en React y el backend consume una API REST pura, se puede reutilizar más del 60% de la lógica del proyecto (llamadas a la API con Axios, caché de React Query y contextos de autenticación) en una aplicación nativa para iOS y Android.

### f. Optimización SEO mediante SSR/SSG
Para maximizar la visibilidad de los anuncios en buscadores (Google), una mejora recomendada es migrar la SPA a un framework como **Next.js** o incorporar prerrenderizado en servidor (Server-Side Rendering), superando la limitación de indexación que tienen las SPA tradicionales.

---

### Flujo de Reserva Integrado en la Plataforma

Para garantizar la transparencia y seguridad tanto de inquilinos como de propietarios, el sistema implementa un workflow con los siguientes estados lógicos y transiciones:

1.  **Solicitud de Reserva (`PENDING`):** El **Estudiante** selecciona las fechas de entrada/salida desde el detalle de una propiedad. El sistema calcula automáticamente el desglose de costes (alquiler base × meses, fianza y comisión de servicio del 7%). Se envía la petición al propietario.
2.  **Aprobación de la Solicitud (`ACCEPTED`):** El **Propietario** revisa los datos académicos, hábitos de convivencia y perfil del estudiante desde su panel, y decide aceptar la solicitud.
3.  **Confirmación y Depósito (`CONFIRMED`):** Tras la aceptación, el **Estudiante** confirma la reserva de manera definitiva. Esto activa el estado de pago de custodia (**Escrow**), simulando la retención segura de los fondos (fianza + primer mes de alquiler) por parte de la plataforma.
4.  **Inicio del Periodo de Alquiler y Entrada:** El estudiante entra a vivir al inmueble y se inicia el periodo de alquiler contratado.
5.  **Liberación de Fondos y Cierre (`COMPLETED`):** Transcurridas 48 horas tras la fecha de entrada al piso (dando margen para comprobar que el piso se corresponde con el anuncio y evitar fraudes), la **Plataforma (Escrow)** libera los fondos retenidos y los transfiere al **Propietario**, cerrando el flujo como completado.
