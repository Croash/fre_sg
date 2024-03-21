const trampoline = f => (...args) => {
  let result = f(...args);
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

/**
 * 
 * @param {*} n 
 * @param {*} prevSum 
 * 
 * just like this
 * 
 * const sum0 = (n, prevSum = 0) => {
 * if (n <= 1) return n + prevSum;
 * return () => sum0(n-1, n + prevSum)
 * }
 * const sum = trampoline(sum0);
 * console.log(sum(1000000)); // 不会栈溢出
 * 
 */



export {
  trampoline // use to moni tail recursion
}