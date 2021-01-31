const hs = (i, j, k) =>
  k != null && j != null
    ? '.' + i + '.' + k
    : j != null
    ? '.' + i + '.' + j
    : k != null
    ? '.' + k
    : '.' + i

export const hashfy = c => {
  const out = {}
  // 什么时候会有两层arr fiber出现??
  isArr(c)
    ? c.forEach((v, i) =>
        isArr(v)
          ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
          : (out[hs(i, null, v.key)] = v)
      )
    : (out[hs(0, null, c.key)] = c)
  return out
}
