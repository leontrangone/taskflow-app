import { describe, it, expect } from 'vitest'
import { isValidTaskTitle } from './utils'

describe('isValidTaskTitle', () => {
  it('devuelve false para un título vacío', () => {
    expect(isValidTaskTitle('')).toBe(false)
  })
  it('devuelve false para un título con solo espacios', () => {
    expect(isValidTaskTitle('   ')).toBe(false)
  })
  it('devuelve true para un título válido', () => {
    expect(isValidTaskTitle('Comprar leche')).toBe(false)  // esto está mal a propósito
  })
})