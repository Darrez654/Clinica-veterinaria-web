# 🐾 VetClinic - Arquitectura Multiplataforma

**VetClinic** es un sistema de gestión veterinaria diseñado con una **arquitectura multiplataforma** que permite ejecutarse en:

| Plataforma | Tecnología | Estado |
|-----------|------------|--------|
| 🌐 **Web** | React + TypeScript + Vite | ✅ Completo |
| 🖥️ **Desktop** | Neutralino.js | ✅ Configurado |
| 📱 **Mobile** | React Native (API compartida) | ✅ API lista |
| 🎮 **Interactivo** | Phaser (Canvas API) | ✅ Componente Virtual Pet |

---

## 📁 Estructura del Proyecto

```
├── src/
│   ├── api/                      # API Central (compartida entre plataformas)
│   │   ├── client.ts             # Cliente HTTP universal
│   │   ├── types.ts              # Tipos compartidos (Web + Desktop + Mobile)
│   │   ├── index.ts              # Punto de entrada API
│   │   ├── hooks/                # Hooks React para consumir la API
│   │   │   ├── useApi.ts         # Hook genérico useApi + useMutation
│   │   │   └── index.ts
│   │   └── services/             # Servicios por entidad
│   │       ├── users.ts
│   │       ├── veterinarians.ts
│   │       ├── pets.ts
│   │       ├── appointments.ts
│   │       ├── clinicalRecords.ts
│   │       └── dashboard.ts
│   │
│   ├── app/
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Layout con sidebar + Neutralino support
│   │   │   ├── EnhancedDashboard.tsx  # Dashboard con gráficos (Recharts)
│   │   │   ├── EnhancedUsers.tsx      # CRUD Usuarios mejorado
│   │   │   └── phaser/
│   │   │       └── VirtualPet.tsx     # Mascota virtual interactiva (Canvas)
│   │   ├── App.tsx
│   │   └── routes.tsx
│   │
│   ├── hooks/
│   │   └── useNeutralino.ts      # Detección y API de Neutralino
│   │
│   ├── mobile/
│   │   └── shared.ts             # Módulo compartido para React Native
│   │
│   ├── shared/
│   │   └── api.ts                # Utilidades compartidas entre plataformas
│   │
│   ├── neutralino.ts             # Inicialización de Neutralino
│   ├── main.tsx                  # Entry point con inicialización multiplataforma
│   └── styles/                   # Estilos con Tailwind CSS v4 + tema veterinario
│
├── scripts/
│   └── mock-api-server.js        # Servidor API Mock para desarrollo
│
├── neutralino.config.json        # Configuración de Neutralino.js
├── package.json
└── vite.config.ts
```

---

## 🏗️ API Central

La API está diseñada para ser consumida por **las 3 plataformas**:

### Cliente HTTP (`src/api/client.ts`)

```typescript
import { apiClient } from './api';

// Funciona en Web, Neutralino y React Native
const users = await apiClient.get('/users');
const newUser = await apiClient.post('/users', { name: 'Juan', ... });
```

**Características:**
- ✅ Detección automática de Neutralino
- ✅ Fallback a datos locales si no hay conexión
- ✅ Manejo centralizado de errores
- ⚙️ Configurable por variable de entorno `VITE_API_URL`

### Hooks React (`src/api/hooks/useApi.ts`)

```typescript
import { useApi, useMutation } from './api/hooks';
import { usersService } from './api/services/users';

// Lectura automática con estados
const { data, loading, error, refetch } = useApi(
  () => usersService.getAll(),
  []
);

// Mutaciones
const { mutate, loading: saving } = useMutation();
await mutate(() => usersService.create(newUser));
```

---

## 🖥️ Neutralino (Desktop App)

### Configuración

El proyecto incluye `neutralino.config.json` listo para compilar:

```bash
# Instalar CLI de Neutralino
npm install -g @neutralinojs/neu

# Compilar para desktop
neu build

# Ejecutar en desarrollo
neu run
```

**Características integradas:**
- ✅ Menú nativo de aplicación
- ✅ Soporte para Windows, macOS y Linux
- ✅ Barra de título personalizada
- ✅ API de sistema de archivos para exportación/importación
- ✅ Notificaciones del sistema

### Detección automática

```typescript
import { useNeutralino } from './hooks/useNeutralino';

function App() {
  const { isNeutralino, os } = useNeutralino();
  // isNeutralino = true cuando se ejecuta como desktop app
}
```

---

## 📱 React Native (Mobile)

### Cómo usar la API compartida

Para crear la app móvil:

```bash
# 1. Crear proyecto React Native
npx react-native init VetClinicMobile

# 2. Copiar la API compartida
cp -r src/api/ VetClinicMobile/src/
cp src/mobile/shared.ts VetClinicMobile/src/shared/

# 3. Usar el mismo cliente API
```

```typescript
// VetClinicMobile/src/screens/UsersScreen.tsx
import { apiClient } from '../api/client';

export function UsersScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient.get('/users')
      .then(res => setUsers(res.data));
  }, []);
}
```

### Tipos compartidos

Todos los tipos están en `src/api/types.ts` y son 100% compatibles con React Native:

```typescript
import type { User, Pet, Appointment } from './api/types';
```

---

## 🎮 Phaser (Componente Interactivo)

El componente `VirtualPet` usa **Canvas API** (estilo Phaser) para crear una mascota virtual interactiva:

- 🐕 Mascota animada que se mueve por la pantalla
- 🍖 Barritas de estado (hambre, felicidad, salud)
- 🎾 Botones interactivos: Alimentar, Jugar, Descansar
- 😊 Reacciones según el estado de ánimo
- 👁️ Parpadeo y movimiento de cola

El componente se encuentra en `src/app/components/phaser/VirtualPet.tsx` y se puede integrar fácilmente en cualquier pantalla.

---

## 🚀 Inicio Rápido

### 1. Web (desarrollo)

```bash
pnpm install
pnpm dev
# → http://localhost:5173
```

### 2. API Mock (para pruebas)

```bash
node scripts/mock-api-server.js
# → http://localhost:3001/api
```

### 3. Desktop (Neutralino)

```bash
# Instalar Neutralino CLI
npm install -g @neutralinojs/neu

# Compilar
neu build

# Ejecutar
./dist/VetClinic/VetClinic.exe  # Windows
./dist/VetClinic/VetClinic      # Linux/Mac
```

### 4. Mobile (React Native)

```bash
# Crear proyecto RN
npx react-native init VetClinicMobile

# Copiar API compartida
cp -r src/api/ VetClinicMobile/src/

# Usar el cliente API en la app móvil
```

---

## 🔄 Flujo de Datos

```
                    ┌──────────────────────┐
                    │     API Central       │
                    │  http://localhost:     │
                    │  3001/api             │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         ┌────▼────┐    ┌─────▼─────┐    ┌─────▼─────┐
         │  Web    │    │ Desktop   │    │  Mobile   │
         │  React  │    │ Neutralino│    │ReactNative│
         └─────────┘    └───────────┘    └───────────┘
              │                │                │
         ┌────▼────┐    ┌─────▼─────┐    ┌─────▼─────┐
         │ Browser │    │  Native   │    │   App     │
         │  App    │    │  Window   │    │  Store    │
         └─────────┘    └───────────┘    └───────────┘
```

---

## 🎨 Tema y Diseño

Basado en el diseño de Figma con paleta de colores veterinaria:

- **Primary:** `#2d6a4f` (Verde bosque)
- **Secondary:** `#95d5b2` (Verde claro)
- **Accent:** `#74c69d` (Verde menta)
- **Background:** `#f8fdf9` (Blanco verdoso)
- **UI Framework:** Tailwind CSS v4 + shadcn/ui + Recharts

---

## 📦 Dependencias Principales

| Paquete | Uso |
|---------|-----|
| React 18 | UI Framework |
| React Router 7 | Navegación SPA |
| Tailwind CSS 4 | Estilos utilitarios |
| Recharts | Gráficos interactivos |
| Lucide React | Iconos |
| shadcn/ui | Componentes base |
| Neutralino.js | Desktop runtime |

---

## 📄 Licencia

Proyecto educativo - Arquitectura de Software
