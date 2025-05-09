export function useIdGenerator() {
  function generateId(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  return { generateId }
}
