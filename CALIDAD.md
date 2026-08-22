# CALIDAD.md

## Estrategia general
Pipeline con etapas dependientes: lint → tests unitarios → tests E2E → build → deploy.
Cada etapa solo corre si la anterior pasó, para detectar errores lo antes posible y
evitar que código no verificado llegue a producción.

## Herramientas seleccionadas
- **Vitest**: se integra nativamente con Vite, configuración mínima, más rápido que Jest en este contexto.
- **Testing Library**: testea componentes desde la perspectiva del usuario, no detalles de implementación.
- **Playwright**: instalación simple en CI, soporte multi-browser nativo.
- **GitHub Actions**: integrado directamente al repo, sin servicios externos.

## Tests desarrollados
- `utils.test.js`: valida que `isValidTaskTitle` rechace títulos vacíos o con solo espacios, y acepte títulos válidos.
- `Auth.test.jsx`: valida que el formulario de login se muestre por defecto y que el toggle a registro funcione correctamente.
- `e2e/auth.spec.js`: test E2E que verifica que un usuario no autenticado ve el login, y que puede navegar al formulario de registro.

## Casos de uso críticos
Priorizamos el flujo de autenticación porque es la puerta de entrada a toda la app: si falla, nada más funciona.
La validación de título de tarea se prioriza porque es la única regla de negocio no trivial del CRUD.

## Pipeline de CI/CD
El workflow corre en cada push/PR a `main`. El job `lint` corre primero por ser el más rápido y barato.
`test` corre los unitarios y el E2E en la misma etapa. `build` valida que el proyecto compile correctamente.
`deploy` solo se ejecuta si es un push directo a `main` (no en Pull Requests), para evitar desplegar
código que todavía no fue aprobado por revisión.

## Limitaciones y deuda técnica
- No se testea el flujo completo de CRUD contra Supabase real en el E2E (requeriría un usuario de
  prueba dedicado y limpieza de datos entre corridas) — se aceptó como riesgo consciente por el
  tiempo disponible del TP.
- La cobertura de tests es parcial: cubre los casos críticos (auth y validación) pero no todos los
  componentes de la aplicación.
- Durante el desarrollo surgieron problemas de configuración externos al código (Root Directory mal
  seteado en Vercel, Site URL de Supabase apuntando a localhost) que fueron identificados y
  documentados en su momento, y no afectan al funcionamiento actual de la app.