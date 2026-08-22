export function isValidTaskTitle(title) {
  return typeof title === 'string' && title.trim().length > 0
}