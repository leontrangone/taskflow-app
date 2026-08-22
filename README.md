# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# TaskFlow App

Aplicación de lista de tareas con autenticación de usuarios y persistencia en la nube,
desarrollada como Trabajo Práctico de recuperación (TP2: Aplicación Serverless y TP3: CI/CD).

## Descripción

TaskFlow permite a un usuario registrarse, iniciar sesión, y gestionar su propia lista de
tareas (crear, ver, marcar como completadas y eliminar). Toda la información se persiste en
una base de datos en la nube (Supabase), asociada al usuario autenticado mediante Row Level
Security, por lo que cada usuario solo puede ver y modificar sus propias tareas.

## Equipo

| Integrante | Responsabilidad |
|---|---|
| Nico | Layout y componentes de UI (login/registro) |
| Leon | Lógica CRUD y conexión con Supabase |

## Stack tecnológico

- **Frontend**: React (Vite)
- **Backend / Auth / DB**: Supabase (PostgreSQL + Auth)
- **Testing**: Vitest (unitarios) + Testing Library, Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel

## URL de producción

https://taskflow-app-nn24.vercel.app

*(reemplazá por la URL final real si cambió)*

## Estructura de ramas

- `main`: versión funcional y desplegada
- `develop`: rama de integración
- `nico` / `leon`: ramas individuales de trabajo (TP2)
- `feature/nombre-feature`: nuevas funcionalidades (TP3 en adelante)
- `fix/nombre-bug`: corrección de errores (TP3 en adelante)

## Cómo correr el proyecto localmente

### Requisitos
- Node.js 20+
- Cuenta de Supabase con un proyecto creado

### Pasos

```bash
git clone https://github.com/leontrangone/taskflow-app.git
cd taskflow-app
npm install
```

Creá un archivo `.env` en la raíz con:
VITE_SUPABASE_URL=https://rhgjagjuuqddqugwdksj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_XTbR0b3cFTJwTojTjkqvIA_Meu4YLlI

Corré el servidor de desarrollo:

```bash
npm run dev
```

### Base de datos (Supabase)

Ejecutar en el SQL Editor de Supabase:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  done boolean default false,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Users can view own tasks"
  on tasks for select using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on tasks for insert with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete using (auth.uid() = user_id);
```

## Tests

```bash
# Tests unitarios
npm run test

# Tests E2E (requiere navegadores de Playwright instalados)
npx playwright install --with-deps chromium
npm run test:e2e
```

## Pipeline de CI/CD

En cada push o Pull Request a `main`, GitHub Actions ejecuta:

lint → test (unitarios + E2E) → build → deploy (solo en push a main)

Ver detalle completo de decisiones de calidad en [`CALIDAD.md`](./CALIDAD.md).

## Funcionalidades

### Mínimas (requeridas)
- [x] Registro de usuario, inicio y cierre de sesión
- [x] Crear, visualizar y editar tareas asociadas al usuario
- [x] Persistencia en base de datos en la nube (Supabase)

### Extra
- [x] Branching y Conventional Commits
- [x] Uso de Pull Requests con revisión
- [x] Pipeline de CI/CD completo (TP3)
- [x] Tests unitarios y E2E automatizados en CI