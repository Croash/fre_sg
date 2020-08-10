export const getTime = () => performance.now()

export function shouldYield() {
  return getTime() >= frameDeadline
}

export const frameLength = 1000 / 60
