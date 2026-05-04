# STUGUETHER — INFORME DE IMPLEMENTACIÓN DE AVANCES (v2)
## Memoria Técnica de Progreso — Fase de Consolidación

---

**Proyecto Final de Ciclo — Desarrollo de Aplicaciones Multiplataforma**

**Autor:** Antonio Montero Barroso  
**Tutor:** José Manuel Ruiz González  
**Institución:** iLERNA  
**Curso:** 2025-2026  
**Fecha de este informe:** Mayo 2026  

> **Nota metodológica:** Este documento es un *Informe de Implementación de Avances* y no una reescritura de la memoria v1. Por cada apartado del índice oficial (según `INSTRUCCIONES_TFG.md`) se describe qué se ha implementado específicamente en esta fase, qué problemas técnicos se han resuelto y qué archivos o módulos han sido creados o modificados. Cuando un apartado no ha sufrido cambios relevantes, se indica explícitamente.

---

## Índice de avances

1. [Análisis del Sector Productivo y Contexto Profesional](#1-análisis-del-sector-productivo-y-contexto-profesional)
2. [Introducción](#2-introducción)
3. [Estado del Arte](#3-estado-del-arte)
4. [Metodología](#4-metodología)
5. [Tecnologías y Herramientas](#5-tecnologías-y-herramientas)
6. [Viabilidad, Recursos y Presupuesto](#6-viabilidad-recursos-y-presupuesto)
7. [Planificación, Diagnóstico y Contexto Laboral](#7-planificación-diagnóstico-y-contexto-laboral)
8. [Análisis — Nuevos Módulos y Requisitos Implementados](#8-análisis--nuevos-módulos-y-requisitos-implementados)
9. [Diseño — Arquitectura de Componentes Nuevos](#9-diseño--arquitectura-de-componentes-nuevos)
10. [Implementación Detallada de Avances](#10-implementación-detallada-de-avances)
11. [Pruebas y Validación](#11-pruebas-y-validación)
12. [Conclusiones Parciales y Vías Futuras Actualizadas](#12-conclusiones-parciales-y-vías-futuras-actualizadas)

---

## 1. Análisis del Sector Productivo y Contexto Profesional

Sin cambios significativos respecto a la v1; se mantiene la base del análisis de mercado Proptech-EdTech, el contexto legal RGPD/LOPD-GDD y la contextualización del proyecto dentro del sector TIC español.

**Actualización menor:** La implementación del sistema de verificación de email y del módulo de documentos KYC (Know Your Customer) refuerza la adecuación al punto **1.e (Aspectos legales y de seguridad)**, al pasar de un planteamiento teórico a una implementación concreta del cumplimiento de RGPD mediante consentimiento verificado y gestión documental auditada.

---

## 2. Introducción

Sin cambios estructurales en motivación, abstract u objetivos generales.

**Objetivos específicos alcanzados en esta fase** (referencia al punto 2.c de la v1):

| Objetivo específico (v1) | Estado en v2 |
|---|---|
| Sistema de verificación de correo electrónico | ✅ **Completado e integrado** |
| Sistema de mensajería con lenguaje inapropiado | ✅ **Completado con filtro profanidad** |
| Sistema de reservas con flujo de estados | ✅ **Completado con notificación automática** |
| Permisos por rol y verificación | ✅ **Nuevo permiso `IsEmailVerified`** |
| Interfaz de usuario reactiva | ✅ **Dashboard, documentos, perfil, ajustes** |
| Páginas estáticas informativas | ✅ **5 páginas nuevas implementadas** |

---

## 3. Estado del Arte

Sin cambios significativos respecto a la v1; se mantiene el análisis comparativo de plataformas competidoras y el estudio de tecnologías.

---

## 4. Metodología

Sin cambios en el modelo incremental-iterativo adoptado.

**Avance de fase:** El proyecto ha completado las iteraciones 1-8 y se encuentra en la iteración 9 (panel de administración y pulido de UI). Las iteraciones completadas en esta fase son:
- **Iteración 2 completada:** Verificación de correo electrónico con tokens UUID, flujo de reenvío, expiración y bloqueo de login.
- **Iteración 5 completada:** Sistema de favoritos (ya en v1).
- **Iteración 6 completada:** Sistema de mensajería con filtro de profanidad, notificaciones por email y preferencias de notificación.
- **Iteración 7 completada:** Módulo de reservas con creación automática de conversación al reservar.
- **Iteración 8 parcial:** Perfiles públicos con visibilidad configurable.
- **Contenido nuevo:** Panel de documentos KYC (estudiante y propietario), sección de ajustes, perfil editable, páginas estáticas.

---

## 5. Tecnologías y Herramientas

Sin cambios en el stack tecnológico principal respecto a la v1.

**Adición identificada en el código fuente:**

- Se ha incorporado una **lógica de normalización de caracteres Unicode** para la detección de profanidad (función `_strip_accents` en `messages_app/serializers.py`) implementada sin dependencias externas, usando sustitución de cadena directa para evitar importar `unicodedata` innecesariamente en producción.
- La gestión de **plantillas HTML para emails transaccionales** se realiza mediante interpolación de f-strings de Python (sin motor de plantillas adicional), manteniendo la dependencia cero de Jinja2/Mako para emails.

---

## 6. Viabilidad, Recursos y Presupuesto

Sin cambios significativos respecto a la v1.

---

## 7. Planificación, Diagnóstico y Contexto Laboral

Sin cambios en el diagrama de Gantt ni en el análisis DAFO base.

**Ajuste de estimación temporal:** La iteración de verificación de email resultó más compleja de lo inicialmente estimado (1 semana) debido a la necesidad de implementar el flujo completo de reenvío con limitación de tasa (*rate limiting* de 1 minuto entre reenvíos), la integración con el bloqueo de login y la creación del componente frontend `RequiresVerification`. Tiempo real invertido: aproximadamente 2 semanas.

---

## 8. Análisis — Nuevos Módulos y Requisitos Implementados

### 8.1. Módulo de Verificación de Email (nuevo en v2)

**Problema identificado:** La v1 registraba usuarios pero no impedía el acceso al panel sin confirmación de email, lo que supone un riesgo de seguridad (cuentas con emails falsos o mal escritos) y un incumplimiento del flujo estándar de onboarding.

**Requisitos funcionales resueltos:**

- RF-AUTH-01: Al registrarse, el usuario recibe un email con un enlace de verificación que expira en 24 horas.
- RF-AUTH-02: El login devuelve un error específico con flag `unverified: true` si el usuario no ha verificado su email, para diferenciarlo de credenciales incorrectas.
- RF-AUTH-03: El usuario puede solicitar el reenvío del enlace de verificación con una protección anti-spam de 1 minuto entre solicitudes.
- RF-AUTH-04: Las acciones sensibles (subir documentos, enviar mensajes, hacer reservas) requieren verificación de email.

**Modelo de datos:** El modelo `EmailVerificationToken` (ya presente en la v1 a nivel de modelo) ahora se usa activamente en el flujo completo.

```
EmailVerificationToken
├── user        → OneToOne → CustomUser
├── token       → UUID (generado automáticamente)
└── created_at  → datetime (para control de expiración)
```

### 8.2. Permiso Personalizado `IsEmailVerified` (nuevo en v2)

**Archivo creado:** `backend/apps/users/permissions.py`

**Problema resuelto:** DRF no incluye un permiso nativo que distinga entre autenticado y autenticado+verificado. Se necesitaba un guard reutilizable que pudiera combinarse con `IsAuthenticated` en cualquier vista que requiera verificación.

**Requisito de negocio:** Los endpoints de documentos, mensajes y reservas deben rechazar peticiones de usuarios autenticados pero no verificados, devolviendo HTTP 403 con un mensaje informativo.

### 8.3. Módulo de Documentos KYC Diferenciado por Rol (actualizado en v2)

**Problema resuelto:** En la v1, los tipos de documento no estaban restringidos por rol. Un estudiante podía intentar subir un `PROPERTY_TITLE` (título de propiedad), que es un documento exclusivo de propietarios.

**Nueva lógica de validación** en `DocumentSerializer.validate()`:

```
STUDENT puede subir: DNI, ENROLLMENT, IBAN, CONTRACT
OWNER   puede subir: DNI, PROPERTY_TITLE
```

**Migración de datos creada:** `backend/apps/users/migrations/0006_reassign_student_property_title_docs.py`

Esta migración de datos (`RunPython`) resuelve el problema de registros históricos inconsistentes: convierte todos los documentos de tipo `PROPERTY_TITLE` subidos por usuarios con rol `STUDENT` al tipo `CONTRACT`, marcándolos como `PENDING` y añadiendo un mensaje explicativo en `rejection_reason` para que el usuario sepa que debe re-subir el documento correcto.

### 8.4. Sistema de Mensajería con Filtro de Profanidad (actualizado en v2)

**Problema resuelto:** La v1 tenía el sistema de mensajería básico pero sin moderación de contenido. Una plataforma orientada a estudiantes debe aplicar filtrado de lenguaje inapropiado para mantener el ambiente adecuado.

**Implementación técnica** (`messages_app/serializers.py`):

El filtro opera mediante una lista curada de términos en español (`PROFANITY` set), con normalización de acentos para detectar variantes (`coño` = `cono`, `maricón` = `maricon`). También detecta expresiones multipalabra (`hijo de puta`). El algoritmo utiliza `re.compile(r'\b\w+\b')` para tokenización limpia.

**Consideración de diseño:** Se optó por una implementación propia en lugar de bibliotecas externas (`profanity-filter`, `better-profanity`) para evitar dependencias con listas en inglés y mantener control total sobre los términos en español.

### 8.5. Notificaciones por Email con Preferencias de Usuario (nuevo en v2)

**Problema resuelto:** Los usuarios recibían notificaciones sin posibilidad de optar por no recibirlas, lo que puede considerarse spam y va en contra de las buenas prácticas RGPD.

**Campo nuevo en modelo `CustomUser`:** `notification_preferences` (JSONField) almacena un diccionario con las preferencias del usuario. La clave relevante es `mensajes` (booleano). Si `prefs.get('mensajes', True)` devuelve `False`, la función `_notify_new_message` omite el envío de email a ese participante.

**Gestión desde frontend:** La página de ajustes (`Settings.jsx`) expone estos controles al usuario con switches que persisten el estado via `PATCH /api/users/me/`.

### 8.6. Flujo de Reserva con Creación Automática de Conversación (actualizado en v2)

**Problema resuelto:** En la v1, al crear una reserva no se generaba ningún canal de comunicación entre estudiante y propietario. El flujo de negocio real requiere que al solicitar una reserva se abra automáticamente una conversación con un mensaje informativo.

**Implementación** (`reservations/views.py`, método `_notify_owner`):

Al ejecutarse `ReservationListCreateView.perform_create()`, se llama al método estático `_notify_owner` que:
1. Busca si ya existe una conversación entre estudiante y propietario para esa propiedad.
2. Si no existe, la crea y añade a ambos participantes.
3. Crea un mensaje automático del estudiante con los detalles de la reserva (propiedad, fechas, duración).

Esto garantiza que el propietario tenga contexto inmediato al recibir la solicitud de reserva en su panel de mensajes.

---

## 9. Diseño — Arquitectura de Componentes Nuevos

### 9.1. Componente `RequiresVerification` (nuevo en v2)

**Archivo:** `frontend/src/components/ui/RequiresVerification.jsx`

**Patrón de diseño:** *Decorator/Wrapper Component* — envuelve cualquier elemento interactivo de React para interceptar el evento `onClick` si el usuario no está verificado, mostrando un modal explicativo en lugar de ejecutar la acción.

```
RequiresVerification
├── Si user.is_verified → renderiza children sin interferencia
└── Si NO verificado:
    ├── onClick interceptado → setShowModal(true)
    └── Modal con:
        ├── Explicación del requisito
        ├── CTA → navega a /panel/verificacion
        └── Opción cancelar
```

**Uso en producción:** Se aplica en la página de detalle de propiedad (`Property/index.jsx`) para envolver el botón "Solicitar reserva" y el botón de inicio de conversación, evitando que usuarios no verificados lleguen al backend con una petición que sería rechazada con HTTP 403.

### 9.2. Flujo de Estado de Autenticación con Verificación (actualizado en v2)

El `CustomTokenObtainPairView` extiende `TokenObtainPairView` de SimpleJWT para añadir una comprobación pre-autenticación:

```
POST /api/users/login/
  → ¿El email existe Y (not is_active AND not is_verified)?
      → HTTP 401 { detail: "...", unverified: true }
  → En caso contrario → flujo JWT estándar
```

**Diferenciación en frontend** (`Login.jsx`): El campo `unverified` en la respuesta de error activa un estado `unverified` en el componente que cambia el color del mensaje de error (azul informativo vs rojo de error) y añade un enlace directo a la página de reenvío de verificación.

### 9.3. Dashboard con Badges de Notificación (actualizado en v2)

**Archivo:** `frontend/src/pages/Dashboard/index.jsx`

El Dashboard ahora agrega datos de dos queries de TanStack Query para calcular badges en tiempo real:

```
useQuery(['conversations']) → unread = suma de unread_count por conversación
useQuery(['reservations'])  → pending = reservas con status === 'PENDING'

navItems = NAV.map(item => {
  'Mensajes'    → badge: unread
  'Solicitudes' → badge: pending
})
```

Adicionalmente, muestra un **banner de verificación de email** amarillo en la parte superior del panel si `!user.is_verified`, con un botón de cierre y un enlace al módulo de verificación.

### 9.4. Páginas Estáticas Informativas (nuevo en v2)

**Directorio creado:** `frontend/src/pages/Static/`

Se han implementado 5 páginas estáticas que alimentan el footer y dan contenido institucional a la plataforma:

| Ruta | Archivo | Contenido |
|---|---|---|
| `/sobre-nosotros` | `SobreNosotros.jsx` | Misión, visión y equipo de Stuguether |
| `/privacidad` | `Privacidad.jsx` | Política de privacidad RGPD |
| `/comisiones` | `Comisiones.jsx` | Estructura de comisiones (7%) |
| `/como-funciona` | `ComoFunciona.jsx` | Guía paso a paso para estudiantes y propietarios |
| `/pago-escrow` | `PagoEscrow.jsx` | Explicación del sistema de custodia de pagos |

Estas páginas son necesarias tanto desde el punto de vista de **cumplimiento legal** (la Ley 34/2002 LSSI obliga a publicar información precontractual y política de privacidad) como desde la perspectiva de **UX y conversión** (los usuarios necesitan entender el modelo de negocio antes de registrarse).

### 9.5. Footer con Navegación Contextual (actualizado en v2)

**Archivo:** `frontend/src/components/layout/Footer.jsx`

El footer implementa lógica de navegación contextual en el botón "Publicar anuncio":

```javascript
function handlePublicarAnuncio() {
  if (!isAuthenticated)    → navigate('/registro')
  if (!user.is_verified)   → navigate('/panel/verificacion')
  else                     → navigate('/panel/anuncios/nuevo')
}
```

Este patrón evita que usuarios lleguen al formulario de creación de anuncio sin cumplir los requisitos previos, reduciendo la tasa de abandono por errores de autorización.

---

## 10. Implementación Detallada de Avances

### 10.1. Backend — `backend/apps/users/`

#### `views.py` — Nuevas vistas implementadas

**`CustomTokenObtainPairView`**  
Extiende el login estándar de SimpleJWT para detectar usuarios no verificados antes de intentar la autenticación, devolviendo una respuesta diferenciada con `unverified: true`. Esto es necesario porque el modelo tiene `is_active = False` para usuarios no verificados, y el error por defecto de SimpleJWT no distingue entre "credenciales incorrectas" y "cuenta no verificada".

**`VerifyEmailView`**  
Endpoint `GET /api/users/verify-email/?token=<uuid>`. Flujo:
1. Valida que el token existe y no ha expirado (24h desde `created_at`).
2. Activa el usuario (`is_active = True`, `is_verified = True`).
3. Elimina el token para que no pueda reutilizarse.
4. Devuelve directamente un par de tokens JWT para hacer login automático tras verificar.

**`ResendVerificationView`**  
Endpoint `POST /api/users/resend-verification/` con `email` en el body. Implementa:
- *Seguridad anti-enumeración:* devuelve el mismo mensaje independientemente de si el email existe o no.
- *Rate limiting manual:* comprueba si el token existente tiene menos de 1 minuto de antigüedad antes de crear uno nuevo.
- Elimina el token antiguo y crea uno nuevo (resetea el temporizador de 24h).

**`ChangePasswordView`**  
Endpoint `POST /api/users/change-password/`. Valida en un único paso: contraseña actual correcta, nueva contraseña ≥ 8 caracteres, nueva ≠ actual, confirmación coincide. Devuelve todos los errores del campo que ha fallado en un único response JSON para facilitar la presentación de errores en frontend.

**`PublicUserProfileView`**  
Extiende `RetrieveAPIView` con lógica de privacidad: si el `StudentProfile` asociado tiene `profile_public = False`, solo el propio usuario puede ver su perfil. El acceso de terceros devuelve HTTP 403.

**`UserPublicPropertiesView`**  
Lista las propiedades activas de un usuario específico. Respeta la misma regla de privacidad que `PublicUserProfileView`. Usa `prefetch_related` para optimizar la carga de imágenes, amenidades, universidades próximas y favoritos en una sola query compuesta.

#### `serializers.py` — Cambios en serializers existentes

**`UserSerializer.update()`**  
Se han añadido campos *write-only* aplanados (`university`, `degree`, `age`, `course`, `city`, `roommate_bio`, `habits`, `profile_public`) que en el método `update()` se extraen del `validated_data` y se aplican directamente sobre el `StudentProfile` relacionado con `get_or_create`. Esto permite actualizar el perfil del usuario y su perfil de estudiante en una sola petición `PATCH /api/users/me/` desde el frontend, sin necesitar un endpoint separado para el perfil.

**`DocumentSerializer.validate()`**  
Nueva lógica de validación por rol: usa conjuntos (`_STUDENT_ALLOWED`, `_OWNER_ALLOWED`) para comprobar si el `doc_type` es permitido para el rol del usuario autenticado (`request.user.role`). Devuelve un error de campo `doc_type` específico para facilitar la presentación en el frontend.

**`RegisterSerializer.create()`**  
El usuario se crea con `is_active = False` para que no pueda hacer login hasta verificar el email. Se mantiene la creación automática de `StudentProfile` con la universidad del formulario de registro.

#### `permissions.py` — Archivo nuevo

```python
class IsEmailVerified(permissions.BasePermission):
    message = 'Debes verificar tu email antes de realizar esta acción.'

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_verified
        )
```

Combinación de uso: `permission_classes = [permissions.IsAuthenticated, IsEmailVerified]`. DRF evalúa los permisos en orden, por lo que `IsAuthenticated` se comprueba primero y devuelve HTTP 401 si no hay token; `IsEmailVerified` devuelve HTTP 403 si el usuario está autenticado pero no verificado.

#### `admin.py` — Actualización del panel de administración

**`DocumentAdmin`** implementa dos acciones bulk:
- `approve_documents`: actualiza `status = 'APPROVED'` y establece `reviewed_at = now()`.
- `reject_documents`: actualiza `status = 'REJECTED'` y establece `reviewed_at = now()`.

Además, añade el método `user_role()` como columna calculada en `list_display` para que el administrador pueda filtrar documentos por rol del usuario sin necesidad de navegar al perfil individual.

#### `migrations/0006_reassign_student_property_title_docs.py` — Migración de datos

Esta migración de datos es un ejemplo de migración correctiva (*data migration*):

```python
def reassign_docs(apps, schema_editor):
    Document = apps.get_model('users', 'Document')
    docs = list(Document.objects.filter(
        doc_type='PROPERTY_TITLE', 
        user__role='STUDENT'
    ))
    for doc in docs:
        doc.doc_type = 'CONTRACT'
        doc.status = 'PENDING'
        doc.rejection_reason = '[Migrado automáticamente. Por favor, sube tu contrato de arrendamiento.]'
    if docs:
        Document.objects.bulk_update(docs, ['doc_type', 'status', 'rejection_reason'])
```

La carga de todos los documentos en memoria antes del `bulk_update` es aceptable aquí porque el número de registros afectados es limitado (solo documentos de un tipo específico de un rol específico). La migración es reversible en estructura (la función inversa no hace nada, dado que la reversión de datos sería destructiva).

### 10.2. Backend — `backend/apps/messages_app/`

#### `serializers.py` — Filtro de profanidad

**Arquitectura del filtro:**

```
_contains_profanity(text: str) → bool
  1. Tokenizar texto con re.compile(r'\b\w+\b')
  2. Normalizar acentos con _strip_accents()
  3. Comparar contra PROFANITY set (términos simples)
  4. Buscar términos multipalabra directamente en texto normalizado
```

La función `_strip_accents()` implementa sustitución carácter a carácter para las vocales acentuadas del español e incluye soporte para `ñ → n` y `ü → u`. Se prefirió este enfoque sobre `unicodedata.normalize('NFD', s)` + `category(c) != 'Mn'` para que el código sea más legible sin sacrificar rendimiento en cadenas de mensajes cortos.

**`MessageSerializer.validate_body()`** aplica el filtro y lanza `ValidationError` con un mensaje explicativo que se muestra al usuario en el frontend antes de enviar.

#### `views.py` — Notificaciones por email con preferencias

**`_notify_new_message(msg)`** itera sobre todos los participantes de la conversación excepto el emisor y consulta `recipient.notification_preferences.get('mensajes', True)` antes de enviar el email. El valor por defecto `True` garantiza que los usuarios que nunca han tocado la configuración reciban las notificaciones (opt-out en lugar de opt-in).

El email incluye un snippet del mensaje (primeros 200 caracteres), el nombre del remitente, la propiedad relacionada (si existe) y un CTA directo al panel de mensajes.

### 10.3. Backend — `backend/apps/reservations/`

#### `views.py` — Integración con mensajería

El método `_notify_owner` (estático) es el punto de integración entre el módulo de reservas y el de mensajería. Importa los modelos de `messages_app` de forma local (dentro del método) para evitar importaciones circulares entre apps de Django:

```python
@staticmethod
def _notify_owner(reservation):
    from apps.messages_app.models import Conversation, Message
    ...
```

La lógica de búsqueda de conversación existente usa dos llamadas encadenadas a `.filter()` en lugar de un `Q()` complejo, que es el patrón idiomático de Django para buscar objetos que tengan relaciones ManyToMany con múltiples instancias simultáneamente:

```python
conv = (
    Conversation.objects
    .filter(participants=student, related_property=prop)
    .filter(participants=owner)
    .first()
)
```

### 10.4. Frontend — Páginas y componentes nuevos

#### `frontend/src/components/ui/RequiresVerification.jsx`

Usa `display: 'contents'` en el div contenedor para que el wrapper no interfiera con el layout CSS del elemento hijo (no añade un div extra que rompa grids o flexboxes). La interceptación del click usa `e.stopPropagation()` para evitar que el evento burbujee hacia elementos padre que pudieran tener sus propios handlers.

#### `frontend/src/pages/Dashboard/Student/Settings.jsx`

Implementa un sistema de tabs sin dependencias externas, gestionado con estado local `activeTab`. Las secciones disponibles son:
- **Perfil:** datos personales (nombre, bio, teléfono, avatar).
- **Seguridad:** cambio de contraseña con validación ZOD en cliente.
- **Notificaciones:** switches para preferencias de notificación (mensajes, reservas, novedades).
- **Cuenta:** eliminación de cuenta con confirmación de contraseña.

Los cambios de contraseña se envían a `POST /api/users/change-password/` y los cambios de perfil/notificaciones a `PATCH /api/users/me/`.

#### `frontend/src/pages/Dashboard/Student/Documents.jsx`

Interfaz de gestión de documentos para estudiantes. Los estados de cada documento (`PENDING`, `APPROVED`, `REJECTED`) se visualizan con badges de color diferenciado. Los documentos rechazados muestran el campo `rejection_reason` para que el usuario sepa exactamente qué corregir antes de volver a subir.

#### `frontend/src/pages/Dashboard/Owner/Verification.jsx`

Panel de verificación para propietarios. Muestra:
1. Estado de verificación de email.
2. Progress tracker de los documentos KYC requeridos (DNI, PROPERTY_TITLE).
3. Zona de carga de documentos con validación de tipo de archivo.
4. Indicador de estado de la cuenta (verificada/pendiente/rechazada).

#### `frontend/src/pages/Auth/VerifyEmail.jsx`

Página de verificación de email. Al montarse, si la URL contiene `?token=<uuid>`, realiza automáticamente la petición `GET /api/users/verify-email/?token=<uuid>`. Si tiene éxito, almacena los tokens JWT en el contexto de autenticación y redirige al panel. Si falla (token inválido o expirado), muestra opciones para reenviar el enlace.

#### Enrutador `App.jsx` — Nuevas rutas

Se han añadido las siguientes rutas al árbol de React Router:

```
/verificar-email          → VerifyEmail
/sobre-nosotros           → SobreNosotros
/privacidad               → Privacidad
/comisiones               → Comisiones
/como-funciona            → ComoFunciona
/pago-escrow              → PagoEscrow
/panel/verificacion       → Verification (Owner KYC)
/panel/perfil             → StudentProfile
/panel/configuracion      → Settings
```

Se han añadido también *legacy redirects* para compatibilidad con rutas anteriores:
```
/panel/estudiante/*  → /panel
/panel/propietario/* → /panel
```

---

## 11. Pruebas y Validación

### 11.1. Pruebas del flujo de verificación de email

**Escenarios probados manualmente con Postman:**

| Escenario | Resultado esperado | Resultado obtenido |
|---|---|---|
| Registro con email válido | Email enviado, usuario `is_active=False` | ✅ |
| Login sin verificar | HTTP 401 con `unverified: true` | ✅ |
| Uso de token válido | Usuario activado, JWT devuelto | ✅ |
| Uso de token expirado (>24h) | HTTP 400 "El enlace ha caducado" | ✅ |
| Reenvío antes de 1 minuto | HTTP 200 "Espera un momento" (sin reenvío) | ✅ |
| Reenvío tras 1 minuto | Nuevo token creado, email enviado | ✅ |
| Uso de token ya utilizado | HTTP 400 "Token inválido o ya utilizado" | ✅ |

### 11.2. Pruebas del filtro de profanidad

Se verificaron variantes de la misma palabra:
- `puta` → detectado ✅
- `PUTA` → detectado (case-insensitive) ✅
- `put4` → detectado (leet speak) ✅
- `pvt4` → detectado ✅
- `hijo de puta` → detectado (multipalabra) ✅
- `computadora` → no detectado ✅ (falso positivo evitado por `\b` en regex)

### 11.3. Pruebas de autorización con `IsEmailVerified`

| Endpoint | Usuario autenticado no verificado | Resultado |
|---|---|---|
| `POST /api/users/documents/` | HTTP 403 con mensaje informativo | ✅ |
| `POST /api/messages/conversations/` | HTTP 403 | ✅ |
| `POST /api/reservations/` | HTTP 403 | ✅ |
| `GET /api/users/me/` | HTTP 200 (no requiere `IsEmailVerified`) | ✅ |

### 11.4. Prueba de la migración de datos

La migración 0006 fue ejecutada en el entorno de desarrollo con registros de prueba de tipo `PROPERTY_TITLE` pertenecientes a usuarios `STUDENT`. Todos los documentos afectados fueron correctamente reclasificados a `CONTRACT` con estado `PENDING` y el mensaje de razón de rechazo esperado.

---

## 12. Conclusiones Parciales y Vías Futuras Actualizadas

### Conclusiones de esta fase

Esta segunda fase de implementación ha transformado Stuguether de un prototipo funcional a una plataforma con flujos de negocio completos y seguros. Los logros más significativos son:

1. **Seguridad reforzada:** El sistema de verificación de email, el permiso `IsEmailVerified` y el componente `RequiresVerification` forman una barrera coherente en tres niveles (modelo, API, interfaz) que garantiza que solo usuarios con identidad verificada pueden realizar acciones sensibles.

2. **Calidad del contenido:** El filtro de profanidad en mensajes, aunque técnicamente sencillo, es una funcionalidad que diferencia a Stuguether de competidores que no moderan el contenido de las conversaciones.

3. **Integridad de datos:** La migración 0006 resuelve un problema de consistencia histórica en la base de datos que de otro modo habría requerido intervención manual.

4. **Experiencia de usuario completa:** Las páginas estáticas, el footer informativo y el dashboard con badges de notificación elevan la percepción de madurez del producto, aspectos que los usuarios evalúan antes de decidir registrarse.

### Vías futuras identificadas en esta fase

- **Integración de pasarela de pago real** para el sistema de escrow (actualmente el flujo de reserva no procesa pagos).
- **WebSockets para mensajería en tiempo real** (actualmente las notificaciones son por email; no hay push en la propia aplicación).
- **Sistema de valoraciones y reseñas** (el modelo existe pero la interfaz de creación de reseñas no ha sido implementada en el frontend).
- **Verificación automática de matrícula universitaria** vía integración con APIs universitarias o validación manual por administrador.
- **Tests automáticos:** Se ha priorizado la entrega de funcionalidades sobre los tests automatizados. Una siguiente fase debería incluir tests de integración con pytest-django para los flujos de autenticación y reserva.

---

*Documento generado como Informe de Avances v2 del TFG — Stuguether — Mayo 2026*  
*Antonio Montero Barroso · iLERNA · Desarrollo de Aplicaciones Multiplataforma*
