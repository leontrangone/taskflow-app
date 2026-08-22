# CALIDAD.md

## Estrategia general

Elegimos un pipeline con etapas dependientes: **lint → tests unitarios y E2E → build → deploy**,
donde cada etapa solo se ejecuta si la anterior pasó correctamente. El objetivo es detectar
errores lo antes posible (el lint es la verificación más rápida y barata) y garantizar que
únicamente código verificado llegue a producción. No alcanza con tener tests: también nos
importó que el flujo de trabajo en GitHub (issues, ramas, PRs con revisión) reflejara un
proceso ordenado y trazable.

## Herramientas seleccionadas

- **Vitest**: elegido por integrarse nativamente con Vite (mismo motor de bundling), lo que
  simplifica la configuración y acelera la ejecución respecto a alternativas como Jest.
- **Testing Library**: permite testear componentes desde la perspectiva del usuario (qué ve
  y qué puede hacer), en lugar de testear detalles internos de implementación.
- **Playwright**: elegido sobre Cypress por su instalación más simple en entornos de CI
  (`npx playwright install --with-deps`) y su soporte multi-navegador nativo.
- **GitHub Actions**: se integra directamente al repositorio sin necesidad de configurar un
  servicio externo, y permite usar secrets para manejar credenciales sensibles de forma segura.

## Tests desarrollados

- **`utils.test.js`** (unitario): valida la función `isValidTaskTitle`.
  - Rechaza un título vacío.
  - Rechaza un título compuesto solo por espacios.
  - Acepta un título válido.
- **`Auth.test.jsx`** (unitario, componente): valida el comportamiento del formulario de
  autenticación.
  - Muestra el formulario de login por defecto.
  - Cambia correctamente a formulario de registro al hacer click en "Crear cuenta nueva".
- **`e2e/auth.spec.js`** (end-to-end): valida el flujo principal de la aplicación desde la
  perspectiva de un usuario real en el navegador.
  - Un usuario no autenticado ve el formulario de login al ingresar a la app.
  - Un usuario puede navegar del login al formulario de registro.

## Casos de uso críticos

Priorizamos proteger el flujo de **autenticación** por ser la puerta de entrada a toda la
aplicación: si falla, ninguna otra funcionalidad es accesible. En segundo lugar, priorizamos
la **validación de título de tarea**, por ser la única regla de negocio no trivial dentro del
CRUD (evita que se creen tareas vacías o con solo espacios en blanco).

## Pipeline de CI/CD

El workflow (`ci.yml`) se dispara en cada push o Pull Request contra `main`, y ejecuta 4 jobs
encadenados mediante `needs`:

1. **lint**: corre primero por ser la verificación más rápida; no tiene sentido ejecutar tests
   sobre código que ni siquiera cumple las reglas básicas de estilo/sintaxis.
2. **test**: ejecuta en conjunto los tests unitarios (Vitest) y el test E2E (Playwright).
3. **build**: valida que el proyecto compile correctamente con las variables de entorno reales.
4. **deploy**: despliega a Vercel, pero **únicamente si el evento es un push directo a `main`**
   (no en Pull Requests). Esta decisión evita que se despliegue código que todavía no fue
   revisado y aprobado por el equipo.

Se verificó manualmente que el pipeline falla correctamente: se realizó un commit de prueba
rompiendo intencionalmente una aserción en `utils.test.js`, lo que provocó que el job `test`
fallara en rojo y frenara la ejecución de `build` y `deploy`. Luego se revirtió el cambio y
el pipeline volvió a pasar en verde.

## Limitaciones y deuda técnica

- El test E2E no cubre el flujo completo de CRUD contra una base de datos real (crear/editar/
  borrar una tarea), ya que requeriría un usuario de prueba dedicado y una estrategia de
  limpieza de datos entre corridas para no ensuciar la base de producción. Se aceptó como
  riesgo consciente por el tiempo disponible del TP.
- La cobertura de tests es parcial: cubre los casos más críticos (autenticación y validación
  de negocio) pero no llega a cubrir el 100% de los componentes de la aplicación.
- Durante el desarrollo surgieron problemas de configuración externos al código de la
  aplicación (Root Directory mal configurado en Vercel, Site URL de Supabase apuntando a
  localhost en producción, incompatibilidad entre la versión de Node del runner de CI y
  dependencias de jsdom). Todos fueron identificados, documentados y resueltos, y no
  representan errores pendientes en el código actual.