export function uniqBy<T, U>(arr: readonly T[], mapper: (item: T) => U): T[] {
  const map = new Map<U, T>()

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const key = mapper(item)

    if (!map.has(key)) {
      map.set(key, item)
    }
  }

  return Array.from(map.values())
}
