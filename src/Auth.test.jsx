import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Auth from './Auth'

describe('Auth', () => {
  it('muestra el formulario de login por defecto', () => {
    render(<Auth />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('cambia a formulario de registro al hacer click', () => {
    render(<Auth />)
    fireEvent.click(screen.getByText('Crear cuenta nueva'))
    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
  })
})