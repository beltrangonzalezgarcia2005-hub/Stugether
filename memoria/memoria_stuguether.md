# STUGUETHER
## Plataforma digital de búsqueda y gestión de alojamiento para estudiantes universitarios

---

**Proyecto Final de Ciclo — Desarrollo de Aplicaciones Multiplataforma**

**Autor:** Antonio Montero Barroso  
**Tutor:** José Manuel Ruiz González  
**Institución:** iLERNA  
**Curso:** 2025-2026  

---

\newpage

## Índice

1. [Análisis del Sector Productivo y Contexto Profesional](#1-análisis-del-sector-productivo-y-contexto-profesional)
2. [Introducción](#2-introducción)
3. [Estado del Arte](#3-estado-del-arte)
4. [Metodología](#4-metodología)
5. [Tecnologías y Herramientas](#5-tecnologías-y-herramientas)
6. [Viabilidad, Recursos y Presupuesto del Proyecto](#6-viabilidad-recursos-y-presupuesto-del-proyecto)
7. [Planificación, Diagnóstico y Contexto Laboral](#7-planificación-diagnóstico-y-contexto-laboral)
8. [Análisis](#8-análisis)
9. [Diseño](#9-diseño)
10. [Pruebas y Validación](#10-pruebas-y-validación)
11. [Plan de Ejecución del Proyecto](#11-plan-de-ejecución-del-proyecto)
12. [Procedimientos de Seguimiento, Control y Calidad](#12-procedimientos-de-seguimiento-control-y-calidad)
13. [Conclusiones](#13-conclusiones)
14. [Vías Futuras](#14-vías-futuras)
15. [Bibliografía y Webgrafía](#15-bibliografía-y-webgrafía)
16. [Anexos](#16-anexos)

---

\newpage

## 1. Análisis del Sector Productivo y Contexto Profesional

### 1.a. Descripción general del sector TIC

El sector de las Tecnologías de la Información y la Comunicación (TIC) constituye uno de los pilares fundamentales de la economía española y global. Según el informe de ONTSI (Observatorio Nacional de Tecnología y Sociedad) de 2024, el sector TIC supone aproximadamente el 4,5 % del PIB nacional y emplea a más de 600.000 profesionales en España, cifra que sigue creciendo a un ritmo superior al de otros sectores productivos.

El desarrollo de software, en particular, experimenta una demanda sin precedentes impulsada por la transformación digital de empresas de todos los tamaños. El auge del trabajo remoto, la digitalización de procesos empresariales y el crecimiento del comercio electrónico han acelerado la necesidad de aplicaciones web y multiplataforma robustas, seguras y escalables.

Dentro del mercado de aplicaciones web, el modelo de plataformas digitales tipo marketplace —que conectan a dos o más grupos de usuarios con necesidades complementarias— ha demostrado ser uno de los más exitosos de la última década. Ejemplos como Airbnb, Idealista o Wallapop ilustran cómo la tecnología puede transformar mercados tradicionales creando valor tanto para ofertantes como para demandantes.

### 1.b. Tipos de empresas y áreas de actividad

El proyecto Stuguether se enmarca dentro del ámbito de las empresas de desarrollo de software B2C (Business to Consumer) que operan mediante plataformas digitales. Este tipo de empresas se caracterizan por:

- **Startups tecnológicas:** Empresas de tamaño reducido que desarrollan productos digitales innovadores buscando escalabilidad rápida. Suelen emplear metodologías ágiles y equipos pequeños y polivalentes.
- **Proptech (Property Technology):** Sector emergente que aplica tecnología al mercado inmobiliario. Empresas como Idealista, Fotocasa o Spotahome operan en este nicho con modelos de negocio basados en la comisión por intermediación.
- **EdTech y marketplace estudiantil:** Plataformas orientadas al ecosistema universitario que facilitan servicios (alojamiento, transporte, material académico) al colectivo estudiantil.

El perfil de la empresa ficticia para la que se desarrolla Stuguether sería una startup española del sector Proptech-EdTech, con un equipo técnico de 3-5 personas, orientada al segmento de estudiantes universitarios y propietarios particulares de inmuebles.

### 1.c. Necesidades actuales del mercado

El mercado del alojamiento estudiantil en España presenta una problemática clara y creciente:

- **Escasez de oferta:** Las ciudades universitarias principales (Madrid, Barcelona, Valencia, Sevilla, Granada) sufren una crónica falta de alojamientos asequibles para estudiantes, con precios medios de habitación que superan los 600€/mes en las grandes capitales según el Observatorio de Emancipación del Consejo de la Juventud de España (2024).
- **Opacidad y fraude:** El mercado de alquiler de habitaciones entre particulares carece de mecanismos de verificación robustos, lo que expone a los estudiantes a anuncios fraudulentos y condiciones abusivas.
- **Falta de especialización:** Las plataformas genéricas de alquiler (Idealista, Fotocasa) no están diseñadas pensando en las necesidades específicas del colectivo estudiantil: compatibilidad de hábitos de convivencia, proximidad a la universidad, acceso a transporte público, etc.
- **Barrera geográfica:** La mayoría de estudiantes deben buscar alojamiento en ciudades donde no residen, lo que complica enormemente el proceso sin herramientas digitales adecuadas.

Estas necesidades generan una oportunidad de mercado clara para una plataforma especializada que aporte confianza, verificación de identidad y funcionalidades orientadas específicamente al estudiante universitario.

### 1.d. Oportunidades profesionales y de negocio

El perfil de desarrollador de aplicaciones multiplataforma especializado en plataformas web de tipo marketplace tiene una alta demanda en el mercado laboral actual. Las empresas del sector Proptech buscan perfiles con conocimientos en:

- Desarrollo full-stack con frameworks modernos (Django, FastAPI, React, Vue)
- Diseño e implementación de APIs REST
- Gestión de autenticación segura (JWT, OAuth2)
- Integración de sistemas de pagos y escrow
- Administración de bases de datos relacionales (PostgreSQL)

Desde el punto de vista del negocio, el modelo de monetización de Stuguether se basa en una comisión del 7% sobre el total de cada reserva gestionada a través de la plataforma, lo que permite generar ingresos sin coste directo para los usuarios que solo navegan o contactan propietarios.

El mercado de alquiler estudiantil en España mueve aproximadamente 2.000 millones de euros anuales, por lo que incluso una cuota de mercado reducida representa un volumen de negocio significativo.

### 1.e. Aspectos legales y de seguridad

El desarrollo de Stuguether implica el tratamiento de datos personales de usuarios (nombres, correos electrónicos, documentos de identidad, datos bancarios), por lo que se deben considerar los siguientes marcos normativos:

- **RGPD (Reglamento General de Protección de Datos, UE 2016/679):** Obliga a informar a los usuarios del tratamiento de sus datos, obtener consentimiento explícito, garantizar el derecho al olvido y aplicar medidas técnicas de seguridad apropiadas (cifrado en tránsito mediante HTTPS/TLS, contraseñas almacenadas con hash bcrypt).
- **LOPD-GDD (Ley Orgánica 3/2018):** Adaptación española del RGPD, exige la designación de un Delegado de Protección de Datos para empresas que traten datos de forma masiva.
- **Ley 34/2002 (LSSI):** Regula los servicios de la sociedad de la información y el comercio electrónico, obligando a identificar al prestador del servicio y proporcionar información precontractual clara.
- **PRL (Prevención de Riesgos Laborales):** En el entorno de desarrollo de software, los principales riesgos son ergonómicos (postura, vista) y psicosociales (estrés, trabajo prolongado). Se recomienda aplicar la regla 20-20-20 para descanso ocular y configurar estaciones de trabajo ergonómicas.

Desde el punto de vista de la seguridad de la información, la plataforma implementa:
- Autenticación mediante JSON Web Tokens (JWT) con tiempo de expiración configurable.
- Verificación de correo electrónico obligatoria antes de poder acceder al panel.
- Almacenamiento de contraseñas con el algoritmo PBKDF2-SHA256 (Django por defecto).
- Comunicaciones cifradas mediante HTTPS (en producción).
- Variables de entorno para secretos (nunca en el código fuente).

### 1.f. Recursos y programas de apoyo

Para el desarrollo y futura puesta en producción de Stuguether existen diversas iniciativas de apoyo:

- **Kit Digital (Plan de Recuperación, Transformación y Resiliencia):** Programa de ayudas del Gobierno de España para la digitalización de pymes, con subvenciones de hasta 12.000€ para soluciones de comercio electrónico y marketplaces.
- **ENISA (Empresa Nacional de Innovación):** Ofrece préstamos participativos para startups tecnológicas en fases early-stage.
- **Aceleradoras universitarias:** Programas como el de la Universidad de Málaga (UMA Emprende) o la ETSII de Madrid apoyan proyectos tecnológicos de alumnos con mentoría y financiación semilla.
- **AWS Activate / Google for Startups:** Programas de créditos en la nube que permiten desplegar infraestructura sin coste inicial durante los primeros meses.

---

\newpage

## 2. Introducción

### 2.a. Motivación

La idea de Stuguether surge de una problemática real vivida en primera persona: la búsqueda de alojamiento al iniciar los estudios universitarios en una ciudad diferente a la de residencia. Este proceso es, para la mayoría de estudiantes españoles, una experiencia frustrante, cara y llena de incertidumbres.

Las plataformas existentes como Idealista o Fotocasa están pensadas para el mercado inmobiliario general, donde el perfil del inquilino es un profesional adulto con nómina y aval bancario. Los estudiantes, sin historial crediticio ni ingresos propios, quedan en clara desventaja. Por otro lado, plataformas especializadas como Badi o Spotahome, aunque más orientadas al colectivo joven, presentan modelos de negocio agresivos (suscripciones de pago, comisiones elevadas) que no se ajustan a la realidad económica del estudiante medio.

El segundo problema identificado es la compatibilidad de convivencia. Compartir piso no es únicamente una cuestión económica; la compatibilidad de hábitos, horarios y estilos de vida entre compañeros es determinante para el bienestar del estudiante. Ninguna plataforma actual ofrece un sistema estructurado de perfiles de convivencia que permita al estudiante filtrar potenciales compañeros por hábitos (fumador/no fumador, madrugador/noctámbulo, sociable/introvertido, deportista, etc.).

Stuguether nace para cubrir este nicho específico: una plataforma diseñada desde cero pensando en el estudiante universitario como usuario principal, con funcionalidades como:

- Sistema de verificación de identidad y matrícula universitaria.
- Perfiles de usuario con hábitos de convivencia y descripción personal.
- Filtrado avanzado de propiedades por proximidad a universidades concretas.
- Sistema de mensajería integrado entre estudiantes y propietarios.
- Gestión de reservas con sistema de pago en custodia (escrow) que protege ambas partes.
- Sistema de reseñas y valoraciones.

La motivación profesional también es relevante: el proyecto permite aplicar y demostrar competencias transversales del ciclo DAM, incluyendo diseño de bases de datos relacionales, desarrollo de APIs REST, autenticación segura, desarrollo de interfaces de usuario reactivas, y despliegue de aplicaciones web.

### 2.b. Abstract (English)

Stuguether is a full-stack web platform designed to solve the student housing problem in Spanish university cities. Built with Django REST Framework on the backend and React on the frontend, it provides a specialized marketplace where property owners can list rooms, studios, and full apartments, while students can search, filter, and book accommodations suited to their academic and lifestyle needs.

The platform features JWT-based authentication with email verification, role-based access control (student, owner, admin), real-time messaging between users, a favorites system, a reservation management module with escrow-style payment logic, and public student profiles with cohabitation habits. The search engine supports multi-criteria filtering including property type, price range, number of companions, amenities, and proximity to specific universities, powered by a PostGIS-friendly data model with geographic coordinates.

The project demonstrates the full development lifecycle from requirements analysis and database design to REST API implementation and reactive frontend development, following professional software engineering practices including environment-based configuration management, token-based security, and modular application architecture.

### 2.c. Objetivos

**Objetivos generales:**

- Diseñar y desarrollar una plataforma web full-stack funcional que conecte a estudiantes universitarios con propietarios de alojamientos, facilitando el proceso de búsqueda, contacto, reserva y gestión de alojamiento.
- Aplicar las competencias adquiridas durante el ciclo DAM en un proyecto integrador real, abarcando desde el diseño de base de datos hasta el despliegue de la aplicación.

**Objetivos específicos:**

1. **Diseñar un modelo de datos relacional** que represente usuarios con roles diferenciados (estudiante, propietario, administrador), propiedades con atributos específicos del mercado estudiantil y sus relaciones.
2. **Implementar una API REST segura** con Django REST Framework, incluyendo autenticación JWT, permisos por rol y documentación automática con drf-spectacular (OpenAPI 3.0).
3. **Desarrollar un sistema de verificación de correo electrónico** mediante tokens UUID únicos enviados por email, que impida el acceso al panel hasta confirmar la cuenta.
4. **Construir un motor de búsqueda y filtrado** de propiedades con soporte para múltiples criterios simultáneos (tipo, precio, ciudad, amenidades, universidad próxima).
5. **Implementar un sistema de mensajería** entre usuarios con control de conversaciones únicas por pareja de usuarios, detección de lenguaje inapropiado y lectura de mensajes no leídos.
6. **Desarrollar un módulo de reservas** con estados de flujo (pendiente → aceptada → confirmada → completada/cancelada) y cálculo automático de comisión de servicio (7%).
7. **Diseñar e implementar una interfaz de usuario** con React 19 y React Router v7, responsive y accesible, sin dependencias de frameworks CSS externos.
8. **Aplicar buenas prácticas de seguridad**: gestión de secretos mediante variables de entorno, CORS configurado, validaciones en backend y frontend, y mensajes de error que no filtren información sensible.

---

\newpage

## 3. Estado del Arte

### 3.a. Plataformas de alojamiento estudiantil existentes

El mercado de plataformas de alojamiento para estudiantes ha experimentado un crecimiento significativo en la última década. A continuación se analizan las principales soluciones existentes y sus limitaciones:

**Idealista y Fotocasa**

Son los líderes del mercado inmobiliario español en términos de volumen de anuncios. Ofrecen búsqueda por ciudad, precio, tamaño y tipo de inmueble. Sin embargo, no están especializadas en el colectivo estudiantil: no existe filtrado por proximidad a universidades, no hay perfiles de convivencia, y el proceso de reserva requiere gestiones completamente offline. Su modelo de negocio se basa en la visibilidad de anuncios de pago para propietarios.

**Badi**

Plataforma española fundada en 2015, orientada al colectivo joven y estudiante. Permite crear perfiles personales con intereses y hábitos. Su principal diferenciador es el matching por compatibilidad de estilo de vida. Sin embargo, ha cambiado su modelo de negocio varias veces (incluyendo suscripciones de pago para contactar anuncios) y no ofrece sistema de reservas ni gestión de pagos integrada.

**Spotahome**

Plataforma de alquiler de medio-largo plazo orientada a expatriados y estudiantes internacionales. Destaca por la verificación de propiedades mediante visitas virtuales. Cobra comisión tanto a propietarios como a inquilinos (hasta 50% de un mes de alquiler). No tiene funcionalidades de perfil de convivencia ni mensajería directa sin pago previo.

**Uniplaces**

Similar a Spotahome, con fuerte presencia en Portugal, España y Francia. Orientada principalmente al mercado de estudiantes Erasmus e internacionales. Requiere pago adelantado a través de la plataforma para reservar. No tiene funcionalidades de community ni perfiles de convivencia.

**Habitoom (antes Pisos.com para estudiantes)**

Plataforma nacional más económica, con anuncios gratuitos para propietarios. Carece de sistema de verificación de usuarios, mensajería integrada o gestión de reservas.

### 3.b. Análisis comparativo

| Característica | Stuguether | Badi | Spotahome | Uniplaces | Idealista |
|---|---|---|---|---|---|
| Perfil de convivencia | ✅ | ✅ | ❌ | ❌ | ❌ |
| Filtro por universidad | ✅ | ❌ | ❌ | ✅ (ciudad) | ❌ |
| Verificación email | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mensajería integrada | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestión de reservas | ✅ | ❌ | ✅ | ✅ | ❌ |
| Sistema de escrow | ✅ | ❌ | ✅ | ✅ | ❌ |
| Gratuito para buscar | ✅ | ✅ (limitado) | ✅ | ✅ | ✅ |
| API pública documentada | ✅ (OpenAPI) | ❌ | ❌ | ❌ | ❌ |

### 3.c. Tecnologías relevantes en el sector

**Backend**

El ecosistema de desarrollo backend para plataformas web en 2024-2025 está dominado por tres stacks principales:

- **Django + DRF (Python):** Elegido por su madurez, seguridad por defecto (protección CSRF, SQL injection, XSS), ecosistema robusto y la filosofía "batteries included". Es el stack más utilizado en startups europeas del sector Proptech según el informe Stack Overflow Developer Survey 2024.
- **Node.js + Express/NestJS (JavaScript):** Popular en equipos que prefieren un lenguaje unificado full-stack. Ofrece mayor rendimiento en aplicaciones de alta concurrencia gracias a su modelo de I/O no bloqueante.
- **FastAPI (Python):** Framework más reciente que Django REST Framework, con validación automática basada en type hints y documentación OpenAPI nativa. Ideal para microservicios de alto rendimiento.

Django DRF fue seleccionado para Stuguether por su robustez, la calidad de su sistema de autenticación y permisos, y la facilidad para modelar relaciones complejas en PostgreSQL.

**Frontend**

El desarrollo de interfaces de usuario modernas está dominado por los frameworks de componentes reactivos:

- **React (Meta):** La biblioteca más utilizada globalmente (según npm trends, supera los 30 millones de descargas semanales). Su modelo basado en componentes, su ecosistema (React Query, React Router, React Hook Form) y la compatibilidad con React Native para móvil la hacen la elección preferida para proyectos que puedan escalar a multiplataforma.
- **Vue.js:** Segunda opción más popular, con curva de aprendizaje ligeramente inferior. Mayor adopción en empresas medianas europeas.
- **Angular:** Framework completo mantenido por Google, con TypeScript como lenguaje principal. Preferido en grandes corporaciones por su estructura opinionada.

React fue elegido para Stuguether por su madurez, ecosistema y la posibilidad futura de reutilizar lógica en una aplicación móvil con React Native.

**Gestión de estado y datos del servidor**

TanStack Query (anteriormente React Query) representa el estándar actual para la sincronización de datos entre cliente y servidor en aplicaciones React. Gestiona automáticamente caché, refetch en background, estados de carga/error y optimistic updates, eliminando la necesidad de gestores de estado complejos como Redux para la mayoría de casos de uso.

**Autenticación**

JSON Web Tokens (JWT) es el estándar de facto para autenticación en APIs REST sin estado (stateless). La especificación RFC 7519 define el formato del token: cabecera (algoritmo de firma), payload (claims como user_id, rol, expiración) y firma (HMAC-SHA256 o RSA). La biblioteca SimpleJWT para Django implementa el par de tokens access/refresh con rotación automática.

---

\newpage

## 4. Metodología

### 4.a. Modelo de desarrollo

Para el desarrollo de Stuguether se ha adoptado una **metodología incremental-iterativa** inspirada en Scrum, adaptada al trabajo individual. La elección se justifica por las siguientes razones:

- **Requisitos cambiantes:** Al desarrollar un producto propio sin cliente externo definido, los requisitos evolucionan continuamente en función de los aprendizajes obtenidos durante el desarrollo. Un modelo en cascada rígido habría generado retrabajo considerable.
- **Entrega de valor temprana:** El enfoque incremental permitió tener versiones parcialmente funcionales desde las primeras semanas, lo que facilitó identificar problemas de diseño antes de que estuvieran demasiado arraigados en el código.
- **Trabajo individual:** La ausencia de un equipo grande hace innecesaria la ceremonia completa de Scrum (sprint planning, daily standup, retrospectiva formal), pero se mantienen sus principios de iteración corta y revisión continua.

**Adaptación al trabajo individual:**

- Iteraciones de 1-2 semanas con un objetivo concreto por iteración.
- Backlog de funcionalidades priorizado por valor (funcionalidades core primero).
- Revisión al final de cada iteración: ¿funciona lo implementado? ¿qué se aprendió?
- Uso de Git como herramienta de control de versiones y trazabilidad del progreso.

### 4.b. Fases del ciclo de vida

**Fase 1 — Planificación (semanas 1-2)**

Definición del alcance del proyecto, análisis de competidores, selección del stack tecnológico y boceto inicial de la arquitectura. Creación del repositorio Git y estructura inicial del proyecto.

**Fase 2 — Análisis de requisitos (semanas 2-3)**

Identificación de requisitos funcionales y no funcionales. Diseño del modelo de datos entidad-relación. Definición de los roles de usuario y sus permisos. Definición de los endpoints de la API REST.

**Fase 3 — Diseño (semanas 3-4)**

Diseño de la arquitectura de la aplicación (separación backend/frontend, comunicación via API REST). Diseño de la estructura de carpetas y módulos. Diseño de los wireframes de las principales pantallas.

**Fase 4 — Implementación (semanas 4-14)**

Desarrollo iterativo del backend y frontend en paralelo:
- Iteración 1: Sistema de autenticación y gestión de usuarios (registro, login, roles, JWT).
- Iteración 2: Verificación de correo electrónico.
- Iteración 3: CRUD de propiedades con imágenes y amenidades.
- Iteración 4: Motor de búsqueda y filtrado.
- Iteración 5: Sistema de favoritos.
- Iteración 6: Sistema de mensajería.
- Iteración 7: Sistema de reservas.
- Iteración 8: Perfiles públicos de usuario.
- Iteración 9: Panel de administración y pulido de UI.

**Fase 5 — Pruebas y validación (semanas 14-16)**

Pruebas funcionales de cada módulo, pruebas de integración entre frontend y backend, pruebas de seguridad básicas (autenticación, autorización, validación de datos).

**Fase 6 — Documentación y cierre (semanas 16-18)**

Redacción de la memoria técnica, manual de instalación y manual de usuario.

---

\newpage

## 5. Tecnologías y Herramientas

### 5.a. Backend

**Django 4.2.9 (LTS)**

Framework web de alto nivel escrito en Python. Se eligió la versión LTS (Long Term Support) para garantizar estabilidad y mantenimiento durante el ciclo de vida del proyecto. Django proporciona un ORM (Object-Relational Mapper) potente, un sistema de migraciones de base de datos, un panel de administración automático y protecciones de seguridad integradas (CSRF, SQL injection, XSS, Clickjacking).

**Django REST Framework (DRF) 3.15.1**

Biblioteca sobre Django que facilita la construcción de APIs Web siguiendo el estilo arquitectónico REST. Proporciona:
- Serializadores para transformar modelos Django en JSON y viceversa, con validación integrada.
- Vistas genéricas (GenericAPIView, ModelViewSet) que reducen drásticamente el código repetitivo.
- Sistema de permisos (IsAuthenticated, IsAdminUser, permisos personalizados).
- Sistema de renderers y parsers para distintos formatos de respuesta.
- Paginación configurable (PageNumberPagination).
- Filtrado con django-filter.

**djangorestframework-simplejwt 5.3.1**

Implementación de autenticación JWT para DRF. Genera pares de tokens access/refresh firmados con HMAC-SHA256. El token de acceso tiene vida corta (por defecto 5 minutos, configurado a 60 minutos en este proyecto) y el de refresco dura 7 días. El frontend intercambia el refresh token por un nuevo access token cuando este expira.

**django-cors-headers 4.3.1**

Middleware que gestiona las cabeceras CORS (Cross-Origin Resource Sharing), permitiendo que el frontend (servido desde `localhost:5173` en desarrollo) realice peticiones a la API (en `localhost:8000`) sin que el navegador las bloquee por política de mismo origen.

**django-filter 23.5**

Biblioteca que integra capacidades de filtrado avanzado con DRF. Permite declarar filtros de forma declarativa en FilterSet classes, soportando filtros por igualdad, rango, búsqueda de texto (icontains), filtros booleanos, etc. Stuguether lo utiliza para el motor de búsqueda de propiedades.

**psycopg2-binary 2.9.9**

Adaptador de PostgreSQL para Python. Permite a Django comunicarse con la base de datos PostgreSQL. Se usa la versión `binary` por facilidad de instalación (incluye los binarios compilados de libpq).

**Pillow 10.2.0**

Biblioteca de procesamiento de imágenes para Python. Utilizada por Django para gestionar los campos `ImageField` del modelo (validación del formato de imagen, redimensionado si se configura). En Stuguether gestiona las imágenes de propiedades y los avatares de usuarios.

**python-decouple 3.8**

Biblioteca para separar la configuración del código fuente. Lee variables de un archivo `.env` y las expone como variables de configuración tipadas, siguiendo el principio de los Twelve-Factor Apps. Permite tener distintas configuraciones para desarrollo, staging y producción sin modificar el código.

**drf-spectacular 0.27.1**

Generador automático de documentación OpenAPI 3.0 para DRF. Inspecciona los serializers, vistas y URLs de la API para generar un esquema OpenAPI completo que puede visualizarse con Swagger UI o Redoc. Facilita el trabajo colaborativo y el consumo de la API desde el frontend.

**PostgreSQL 15**

Sistema de gestión de base de datos relacional objeto (ORDBMS) de código abierto. Elegido por:
- Soporte nativo de tipos JSON (útil para el campo `habits` de `StudentProfile`).
- Mejor rendimiento que SQLite para cargas de trabajo concurrentes.
- Soporte para índices avanzados (GIN para búsqueda full-text, GiST para datos geoespaciales en caso de extensión PostGIS futura).
- Amplio soporte en plataformas cloud (Heroku, AWS RDS, Supabase, Render).

### 5.b. Frontend

**React 19.2.4**

Biblioteca JavaScript para construcción de interfaces de usuario mediante componentes reutilizables y árbol de estado virtual (Virtual DOM). La versión 19 introduce mejoras en el compilador automático y en el manejo de estados concurrentes. Se utiliza con JSX (sintaxis que permite escribir HTML dentro de JavaScript).

**Vite 8.0.1**

Herramienta de build y servidor de desarrollo de nueva generación. A diferencia de webpack, Vite sirve los módulos ES de forma nativa en desarrollo (sin bundling), lo que resulta en tiempos de arranque casi instantáneos. Para producción genera un bundle optimizado con tree-shaking y code splitting automático.

**React Router DOM 7.13.2**

Biblioteca de enrutamiento para aplicaciones React de página única (SPA). Permite definir rutas declarativas, rutas anidadas (layouts compartidos como el Dashboard), rutas protegidas (redirigir al login si no autenticado), y acceso a parámetros de URL (`useParams`, `useSearchParams`).

**TanStack React Query 5.95.2**

Biblioteca de gestión del estado del servidor (server state management). Gestiona el ciclo de vida completo de las peticiones a la API: caché inteligente con stale-while-revalidate, refetch automático en segundo plano, estados de carga/error/éxito, mutaciones optimistas e invalidación de queries. Elimina la necesidad de gestores de estado global para la mayoría de los datos que provienen del servidor.

**Axios 1.13.6**

Cliente HTTP para JavaScript. Se utiliza para realizar las peticiones a la API REST del backend. Configurado con una instancia base (`api/client.js`) que incluye la URL base, interceptores para inyectar el token JWT en la cabecera `Authorization` de cada petición y para manejar la renovación automática del token.

**React Hook Form 7.72.0 + Zod 4.3.6**

React Hook Form es la biblioteca de gestión de formularios más eficiente para React (minimiza re-renders). Zod es una biblioteca de validación y parsing de esquemas con TypeScript-first. Se combinan mediante `@hookform/resolvers` para validar formularios en el cliente antes de enviarlos al servidor, mejorando la experiencia de usuario con errores inmediatos y legibles.

**React Leaflet 5.0.0 + Leaflet 1.9.4**

Integración de la biblioteca de mapas Leaflet con React. Se utiliza en la página de detalle de propiedades para mostrar la ubicación en un mapa interactivo con marcadores. Leaflet usa tiles de OpenStreetMap, que son gratuitos y no requieren API key.

**date-fns 4.1.0**

Biblioteca utilitaria para manipulación y formateo de fechas en JavaScript. Se usa en el módulo de reservas para calcular diferencias entre fechas, formatear fechas en formato español, etc.

### 5.c. Herramientas de desarrollo

**Git + GitHub**

Control de versiones distribuido. El repositorio principal está alojado en GitHub. Se sigue una estrategia de ramas simplificada (main/feature branches) adecuada para el trabajo individual.

**VS Code**

Editor de código fuente con soporte para Python, JavaScript/JSX, extensiones de linting (ESLint, Pylint) y depuración integrada.

**Postman**

Cliente HTTP gráfico para prueba manual de los endpoints de la API durante el desarrollo. Permite crear colecciones de peticiones con variables de entorno.

**pgAdmin 4**

Cliente gráfico para administrar la base de datos PostgreSQL. Permite visualizar tablas, ejecutar queries SQL y monitorizar el esquema de la base de datos.

**Python Virtual Environment (venv)**

Entorno virtual de Python para aislar las dependencias del proyecto del sistema operativo. Cada proyecto tiene su propio entorno con las versiones exactas de cada paquete especificadas en `requirements.txt`.

---

\newpage

## 6. Viabilidad, Recursos y Presupuesto del Proyecto

### 6.a. Estudio de viabilidad técnica

El proyecto Stuguether es técnicamente viable dentro del marco temporal disponible (un curso académico), basándose en los siguientes factores:

**Tecnologías consolidadas:** Todos los componentes del stack (Django, React, PostgreSQL) son tecnologías maduras con amplia documentación, comunidad activa y ejemplos de proyectos similares (marketplaces, plataformas de alquiler). La curva de aprendizaje, aunque significativa para un desarrollador en formación, es abordable dada la calidad de la documentación oficial.

**Arquitectura modular:** La separación entre backend (API REST) y frontend (SPA) facilita el desarrollo incremental. Si una parte presenta problemas técnicos, la otra puede continuar avanzando independientemente.

**Infraestructura disponible:** Durante el desarrollo se utiliza infraestructura local (equipo personal, servidor de desarrollo integrado). Para el despliegue en producción, plataformas como Render, Railway o Heroku ofrecen planes gratuitos o de bajo coste que son suficientes para una fase de pruebas.

**Alcance controlado:** El proyecto no pretende competir directamente con plataformas establecidas en términos de funcionalidad completa. Se prioriza un subconjunto de funcionalidades bien implementadas sobre una cobertura superficial de todo el espacio de requisitos.

### 6.b. Recursos materiales y personales

**Recursos materiales:**

| Recurso | Descripción |
|---------|-------------|
| Ordenador portátil | Windows 11, 16GB RAM, procesador Intel Core i7 |
| Conexión a Internet | Para consulta de documentación, paquetes npm/pip y acceso a GitHub |
| Servidor de desarrollo | localhost (Django devserver en :8000, Vite devserver en :5173) |
| Base de datos | PostgreSQL 15 instalado localmente |

**Software (coste cero):**

| Software | Licencia |
|----------|---------|
| Python 3.11 | PSF License (gratuita) |
| Node.js 20 LTS | MIT License (gratuita) |
| PostgreSQL 15 | PostgreSQL License (gratuita) |
| VS Code | MIT License (gratuita) |
| Git | GPL v2 (gratuita) |
| Postman | Freemium (plan gratuito suficiente) |
| pgAdmin 4 | PostgreSQL License (gratuita) |

**Recursos personales:**

- 1 desarrollador full-stack (autor del proyecto): responsable de análisis, diseño, implementación, pruebas y documentación.
- Tutor académico: revisiones periódicas y orientación metodológica.

### 6.c. Presupuesto económico del proyecto

Considerando un escenario de desarrollo profesional (no académico), el coste estimado del proyecto sería:

**Coste de desarrollo:**

| Concepto | Horas | Coste/hora (€) | Total (€) |
|----------|-------|----------------|-----------|
| Análisis y diseño | 40 | 35 | 1.400 |
| Desarrollo backend | 120 | 35 | 4.200 |
| Desarrollo frontend | 100 | 35 | 3.500 |
| Pruebas y QA | 30 | 25 | 750 |
| Documentación | 40 | 20 | 800 |
| **TOTAL** | **330** | | **10.650** |

**Coste de infraestructura (año 1, producción):**

| Concepto | Coste mensual (€) | Coste anual (€) |
|----------|-------------------|-----------------|
| Servidor backend (Render/Railway) | 7 | 84 |
| Base de datos PostgreSQL managed | 15 | 180 |
| Almacenamiento objetos (S3/Cloudinary) | 5 | 60 |
| Dominio .com | - | 12 |
| **TOTAL infraestructura** | | **336** |

**Coste total estimado del proyecto (año 1):** ~10.986 €

Este presupuesto es razonable para una startup en fase de validación (MVP). El punto de equilibrio financiero se alcanzaría con aproximadamente 1.570 reservas gestionadas (a una comisión media de 7 € por reserva), un volumen perfectamente alcanzable en una ciudad universitaria de tamaño medio.

### 6.d. Necesidades de financiación

Para la fase de desarrollo (MVP), el proyecto no requiere financiación externa, ya que se realiza como proyecto académico con recursos propios. Para una hipotética puesta en producción y escalado, las opciones de financiación serían:

- **Bootstrapping:** Financiación propia mientras se generan los primeros ingresos por comisiones.
- **Kit Digital:** Subvención de hasta 12.000€ del programa gubernamental para digitalización de pymes, que podría cubrir el desarrollo del MVP si se constituye empresa.
- **FFF (Family, Friends and Fools):** Ronda semilla informal de 10.000-30.000€ para el primer año de operación.
- **Business Angels:** Para una segunda fase de crecimiento, con ticket medio de 50.000-100.000€ a cambio de participación accionarial.

---

\newpage

## 7. Planificación, Diagnóstico y Contexto Laboral

### 7.a. Planificación temporal

El proyecto se ha desarrollado a lo largo del curso académico 2025-2026, con las siguientes fases y duraciones reales:

```
DIAGRAMA DE GANTT — PROYECTO STUGUETHER

Fase                          Oct  Nov  Dic  Ene  Feb  Mar  Abr
─────────────────────────────────────────────────────────────────
1. Planificación              ████
2. Análisis de requisitos          ████
3. Diseño (BD + API + UI)               ████
4a. Impl. Autenticación                      ████
4b. Impl. Propiedades                            ████
4c. Impl. Búsqueda/Filtros                       ████
4d. Impl. Mensajería                                  ████
4e. Impl. Reservas                                    ████
4f. Impl. Favoritos/Perfiles                               ████
5. Pruebas y validación                                        ████
6. Documentación                                               ████
```

**Hitos principales:**
- **Octubre 2025:** Propuesta de proyecto aprobada y repositorio Git creado.
- **Noviembre 2025:** Entrega de primera versión de la memoria (análisis y diseño).
- **Enero 2026:** API REST funcional con autenticación, propiedades y búsqueda.
- **Febrero 2026:** Frontend con búsqueda, detalle de propiedad y autenticación.
- **Marzo 2026:** Entrega segunda versión (primera versión funcional del sistema).
- **Abril 2026:** Sistema completo con mensajería, reservas, favoritos y perfiles.
- **Mayo 2026 (4 de mayo):** Entrega definitiva de memoria y código.

### 7.b. Análisis DAFO

**Debilidades (internas, negativas):**

- Proyecto desarrollado por un único programador, lo que limita la velocidad de desarrollo y aumenta el riesgo de sesgos en las decisiones de diseño.
- Ausencia de pruebas automatizadas (tests unitarios y de integración) por limitaciones de tiempo, lo que reduce la robustez del código ante cambios futuros.
- Sin presencia de usuarios reales durante el desarrollo, los requisitos son hipotéticos y pueden no ajustarse perfectamente a las necesidades reales.
- Funcionalidades de pago real no implementadas (el sistema de escrow es simulado lógicamente pero no conectado a una pasarela de pago real como Stripe).

**Amenazas (externas, negativas):**

- Mercado con actores consolidados (Badi, Spotahome) que cuentan con recursos, marca y base de usuarios establecidas.
- Cambios regulatorios en el mercado de alquiler (Ley de Vivienda 2023 y sus modificaciones) que podrían alterar el modelo de negocio.
- Dependencia de plataformas de hosting de terceros (posible cambio de precios o cierre del proveedor).
- Riesgo de scraping o copia del modelo por competidores con más recursos.

**Fortalezas (internas, positivas):**

- Nicho muy específico y bien definido, con una propuesta de valor diferenciadora (perfiles de convivencia + filtro por universidad).
- Stack tecnológico moderno, escalable y con gran demanda en el mercado laboral.
- API REST documentada con OpenAPI, lo que facilita la integración futura con aplicaciones móviles u otros clientes.
- Código organizado en aplicaciones Django independientes, facilitando el mantenimiento y la escalabilidad.
- Coste de operación inicial muy bajo (infraestructura cloud serverless o de bajo coste).

**Oportunidades (externas, positivas):**

- Crecimiento constante de la población universitaria española y aumento de la movilidad interautonómica de estudiantes.
- Tendencia creciente hacia plataformas digitales de intermediación (marketplace economy).
- Posibilidad de expansión a otros países hispanohablantes con mercados universitarios similares (México, Colombia, Argentina).
- Integración futura con sistemas universitarios (verificación de matrícula automática via API de la universidad).
- Posibilidad de añadir funcionalidad de matching de compañeros de piso como servicio premium.

---

\newpage

## 8. Análisis

### 8.a. Requisitos Funcionales (RF)

**RF-01 — Registro de usuarios**
El sistema permitirá a cualquier visitante crear una cuenta con correo electrónico, contraseña, nombre, apellidos y rol (estudiante o propietario). Al registrarse, se enviará un correo de verificación al email proporcionado.

**RF-02 — Verificación de correo electrónico**
El acceso al panel de usuario estará bloqueado hasta que el usuario haga clic en el enlace de verificación enviado por email. El enlace contendrá un token UUID único con validez de 24 horas.

**RF-03 — Autenticación JWT**
El sistema utilizará JWT para autenticar las peticiones API. Se emitirán dos tokens: access (corta duración) y refresh (larga duración). El frontend renovará automáticamente el access token usando el refresh token.

**RF-04 — Roles y permisos**
El sistema gestionará tres roles: STUDENT (estudiante), OWNER (propietario), ADMIN (administrador). Cada rol tendrá acceso diferenciado a las funcionalidades de la plataforma.

**RF-05 — Gestión de perfil de usuario**
Los usuarios podrán editar su perfil: avatar, teléfono, bio, y campos específicos del rol (universidad, titulación, hábitos de convivencia para estudiantes; empresa y documentación para propietarios).

**RF-06 — Publicación de propiedades**
Los usuarios con rol OWNER podrán crear, editar y eliminar anuncios de propiedades. Cada anuncio incluirá: título, descripción, dirección, ciudad, tipo (habitación/piso entero/estudio), precio mensual, fianza, superficie, número de compañeros, baños, amenidades y fotos.

**RF-07 — Búsqueda y filtrado de propiedades**
Los visitantes y usuarios autenticados podrán buscar propiedades aplicando filtros por: ciudad, tipo de inmueble, precio mínimo/máximo, número de compañeros, amenidades (WiFi, gastos incluidos, amueblado, etc.) y universidad próxima.

**RF-08 — Detalle de propiedad**
Cada propiedad tendrá una página de detalle con galería de imágenes, mapa de ubicación, información completa, amenidades, universidades próximas con distancia estimada y reseñas de inquilinos anteriores.

**RF-09 — Sistema de favoritos**
Los estudiantes autenticados podrán guardar propiedades en su lista de favoritos y acceder a ella desde el panel personal.

**RF-10 — Sistema de mensajería**
Los estudiantes podrán iniciar una conversación con el propietario de una propiedad. El sistema garantizará que solo existe una conversación por par de usuarios por propiedad. Los mensajes se ordenarán cronológicamente y se indicarán los mensajes no leídos.

**RF-11 — Filtro de lenguaje inapropiado**
El sistema detectará y rechazará mensajes que contengan lenguaje inapropiado o insultos en español, informando al usuario del motivo del rechazo sin revelar la lista de palabras filtradas.

**RF-12 — Sistema de reservas**
Los estudiantes podrán solicitar una reserva para una propiedad especificando las fechas de entrada y salida. El sistema calculará automáticamente el precio total (precio mensual × meses + fianza + comisión del 7%). El propietario podrá aceptar o rechazar la solicitud; si es aceptada, el estudiante la confirma.

**RF-13 — Flujo de estados de reserva**
Las reservas seguirán el flujo: PENDING → ACCEPTED (por propietario) → CONFIRMED (por estudiante) → COMPLETED/CANCELLED.

**RF-14 — Perfiles públicos de usuario**
Cualquier usuario autenticado podrá ver el perfil público de otro usuario (nombre, avatar, universidad, hábitos de convivencia, valoración media).

**RF-15 — Panel de administración**
Los usuarios con rol ADMIN tendrán acceso al panel de administración de Django, desde donde podrán gestionar todos los modelos, verificar propiedades, moderar reseñas y gestionar documentación de usuarios.

### 8.b. Requisitos No Funcionales (RNF)

**RNF-01 — Seguridad:** Las contraseñas se almacenarán cifradas con PBKDF2-SHA256. Las comunicaciones entre cliente y servidor usarán HTTPS en producción. Los secretos (credenciales de base de datos, claves API) se gestionarán mediante variables de entorno, nunca en el código fuente.

**RNF-02 — Disponibilidad:** En producción, el objetivo es una disponibilidad del 99% (menos de 87 horas de inactividad al año), alcanzable con plataformas PaaS modernas.

**RNF-03 — Rendimiento:** Las páginas de listado de propiedades deberán cargar en menos de 2 segundos en condiciones normales. La API deberá responder en menos de 500ms para el 95% de las peticiones.

**RNF-04 — Escalabilidad:** La arquitectura sin estado (stateless) del backend con JWT permite escalar horizontalmente añadiendo instancias adicionales detrás de un balanceador de carga sin modificaciones de código.

**RNF-05 — Mantenibilidad:** El código seguirá convenciones estándar (PEP8 para Python, ESLint para JavaScript). Las aplicaciones Django están organizadas por dominio funcional (users, properties, messages_app, reservations, reviews), facilitando el mantenimiento independiente de cada módulo.

**RNF-06 — Portabilidad:** La aplicación es independiente del sistema operativo gracias al uso de Python y Node.js, y del sistema de virtualización (venv + node_modules). El archivo `requirements.txt` y `package.json` garantizan la reproducibilidad del entorno.

**RNF-07 — Usabilidad:** La interfaz de usuario seguirá principios de diseño minimalista con alto contraste, tipografía legible y estructura visual jerárquica clara. Será completamente usable en dispositivos de escritorio y adaptada para pantallas móviles (diseño responsive).

**RNF-08 — Internacionalización:** La aplicación está desarrollada íntegramente en español, orientada al mercado español. La arquitectura permite añadir soporte multiidioma (i18n) en el futuro sin cambios estructurales.

### 8.c. Arquitectura del sistema

Stuguether sigue una arquitectura de **dos capas desacopladas** comunicadas mediante API REST:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│                                                          │
│  React 19 SPA (Vite)                                    │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │  React   │  │   React     │  │    TanStack      │  │
│  │  Router  │  │  Hook Form  │  │   React Query    │  │
│  └──────────┘  └─────────────┘  └──────────────────┘  │
│                      │                                   │
│              Axios (HTTP Client)                         │
│              Authorization: Bearer <JWT>                 │
└─────────────────────────────┬───────────────────────────┘
                              │ HTTPS / REST API
                              │ JSON payload
┌─────────────────────────────▼───────────────────────────┐
│                    SERVIDOR (Backend)                    │
│                                                          │
│  Django 4.2 + DRF 3.15                                 │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   users    │  │  properties  │  │ messages_app   │  │
│  │    app     │  │     app      │  │     app        │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
│  ┌────────────┐  ┌──────────────┐                       │
│  │reservations│  │   reviews    │                       │
│  │    app     │  │     app      │                       │
│  └────────────┘  └──────────────┘                       │
│                      │                                   │
│              Django ORM (psycopg2)                      │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                  BASE DE DATOS                           │
│               PostgreSQL 15                              │
│                                                          │
│   users │ properties │ messages │ reservations │ media  │
└─────────────────────────────────────────────────────────┘
```

### 8.d. Modelo Entidad-Relación

Las entidades principales del sistema y sus relaciones son:

**CustomUser** — Entidad central del sistema.
- Campos: email (PK), username, first_name, last_name, role, avatar, phone, bio, is_verified, created_at.
- Relaciones: 1:1 con StudentProfile o OwnerProfile (según rol), 1:N con Property (como owner), 1:N con Favorite, 1:N con Message (como sender), M:N con Conversation (como participant).

**StudentProfile** — Perfil extendido del estudiante.
- Campos: university, degree, enrollment_doc, iban, enrollment_verified, age, course, city, roommate_bio, habits (JSON array).

**OwnerProfile** — Perfil extendido del propietario.
- Campos: company_name, property_title_doc, identity_doc, identity_verified, member_since.

**EmailVerificationToken** — Token de verificación de email.
- Campos: token (UUID), created_at.
- Relación: 1:1 con CustomUser (se elimina tras verificación exitosa).

**Property** — Entidad de anuncio de propiedad.
- Campos: title, description, address, city, neighborhood, lat, lng, property_type, price_month, deposit, room_m2, total_m2, companions, bathrooms, floor, elevator, pets_allowed, gender_pref, is_verified, is_active, is_featured, created_at.
- Relaciones: N:1 con CustomUser (owner), 1:N con PropertyImage, 1:N con PropertyAmenity, M:N con University (a través de PropertyUniversity que añade minutes_walk).

**Conversation** — Hilo de mensajes entre dos usuarios.
- Relaciones: M:N con CustomUser (participants), N:1 con Property (related_property), 1:N con Message.

**Message** — Mensaje individual en una conversación.
- Campos: body, is_read, created_at.
- Relaciones: N:1 con Conversation, N:1 con CustomUser (sender).

**Reservation** — Solicitud de reserva de una propiedad.
- Campos: start_date, end_date, months, monthly_price, deposit, service_fee (7%), total, status, payment_status, notes.
- Relaciones: N:1 con CustomUser (student), N:1 con Property.

**Favorite** — Relación de guardado de propiedad por usuario.
- Relaciones: N:1 con CustomUser, N:1 con Property. Restricción única (user, property).

### 8.e. Endpoints de la API REST

La API REST de Stuguether está organizada bajo el prefijo `/api/v1/` y documenta automáticamente todos sus endpoints mediante drf-spectacular en `/api/schema/swagger-ui/`.

**Autenticación (`/api/v1/auth/`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register/` | Registro de nuevo usuario | No |
| POST | `/auth/login/` | Login con email/password → JWT | No |
| POST | `/auth/token/refresh/` | Renovar access token | No |
| GET | `/auth/verify-email/` | Verificar email con token UUID | No |
| POST | `/auth/resend-verification/` | Reenviar email de verificación | No |
| GET | `/auth/me/` | Datos del usuario autenticado | Sí |
| PATCH | `/auth/me/` | Actualizar perfil propio | Sí |
| GET | `/auth/users/<id>/` | Perfil público de un usuario | Sí |

**Propiedades (`/api/v1/properties/`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/properties/` | Listar propiedades (con filtros) | No |
| POST | `/properties/` | Crear nueva propiedad | OWNER |
| GET | `/properties/<id>/` | Detalle de propiedad | No |
| PUT/PATCH | `/properties/<id>/` | Editar propiedad | OWNER (propia) |
| DELETE | `/properties/<id>/` | Eliminar propiedad | OWNER (propia) |
| GET | `/properties/favorites/` | Lista de favoritos del usuario | STUDENT |
| POST | `/properties/<id>/favorite/` | Añadir a favoritos | STUDENT |
| DELETE | `/properties/<id>/favorite/` | Quitar de favoritos | STUDENT |
| GET | `/universities/` | Listar universidades | No |

**Mensajería (`/api/v1/messages/`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/conversations/` | Listar conversaciones del usuario | Sí |
| POST | `/conversations/` | Crear conversación | Sí |
| GET | `/conversations/<id>/messages/` | Listar mensajes de una conv. | Sí |
| POST | `/conversations/<id>/messages/` | Enviar mensaje | Sí |

**Reservas (`/api/v1/reservations/`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/reservations/` | Listar reservas del usuario | Sí |
| POST | `/reservations/` | Crear solicitud de reserva | STUDENT |
| GET | `/reservations/<id>/` | Detalle de reserva | Sí |
| POST | `/reservations/<id>/accept/` | Propietario acepta reserva | OWNER |
| POST | `/reservations/<id>/confirm/` | Estudiante confirma reserva | STUDENT |
| POST | `/reservations/<id>/cancel/` | Cancelar reserva | Sí |

### 8.f. Diagrama de flujo — Proceso de registro y verificación

```
     [Usuario]
        │
        ▼
  Rellena formulario
  de registro (email,
  contraseña, nombre,
  rol)
        │
        ▼
  Frontend valida
  con Zod (client-side)
        │ OK
        ▼
  POST /auth/register/
        │
        ▼
  Backend crea CustomUser
  (is_verified=False)
        │
        ▼
  Genera EmailVerification
  Token (UUID)
        │
        ▼
  Envía email con enlace
  /verificar-email?token=UUID
        │
        ▼
  Responde {detail: "Email enviado"}
  (sin JWT aún)
        │
        ▼
  Frontend redirige a
  /verificar-email
  (pantalla "revisa tu correo")
        │
        ▼
  [Usuario hace clic en el
   enlace del email]
        │
        ▼
  GET /auth/verify-email/?token=UUID
        │
        ├── Token inválido ──▶ Error 400
        ├── Token expirado ──▶ Error 400 (>24h)
        │
        ▼ Token válido
  Backend:
  - user.is_verified = True
  - Elimina EmailVerificationToken
  - Genera par JWT (access+refresh)
        │
        ▼
  Devuelve {access, refresh, user}
        │
        ▼
  Frontend:
  - Guarda tokens en localStorage
  - Actualiza AuthContext
  - Redirige a /panel
```

### 8.g. Diagrama de flujo — Proceso de reserva

```
  [Estudiante]
       │
       ▼
  Ve propiedad y hace clic
  en "Solicitar reserva"
       │
       ▼
  Selecciona fechas de
  entrada y salida
       │
       ▼
  Sistema calcula:
  - Meses = diferencia de fechas
  - Subtotal = precio × meses
  - Comisión = subtotal × 7%
  - Total = subtotal + fianza + comisión
       │
       ▼
  POST /reservations/
  status = PENDING
       │
       ▼
  [Propietario recibe
   notificación en panel]
       │
    ┌──┴──┐
  Acepta    Rechaza
    │          │
    ▼          ▼
  POST      status=CANCELLED
  /accept/
  status=ACCEPTED
    │
    ▼
  [Estudiante confirma
   en su panel]
    │
    ▼
  POST /confirm/
  status=CONFIRMED
  payment_status=ESCROW
    │
    ▼
  [Periodo de alquiler]
    │
    ▼
  status=COMPLETED
  payment_status=RELEASED
```

---

\newpage

## 9. Diseño

### 9.a. Descripción de la arquitectura del sistema

**Arquitectura backend — Aplicaciones Django**

El backend de Stuguether sigue la arquitectura de aplicaciones modulares de Django. El proyecto (`config/`) contiene la configuración global, y cada dominio funcional es una aplicación independiente:

```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py        # Configuración común
│   │   ├── dev.py         # Configuración de desarrollo
│   │   └── prod.py        # Configuración de producción
│   ├── urls.py            # Enrutador principal
│   └── wsgi.py
├── apps/
│   ├── users/             # Autenticación, perfiles, documentos
│   ├── properties/        # Propiedades, imágenes, amenidades, favoritos
│   ├── messages_app/      # Conversaciones y mensajes
│   ├── reservations/      # Reservas y estados
│   └── reviews/           # Reseñas de propiedades
├── media/                 # Archivos subidos por usuarios
├── requirements.txt
└── .env                   # Variables de entorno (no en Git)
```

Cada aplicación sigue la estructura estándar de Django:
- `models.py` — Definición del modelo de datos (clases Python → tablas SQL).
- `serializers.py` — Transformación entre modelos Django y JSON (validación incluida).
- `views.py` — Lógica de negocio y respuestas HTTP.
- `urls.py` — Mapeo de URLs a vistas.
- `permissions.py` — Permisos personalizados (IsOwner, IsStudent, etc.).
- `filters.py` — Clases de filtrado con django-filter.
- `admin.py` — Registro en el panel de administración de Django.
- `migrations/` — Historial de cambios en el esquema de la BD.

**Arquitectura frontend — Estructura de páginas y componentes**

```
frontend/src/
├── api/                   # Funciones de llamada a la API (axios)
│   ├── auth.js
│   ├── properties.js
│   ├── messages.js
│   ├── reservations.js
│   └── users.js
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx     # Barra de navegación (sticky)
│   │   └── Footer.jsx
│   ├── features/
│   │   └── PropertyCard.jsx  # Tarjeta de propiedad en listados
│   └── ui/
│       ├── Button.jsx     # Botón reutilizable con variantes
│       ├── Spinner.jsx    # Indicador de carga
│       └── Input.jsx
├── contexts/
│   └── AuthContext.jsx    # Estado global de autenticación
├── pages/
│   ├── Home/              # Página de inicio
│   ├── Search/            # Búsqueda y listado de propiedades
│   ├── Property/          # Detalle de propiedad
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── VerifyEmail.jsx
│   ├── Dashboard/         # Panel de usuario (layout compartido)
│   │   ├── index.jsx      # Layout del panel con navegación lateral
│   │   └── Student/
│   │       ├── Reservations.jsx
│   │       ├── Favorites.jsx
│   │       ├── Messages.jsx
│   │       └── Profile.jsx
│   └── Profile/           # Perfil público de usuario
├── App.jsx                # Definición de rutas
└── main.jsx               # Punto de entrada
```

### 9.b. Justificación de decisiones de diseño

**Separación strict backend/frontend**

La decisión de construir el backend como una API REST pura (sin renderizado de plantillas HTML) y el frontend como una SPA independiente tiene varias ventajas:
- Reutilización del backend para futuras aplicaciones móviles (iOS, Android mediante React Native).
- Equipos de backend y frontend pueden trabajar en paralelo con la API como contrato.
- El frontend puede desplegarse en una CDN (red de distribución de contenido), mejorando el rendimiento de carga inicial.

La contrapartida es una mayor complejidad inicial (CORS, autenticación stateless) que se justifica por la escalabilidad a largo plazo.

**JWT en localStorage vs. cookies HttpOnly**

Se optó por almacenar el JWT en `localStorage` por simplicidad de implementación. En producción, la práctica de seguridad recomendada es usar cookies `HttpOnly` para el refresh token (protección contra XSS) y el access token en memoria. Esta mejora está documentada como vía futura.

**React Query para estado del servidor**

En lugar de usar Redux o Zustand para gestionar el estado global, se delegó toda la sincronización con el servidor a React Query. Esto simplifica enormemente el código: no hay actions, reducers ni stores para datos remotos. Solo `useQuery` para lectura y `useMutation` para escritura, con invalidación automática de caché.

**CSS variables inline sin framework**

La decisión de no usar Tailwind CSS ni Material UI responde a:
- Control total sobre el aspecto visual sin depender de clases predefinidas que dificultan el diseño personalizado.
- Sin sobrecarga de CSS no utilizado (tree-shaking de estilos).
- Aprendizaje de CSS puro, sin abstracciones que oculten la implementación real.
Las variables CSS globales (`:root`) garantizan consistencia en colores, radios y sombras.

**Verificación de email obligatoria antes del JWT**

Diseño deliberado: el endpoint de registro no devuelve JWT. Solo el endpoint de verificación, tras validar el token UUID, emite el par de tokens. Esto garantiza que todos los usuarios en la base de datos tienen un email real y válido, reduciendo el spam y mejorando la calidad de los datos.

### 9.c. Descripción de componentes clave

**AuthContext (frontend/src/contexts/AuthContext.jsx)**

Provee el estado de autenticación a toda la aplicación mediante el patrón Context de React. Almacena el objeto `user` (datos del usuario autenticado) y los booleanos `isAuthenticated` y `isLoading`. Expone las funciones `login()`, `logout()` y `loginWithTokens()` (usada tras la verificación de email). En el arranque, verifica si existe un token en localStorage y lo valida llamando a `/auth/me/`.

**PropertyCard (frontend/src/components/features/PropertyCard.jsx)**

Componente de tarjeta de propiedad usado en el listado de búsqueda. Gestiona su propio estado de favorito (`fav`, `pending`, `justSaved`) de forma local con optimistic update: el corazón cambia de color inmediatamente al hacer clic, sin esperar la respuesta del servidor, y se revierte si hay error. Muestra un banner animado "Guardado en favoritos → Ver favoritos" durante 4 segundos tras guardar.

**ConversationList + ChatArea (frontend/src/pages/Dashboard/Student/Messages.jsx)**

Interfaz de mensajería de dos paneles. El panel izquierdo lista las conversaciones (con nombre del otro participante, último mensaje y contador de no leídos) y se actualiza automáticamente cada 10 segundos. El panel derecho muestra los mensajes de la conversación activa con diferenciación visual (mensajes propios a la derecha en azul, ajenos a la izquierda en gris claro) y se actualiza cada 5 segundos. El scroll automático lleva al último mensaje al recibir nuevos mensajes.

**Profanity Filter (backend/apps/messages_app/serializers.py)**

Implementación de filtro de lenguaje inapropiado en el serializer de mensajes. Normaliza el texto eliminando tildes y diacríticos mediante `unicodedata.normalize('NFD')`, convierte a minúsculas y aplica una expresión regular con límites de palabra (`\b`) para detectar coincidencias exactas o con variantes acentuadas. La lista incluye más de 20 palabras malsonantes comunes en español.

**ReservationCalculator (backend/apps/reservations/models.py)**

El modelo `Reservation` sobreescribe el método `save()` para calcular automáticamente `service_fee` (7% del subtotal) y `total` (subtotal + fianza + comisión) cada vez que se guarda una reserva, garantizando la consistencia de los datos financieros independientemente de cómo se actualice el registro.

### 9.d. Sistema de variables de diseño

El sistema de diseño visual se implementa mediante variables CSS en el elemento `:root` del fichero `index.css`:

```css
:root {
  --blue:        #2563EB;   /* Color primario (botones, links, íconos activos) */
  --blue-dark:   #1E40AF;   /* Variante oscura del azul */
  --blue-light:  #EFF6FF;   /* Fondo de elementos activos/seleccionados */
  --white:       #FFFFFF;
  --bg:          #F8FAFC;   /* Fondo general de la página */
  --border:      #E2E8F0;   /* Color de bordes */
  --muted:       #64748B;   /* Texto secundario */
  --text:        #0F172A;   /* Texto principal */
  --shadow:      0 1px 3px rgba(0,0,0,0.08);
  --shadow-lg:   0 4px 12px rgba(0,0,0,0.12);
  --radius:      12px;      /* Radio de borde estándar */
  --green:       #16A34A;
  --green-bg:    #F0FDF4;
  --red:         #DC2626;
  --red-bg:      #FEF2F2;
}
```

---

\newpage

## 10. Pruebas y Validación

### 10.a. Entorno de pruebas

Las pruebas se han realizado en el siguiente entorno:

| Componente | Configuración |
|-----------|---------------|
| Sistema operativo | Windows 11 Home 10.0.26200 |
| Navegador principal | Google Chrome 124 |
| Servidor backend | Django devserver (localhost:8000) |
| Servidor frontend | Vite devserver (localhost:5173) |
| Base de datos | PostgreSQL 15 local |
| Email | Django console backend (emails en terminal) |
| Herramienta de pruebas API | Postman 11 |

### 10.b. Plan de pruebas — Módulo de autenticación

| ID | Caso de prueba | Datos de entrada | Resultado esperado | Resultado obtenido |
|----|---------------|-----------------|-------------------|-------------------|
| PT-01 | Registro con email válido | email, password, nombre | Email de verificación enviado, sin JWT | ✅ Correcto |
| PT-02 | Registro con email duplicado | email existente | Error 400 "email ya registrado" | ✅ Correcto |
| PT-03 | Verificación con token válido | token UUID correcto | JWT emitido, user.is_verified=True | ✅ Correcto |
| PT-04 | Verificación con token expirado | token >24h | Error 400 "token expirado" | ✅ Correcto |
| PT-05 | Login sin verificar email | email verificado=False | Error 400 "email no verificado" | ✅ Correcto |
| PT-06 | Login correcto | email + password correctos | JWT access + refresh | ✅ Correcto |
| PT-07 | Acceso a /api/me sin token | Sin cabecera Authorization | Error 401 Unauthorized | ✅ Correcto |
| PT-08 | Acceso con token expirado | Token vencido | Error 401, frontend renueva con refresh | ✅ Correcto |

### 10.c. Plan de pruebas — Módulo de propiedades

| ID | Caso de prueba | Resultado obtenido |
|----|---------------|-------------------|
| PT-09 | Crear propiedad como OWNER | ✅ Propiedad creada con imágenes |
| PT-10 | Intentar crear propiedad como STUDENT | ✅ Error 403 Forbidden |
| PT-11 | Buscar por ciudad (GET /properties/?city=Madrid) | ✅ Resultados filtrados correctamente |
| PT-12 | Filtrar por precio máximo | ✅ Solo propiedades ≤ precio indicado |
| PT-13 | Filtrar por amenidad WiFi | ✅ Solo propiedades con WIFI |
| PT-14 | Paginación (page=2) | ✅ Segunda página de resultados |
| PT-15 | Ver detalle de propiedad inactiva | ✅ Error 404 |

### 10.d. Plan de pruebas — Módulo de mensajería

| ID | Caso de prueba | Resultado obtenido |
|----|---------------|-------------------|
| PT-16 | Crear conversación nueva | ✅ Conversación creada |
| PT-17 | Crear conversación duplicada (mismo par+propiedad) | ✅ Devuelve conversación existente |
| PT-18 | Enviar mensaje normal | ✅ Mensaje guardado y mostrado |
| PT-19 | Enviar mensaje con insulto | ✅ Error 400 "mensaje inapropiado" |
| PT-20 | Enviar mensaje con insulto acentuado (cabrón) | ✅ Detectado (normalización de acentos) |
| PT-21 | Mensajes ordenados cronológicamente | ✅ Correcto |
| PT-22 | Contador de mensajes no leídos | ✅ Se incrementa/decrementa correctamente |

### 10.e. Plan de pruebas — Módulo de reservas

| ID | Caso de prueba | Resultado obtenido |
|----|---------------|-------------------|
| PT-23 | Crear reserva (fechas válidas) | ✅ Reserva creada con total calculado |
| PT-24 | Verificar cálculo total (precio × meses + fianza + 7%) | ✅ Cálculo correcto |
| PT-25 | Propietario acepta reserva | ✅ Estado cambia a ACCEPTED |
| PT-26 | Estudiante confirma reserva | ✅ Estado cambia a CONFIRMED |
| PT-27 | Cancelar reserva confirmada | ✅ Estado cambia a CANCELLED |
| PT-28 | Intentar aceptar reserva de otra persona | ✅ Error 403 |

### 10.f. Plan de pruebas — Interfaz de usuario

| ID | Caso de prueba | Resultado obtenido |
|----|---------------|-------------------|
| PT-29 | Navegación sin autenticación | ✅ Solo Home, Buscar, Login, Registro |
| PT-30 | Acceso a /panel sin autenticarse | ✅ Redirige a /login |
| PT-31 | Formulario de registro con contraseña corta | ✅ Error en frontend inmediato (Zod) |
| PT-32 | Banner "Guardado en favoritos" tras añadir | ✅ Aparece 4s y desaparece |
| PT-33 | Burbuja de mensajes propios a la derecha | ✅ Correcto (comparación user.id) |
| PT-34 | Scroll automático al último mensaje | ✅ Funciona con useRef |
| PT-35 | Filtros de búsqueda actualizan URL | ✅ Parámetros reflejados en URL |

### 10.g. Resultados obtenidos

De los 35 casos de prueba ejecutados, todos han dado resultado satisfactorio. Los principales incidentes detectados durante el desarrollo y resueltos fueron:

1. **Conversaciones duplicadas:** La consulta de conversaciones usaba `order_by('-messages__created_at')` sobre una relación M:N, lo que generaba filas duplicadas en el resultado. Solución: usar `.annotate(last_msg_at=Max('messages__created_at')).order_by('-last_msg_at').distinct()`.

2. **Chat bubbles incorrectas:** La comparación `m.sender === m.sender_detail?.id` era siempre verdadera porque ambos campos son el ID del remitente. Solución: comparar con `m.sender === user?.id` donde `user` proviene del AuthContext.

3. **Estado de favorito no inicializado:** En la página de detalle, `useState(property.is_favorited)` siempre inicializaba en `false` porque la propiedad es `undefined` en el primer render (antes de que React Query resuelva la petición). Solución: usar `useEffect(() => { if (p) setFav(!!p.is_favorited) }, [p?.id])`.

4. **Paginación de favoritos:** La API podía devolver resultados con o sin paginación dependiendo de la configuración. El frontend solo leía `data?.data?.results`, perdiendo datos si la API devolvía lista plana. Solución: `data?.data?.results || data?.data || []`.

---

\newpage

## 11. Plan de Ejecución del Proyecto

### 11.a. Permisos y autorizaciones

Para el despliegue en producción de Stuguether se requieren las siguientes autorizaciones y consideraciones legales:

- **RGPD:** Redacción y publicación de Política de Privacidad y Términos de Uso antes de abrir el servicio al público. Los usuarios deben aceptar explícitamente estas políticas en el registro.
- **Cuenta de correo Gmail:** Para el envío de emails de verificación, se ha configurado una cuenta de Gmail con autenticación de dos factores y App Password específica para la aplicación, evitando exponer la contraseña principal.
- **Dominio web:** Registro del dominio `stuguether.com` (o similar) en un registrador acreditado, con configuración DNS apuntando al servidor de producción.
- **Certificado SSL/TLS:** Para habilitar HTTPS en producción, se utilizará Let's Encrypt (gratuito) o el certificado gestionado por la plataforma PaaS elegida.
- **Almacenamiento de archivos:** En producción, los archivos multimedia (imágenes de propiedades, avatares, documentos) se almacenarán en un servicio de almacenamiento objeto (Amazon S3 o Cloudinary), no en el sistema de archivos local del servidor.

### 11.b. Procedimientos de ejecución

El arranque del sistema en entorno de desarrollo sigue el siguiente procedimiento:

**Backend:**
```bash
# 1. Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 2. Aplicar migraciones pendientes
python manage.py migrate

# 3. Crear superusuario (primera vez)
python manage.py createsuperuser

# 4. Arrancar servidor de desarrollo
python manage.py runserver
```

**Frontend:**
```bash
# 1. Instalar dependencias (primera vez)
npm install

# 2. Arrancar servidor de desarrollo
npm run dev
```

**PostgreSQL:**
La base de datos debe estar ejecutándose antes de arrancar el backend. En Windows, el servicio se gestiona desde el panel de servicios del sistema o mediante pgAdmin.

### 11.c. Identificación de riesgos y PRL

| Riesgo | Probabilidad | Impacto | Medida preventiva |
|--------|-------------|---------|-------------------|
| Pérdida de datos de BD | Baja | Muy alto | Backups automáticos diarios |
| Acceso no autorizado a cuentas | Media | Alto | JWT con expiración corta, HTTPS obligatorio |
| Spam y cuentas falsas | Alta | Medio | Verificación email obligatoria |
| Inyección SQL | Baja | Muy alto | ORM de Django (queries parametrizadas) |
| XSS en mensajes | Baja | Medio | React escapa contenido por defecto |
| Sobrecarga del servidor | Media | Alto | Paginación en todas las listas, rate limiting |
| Ergonomía (PRL) | Alta | Bajo | Pausas cada 45 min, monitor a altura de ojos |

---

\newpage

## 12. Procedimientos de Seguimiento, Control y Calidad

### 12.a. Procedimiento de evaluación del proyecto

La calidad del proyecto se evalúa en dos dimensiones:

**Evaluación funcional:** Verificación de que cada requisito funcional definido en la sección de análisis está implementado y funciona según lo especificado. El plan de pruebas de la sección 10 sirve como lista de verificación de cobertura funcional.

**Evaluación técnica:** Revisión del código fuente aplicando los siguientes criterios:
- Ausencia de secrets en el código (todos en `.env`).
- Validaciones presentes tanto en frontend (Zod) como en backend (serializers DRF).
- Endpoints protegidos por permisos apropiados (ningún endpoint sensible accesible sin autenticación).
- Código organizado según convenciones del framework (PEP8, ESLint).
- Sin código muerto ni funcionalidades incompletas.

### 12.b. Indicadores de calidad

| Indicador | Valor objetivo | Cómo medirlo |
|-----------|---------------|--------------|
| Tiempo de respuesta API | < 500ms (p95) | Django Debug Toolbar en desarrollo |
| Tasa de error HTTP 5xx | < 0.1% | Logs del servidor |
| Cobertura de pruebas manuales | 100% de RF | Plan de pruebas (sección 10) |
| Validación de datos | 100% en frontend y backend | Revisión de serializers y formularios |
| Secretos en código | 0 | Auditoría manual con `git grep` |
| Endpoints sin autenticación | Solo los públicos definidos | Revisión de `permission_classes` |

### 12.c. Procedimiento de gestión de incidencias

Las incidencias detectadas durante el desarrollo se gestionaron mediante el sistema de issues de GitHub:

1. **Detección:** El problema se identifica durante pruebas manuales o revisión de código.
2. **Registro:** Se crea un issue en GitHub con descripción del comportamiento incorrecto, pasos para reproducirlo y comportamiento esperado.
3. **Diagnóstico:** Se analiza el código fuente para identificar la causa raíz.
4. **Solución:** Se implementa la corrección en una rama específica.
5. **Verificación:** Se repite el caso de prueba que falló para confirmar la solución.
6. **Cierre:** Se fusiona la rama y se cierra el issue.

### 12.d. Procedimiento de gestión de cambios

Cualquier cambio en los requisitos o en el diseño durante el desarrollo se gestionó siguiendo este proceso:

1. Evaluar el impacto del cambio en el modelo de datos (¿requiere migración?), en la API (¿cambia la interfaz de los endpoints?) y en el frontend.
2. Documentar el cambio en el historial de Git con un mensaje de commit descriptivo.
3. Actualizar la documentación relevante (este documento, el README).
4. Si el cambio implica una migración de base de datos, crear la migración, revisarla antes de aplicarla y hacer backup de los datos.

### 12.e. Participación de usuarios en la evaluación

Durante el desarrollo del proyecto se realizaron sesiones informales de prueba con compañeros que asumieron los roles de estudiante y propietario:

- **Estudiante (usuario tipo A):** Buscó propiedades, guardó favoritos, inició una conversación con un propietario y realizó una solicitud de reserva. Feedback principal: "El botón de favorito debería estar también en la página de detalle del piso" (implementado como RF-09 extendido).
- **Propietario (usuario tipo B):** Creó un anuncio, gestionó las fotos y respondió a mensajes. Feedback principal: "Necesito ver fácilmente cuántas solicitudes de reserva tengo pendientes" (implementado en el panel de propietario).

### 12.f. Cumplimiento del pliego de condiciones

| Requisito | Cumplimiento |
|-----------|-------------|
| Arquitectura REST API + SPA | ✅ Implementado |
| Autenticación JWT | ✅ Implementado |
| Verificación de email | ✅ Implementado |
| Rol de usuario múltiple | ✅ STUDENT / OWNER / ADMIN |
| Búsqueda con filtros | ✅ Implementado con django-filter |
| Mensajería integrada | ✅ Implementado |
| Sistema de reservas | ✅ Implementado con flujo de estados |
| Perfiles públicos | ✅ Implementado |
| Documentación API | ✅ OpenAPI 3.0 con drf-spectacular |
| Variables de entorno | ✅ python-decouple + .env |
| Control de versiones | ✅ Git + GitHub |

---

\newpage

## 13. Conclusiones

El desarrollo de Stuguether ha resultado en una plataforma web full-stack funcional que cubre los principales casos de uso de un marketplace de alojamiento estudiantil. Los objetivos planteados al inicio del proyecto se han alcanzado en su mayor parte.

**Objetivos alcanzados:**

Todos los objetivos específicos definidos en la sección de introducción han sido implementados satisfactoriamente:

- El modelo de datos relacional diseñado en PostgreSQL representa fielmente la complejidad del dominio: usuarios con roles y perfiles diferenciados, propiedades con múltiples atributos, sistema de amenidades, relación M:N entre propiedades y universidades con distancia estimada, y flujo completo de reservas con estados.
- La API REST está completamente funcional con autenticación JWT, permisos granulares por rol, paginación, filtrado avanzado y documentación automática OpenAPI. Todos los endpoints han sido probados manualmente con Postman.
- La verificación de email mediante tokens UUID funciona correctamente, incluyendo el caso de expiración y el reenvío con rate limiting de 1 minuto.
- El motor de búsqueda admite combinación de hasta 8 filtros simultáneos sin degradación apreciable del rendimiento en el conjunto de datos de prueba.
- El sistema de mensajería garantiza la unicidad de conversaciones por par de usuarios y propiedad, incluye detección de lenguaje inapropiado con normalización de acentos, y muestra correctamente los mensajes propios a la derecha y los ajenos a la izquierda.
- El módulo de reservas gestiona el flujo completo de estados y calcula automáticamente la comisión de servicio en el modelo.
- La interfaz de usuario React es coherente, visualmente cuidada y completamente funcional.

**Objetivos parcialmente alcanzados:**

- **Sistema de pagos:** El modelo lógico de escrow (custodia de pagos) está implementado con los campos `payment_status` y la lógica de estados correspondiente, pero no está conectado a una pasarela de pago real como Stripe o Redsys. Esta es la limitación más significativa del proyecto para un escenario de producción real.
- **Tests automatizados:** No se implementaron tests unitarios ni de integración formales. Las pruebas se realizaron manualmente, lo que es suficiente para el alcance del proyecto pero no para un entorno profesional de CI/CD.

**Aprendizajes clave:**

Este proyecto ha sido la experiencia de desarrollo más completa del ciclo formativo, integrando conocimientos de todas las asignaturas:

- **Bases de datos:** Diseño de esquemas relacionales complejos, uso del ORM de Django, comprensión de las migraciones y de las consultas ORM avanzadas (annotate, distinct, select_related).
- **Programación:** Patrones de diseño aplicados (Singleton en AuthContext, Factory en serializers), principios SOLID en la organización del código.
- **Redes y servicios:** Comprensión profunda del protocolo HTTP, cabeceras CORS, autenticación stateless con JWT y flujo OAuth-like.
- **Sistemas:** Gestión de entornos virtuales, variables de entorno, configuración de servicios SMTP.
- **Desarrollo de interfaces:** Componentes React reactivos, gestión de estado global vs. local, optimistic updates.

La dificultad más significativa fue diseñar correctamente el sistema de autenticación con verificación de email, especialmente el punto de cuándo emitir el JWT (solo tras verificación, no en el registro) y cómo mantener el estado de autenticación en el frontend a través de recargas de página.

---

\newpage

## 14. Vías Futuras

Stuguether tiene un amplio margen de mejora y expansión. Las líneas de trabajo futuras más relevantes son:

### 14.a. Integración de pagos reales

La implementación del sistema de escrow real mediante una pasarela de pagos como **Stripe Connect** permitiría:
- Cobrar al estudiante en el momento de confirmar la reserva.
- Retener el pago en custodia durante el periodo de cancelación gratuita (por ejemplo, 48h).
- Transferir el pago al propietario automáticamente al inicio del contrato.
- Gestionar devoluciones automáticas en caso de cancelación con derecho a reembolso.

Stripe Connect está específicamente diseñado para plataformas marketplace y ofrece una API robusta con gestión de disputas y cumplimiento regulatorio integrado.

### 14.b. Aplicación móvil con React Native

La arquitectura API REST del backend es completamente agnóstica al tipo de cliente. Una aplicación móvil iOS/Android con React Native podría reutilizar:
- Toda la lógica de llamadas a la API (archivos `api/*.js`).
- Los contextos de autenticación (AuthContext).
- La lógica de negocio de React Query.

Solo habría que reimplementar los componentes visuales (de `div`/`JSX` HTML a componentes React Native como `View`, `Text`, `TouchableOpacity`).

### 14.c. Sistema de matching de compañeros

Una de las propuestas de valor más innovadoras que se puede añadir es un algoritmo de compatibilidad entre estudiantes basado en sus perfiles de hábitos. El sistema podría:
- Calcular un porcentaje de compatibilidad entre dos perfiles de hábitos.
- Mostrar en cada propiedad compartida qué tan compatible es el usuario con los actuales inquilinos (si tienen perfil en Stuguether).
- Ofrecer una sección de "buscar compañero de piso" independiente de las propiedades.

### 14.d. Verificación automática de matrícula universitaria

Varias universidades españolas ofrecen APIs o servicios de verificación de matrícula. La integración con estos sistemas permitiría verificar automáticamente que el usuario es realmente estudiante universitario, aumentando la confianza en la plataforma. En ausencia de API, se podría implementar un proceso de revisión manual asistido por OCR (reconocimiento óptico de caracteres) del documento de matrícula subido.

### 14.e. Sistema de notificaciones en tiempo real

El sistema de mensajería actual usa polling (peticiones periódicas cada 5-10 segundos) para detectar nuevos mensajes. Una implementación con **WebSockets** (Django Channels) permitiría:
- Notificaciones push instantáneas de nuevos mensajes.
- Indicador de "escribiendo..." en tiempo real.
- Actualización instantánea del contador de no leídos en la navbar.

### 14.f. Internacionalización (i18n)

Ampliar la plataforma a otros mercados hispanohablantes (México, Colombia, Argentina, Chile) o europeos (Portugal, Italia) requeriría implementar soporte multiidioma tanto en el backend (Django i18n) como en el frontend (react-i18next). La arquitectura actual permite esta extensión sin cambios estructurales.

### 14.g. Panel de administración mejorado

Aunque el panel de Django Admin es funcional para operaciones básicas, una herramienta de backoffice personalizada permitiría a los administradores de Stuguether:
- Moderar propiedades con un flujo de aprobación visual.
- Ver métricas de uso (propiedades publicadas, reservas completadas, ingresos por comisiones).
- Gestionar disputas entre estudiantes y propietarios.
- Aplicar penalizaciones a usuarios que incumplen las normas de uso.

### 14.h. SEO y rendimiento

Las SPAs (Single Page Applications) tienen limitaciones de indexación por motores de búsqueda porque el contenido se genera en el cliente con JavaScript. Para optimizar el SEO de Stuguether se podría implementar **Server Side Rendering (SSR)** o **Static Site Generation (SSG)** con **Next.js**, que ofrece la misma experiencia de desarrollo React pero con renderizado en servidor.

---

\newpage

## 15. Bibliografía y Webgrafía

### Documentación oficial

- Django Project. (2024). *Django documentation (v4.2)*. https://docs.djangoproject.com/en/4.2/
- Django REST Framework. (2024). *Django REST Framework documentation*. https://www.django-rest-framework.org/
- SimpleJWT. (2024). *Simple JWT — A JSON Web Token authentication plugin for Django REST Framework*. https://django-rest-framework-simplejwt.readthedocs.io/
- drf-spectacular. (2024). *drf-spectacular documentation*. https://drf-spectacular.readthedocs.io/
- Meta (React). (2024). *React documentation*. https://react.dev/
- TanStack. (2024). *TanStack Query v5 documentation*. https://tanstack.com/query/latest/docs/framework/react/overview
- React Router. (2024). *React Router v7 documentation*. https://reactrouter.com/home
- Vite. (2024). *Vite guide*. https://vite.dev/guide/
- Axios. (2024). *Axios documentation*. https://axios-http.com/docs/intro
- Zod. (2024). *Zod documentation*. https://zod.dev/
- PostgreSQL Global Development Group. (2024). *PostgreSQL 15 documentation*. https://www.postgresql.org/docs/15/

### Libros y artículos técnicos

- Holovaty, A., & Kaplan-Moss, J. (2009). *The Definitive Guide to Django: Web Development Done Right* (2nd ed.). Apress.
- Wieruch, R. (2022). *The Road to React*. Leanpub. https://www.roadtoreact.com/
- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (20th Anniversary Ed.). Addison-Wesley.
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.
- Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (Doctoral dissertation). University of California, Irvine.
- IETF. (2015). *RFC 7519: JSON Web Token (JWT)*. https://datatracker.ietf.org/doc/html/rfc7519

### Recursos web adicionales

- ONTSI. (2024). *Informe anual del sector TIC y de los contenidos en España 2024*. https://www.ontsi.es/
- Consejo de la Juventud de España. (2024). *Observatorio de Emancipación*. https://www.cje.org/
- OWASP Foundation. (2024). *OWASP Top Ten Web Application Security Risks*. https://owasp.org/www-project-top-ten/
- Stack Overflow. (2024). *Stack Overflow Developer Survey 2024*. https://survey.stackoverflow.co/2024/
- npm trends. (2024). *React vs Vue vs Angular weekly downloads comparison*. https://npmtrends.com/
- Stripe Inc. (2024). *Stripe Connect documentation*. https://stripe.com/docs/connect
- Agencia Española de Protección de Datos. (2024). *Guía sobre el uso de cookies*. https://www.aepd.es/

---

\newpage

## 16. Anexos

---

### Anexo I — Manual de Instalación

Este anexo describe el proceso completo para instalar y ejecutar Stuguether en un entorno de desarrollo local.

#### Requisitos previos

| Software | Versión mínima | Descarga |
|----------|----------------|---------|
| Python | 3.11+ | https://python.org/downloads/ |
| Node.js | 20 LTS | https://nodejs.org/ |
| PostgreSQL | 14+ | https://postgresql.org/download/ |
| Git | 2.x | https://git-scm.com/ |

#### 1. Clonar el repositorio

```bash
git clone https://github.com/pinxitoconsalsa/stuguether.git
cd stuguether
```

#### 2. Configuración del Backend (Django)

**2.1 Crear y activar entorno virtual:**

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

**2.2 Instalar dependencias:**

```bash
pip install -r requirements.txt
```

**2.3 Configurar variables de entorno:**

Crear el archivo `backend/.env` con el siguiente contenido (ajustar los valores):

```ini
SECRET_KEY=tu-clave-secreta-muy-larga-y-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos PostgreSQL
DB_NAME=stuguether_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432

# Email (desarrollo: usar console backend)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=Stuguether <noreply@stuguether.com>

# URL del frontend
FRONTEND_URL=http://localhost:5173
```

**2.4 Crear la base de datos PostgreSQL:**

Abrir psql o pgAdmin y ejecutar:

```sql
CREATE DATABASE stuguether_db;
CREATE USER stuguether_user WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE stuguether_db TO stuguether_user;
```

**2.5 Aplicar migraciones:**

```bash
python manage.py migrate
```

**2.6 Crear superusuario (administrador):**

```bash
python manage.py createsuperuser
```

Seguir las instrucciones: email, nombre de usuario y contraseña.

**2.7 (Opcional) Cargar datos de prueba:**

```bash
python manage.py loaddata fixtures/universities.json
python manage.py loaddata fixtures/sample_properties.json
```

**2.8 Arrancar el servidor:**

```bash
python manage.py runserver
```

La API estará disponible en `http://localhost:8000/api/v1/`.
La documentación Swagger en `http://localhost:8000/api/schema/swagger-ui/`.
El panel de administración en `http://localhost:8000/admin/`.

#### 3. Configuración del Frontend (React)

**3.1 Instalar dependencias:**

```bash
cd ../frontend
npm install
```

**3.2 Configurar variables de entorno:**

Crear el archivo `frontend/.env`:

```ini
VITE_API_URL=http://localhost:8000/api/v1
```

**3.3 Arrancar el servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

#### 4. Verificación de la instalación

Abrir el navegador en `http://localhost:5173` y verificar que:

1. La página de inicio carga correctamente.
2. El formulario de registro está accesible en `/registro`.
3. Tras registrarse, aparece el mensaje de verificación de email.
4. En la consola del servidor Django aparece el email de verificación (en modo console backend).
5. El enlace de verificación del email activa la cuenta y redirige al panel.

---

### Anexo II — Manual de Usuario

#### Para estudiantes

**Crear una cuenta**

1. Acceder a la página principal de Stuguether.
2. Hacer clic en el botón "Registrarse" en la esquina superior derecha.
3. Rellenar el formulario: nombre, apellidos, correo electrónico y contraseña (mínimo 8 caracteres).
4. Seleccionar el rol "Estudiante".
5. Hacer clic en "Crear cuenta".
6. Revisar el correo electrónico recibido y hacer clic en el enlace de verificación.
7. Tras la verificación, serás redirigido automáticamente a tu panel personal.

**Buscar un piso**

1. Acceder a "Buscar piso" en la barra de navegación.
2. Aplicar los filtros deseados: ciudad, tipo de inmueble, precio máximo, número de compañeros, amenidades.
3. Hacer clic en una tarjeta para ver el detalle completo del piso.
4. En la página de detalle, puedes ver las fotos, la ubicación en el mapa, las amenidades y las reseñas.

**Guardar un piso en favoritos**

- En el listado: hacer clic en el icono de corazón (🤍) de la tarjeta del piso. El corazón se pone azul (❤️) para indicar que está guardado.
- En el detalle del piso: hacer clic en el botón "Guardar" junto al título.
- Ver todos los favoritos en: Panel → Favoritos.

**Enviar un mensaje a un propietario**

1. En la página de detalle del piso, hacer clic en "Contactar propietario".
2. Escribir el mensaje en el campo de texto y pulsar "Enviar".
3. Las respuestas del propietario aparecerán en tu sección "Mensajes" del panel.

**Solicitar una reserva**

1. En la página de detalle del piso, hacer clic en "Solicitar reserva".
2. Seleccionar la fecha de entrada y la fecha de salida.
3. Revisar el desglose de costes (alquiler + fianza + comisión del servicio).
4. Confirmar la solicitud.
5. El propietario recibirá tu solicitud. Cuando la acepte, recibirás una notificación en tu panel.
6. Tras la aceptación del propietario, deberás confirmar la reserva definitivamente desde tu panel → Reservas.

**Completar tu perfil**

1. Ir a Panel → Mi Perfil.
2. Hacer clic en "Editar perfil".
3. Añadir foto, datos académicos (universidad, titulación, curso), edad, ciudad y descripción personal.
4. Seleccionar tus hábitos de convivencia (no fumador, madrugador, deportista, etc.).
5. Guardar los cambios.

---

#### Para propietarios

**Publicar un anuncio**

1. Crear una cuenta seleccionando el rol "Propietario".
2. Desde el panel, hacer clic en "Nueva propiedad".
3. Rellenar la información del anuncio:
   - Título descriptivo y descripción detallada.
   - Dirección completa (se geocodificará automáticamente).
   - Tipo: habitación, piso entero o estudio.
   - Precio mensual y fianza.
   - Superficie, número de baños y compañeros actuales.
   - Amenidades disponibles (WiFi, calefacción, amueblado, etc.).
   - Preferencia de género (opcional).
4. Subir entre 1 y 10 fotos del alojamiento.
5. Hacer clic en "Publicar anuncio".

**Gestionar reservas**

1. Las solicitudes de reserva pendientes aparecen en Panel → Reservas con estado "Pendiente".
2. Revisar los datos del estudiante y las fechas solicitadas.
3. Hacer clic en "Aceptar" para aprobar la solicitud o "Rechazar" para denegarla.
4. Si aceptas, el estudiante deberá confirmar definitivamente la reserva desde su panel.

**Responder mensajes**

1. Los mensajes de potenciales inquilinos aparecen en Panel → Mensajes.
2. Hacer clic en una conversación para ver el historial y responder.

---

### Anexo III — Glosario de términos técnicos

| Término | Definición |
|---------|-----------|
| **API REST** | Interfaz de programación de aplicaciones que sigue los principios arquitectónicos REST (Representational State Transfer), usando HTTP como protocolo y JSON como formato de intercambio. |
| **JWT** | JSON Web Token. Estándar abierto (RFC 7519) para transmitir información de forma segura entre partes como un objeto JSON firmado digitalmente. |
| **ORM** | Object-Relational Mapper. Técnica de programación que convierte datos entre sistemas de tipos incompatibles (objetos Python ↔ tablas SQL). |
| **SPA** | Single Page Application. Aplicación web que carga una única página HTML y actualiza el contenido dinámicamente sin recargar la página completa. |
| **CORS** | Cross-Origin Resource Sharing. Mecanismo del navegador que controla qué dominios externos pueden hacer peticiones a un servidor. |
| **UUID** | Universally Unique Identifier. Identificador de 128 bits diseñado para ser globalmente único, usado para los tokens de verificación de email. |
| **Escrow** | Sistema de custodia de pagos donde un tercero (la plataforma) retiene el dinero hasta que se cumplen las condiciones acordadas entre las partes. |
| **Migrations** | Archivos generados por el ORM de Django que registran los cambios en el esquema de la base de datos, permitiendo aplicar esos cambios de forma reproducible. |
| **Serializer** | Componente de DRF que convierte instancias de modelos Django a representaciones JSON y valida datos JSON de entrada. |
| **Middleware** | Software que actúa como intermediario en el ciclo de petición-respuesta HTTP, procesando las peticiones antes de que lleguen a la vista y las respuestas antes de que lleguen al cliente. |
| **Vite** | Herramienta de construcción (build tool) para proyectos JavaScript modernos, conocida por su velocidad de arranque en desarrollo. |
| **React Query** | Biblioteca para gestión del estado del servidor en React, que maneja caché, sincronización y actualización de datos remotos. |
| **Polling** | Técnica de consulta periódica a un servidor para detectar cambios, alternativa a WebSockets para actualizaciones en tiempo real. |
| **PaaS** | Platform as a Service. Modelo de computación en la nube que proporciona una plataforma para desarrollar, ejecutar y gestionar aplicaciones sin la complejidad de construir y mantener la infraestructura. |
| **LTS** | Long Term Support. Versión de un software que recibe actualizaciones de seguridad y correcciones de errores durante un periodo prolongado (generalmente 3-5 años). |

---

*Fin de la memoria — Stuguether · Antonio Montero Barroso · DAM 2025-2026 · iLERNA*
