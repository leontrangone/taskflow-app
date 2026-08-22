import { test, expect } from '@playwright/test'

test('usuario no autenticado ve el formulario de login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Iniciar sesión')).toBeVisible()
})

test('usuario puede cambiar a formulario de registro', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Crear cuenta nueva').click()
  await expect(page.getByRole('heading', { name: 'Registrarse' })).toBeVisible()
})