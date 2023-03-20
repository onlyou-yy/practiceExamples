// const Fibonacci1 = (n) => {
//   if (n <= 1) return 1;
//   return Fibonacci1(n - 1) + Fibonacci1(n - 2);
// }
// console.time("1 time10")
// Fibonacci1(10) //0.041
// console.timeEnd("1 time10")

// console.time("1 time40")
// Fibonacci1(40) //1.016
// console.timeEnd("time40")

// console.time("1 time100")
// Fibonacci1(100);//爆栈
// console.timeEnd("1 time100")

const Fibonacci2 = (n, sum1 = 1, sum2 = 1) => {
  if (n <= 1) return sum2;
  return Fibonacci2(n - 1, sum2, sum1 + sum2)
}
console.time("2 time10")
Fibonacci2(10) //0.046
console.timeEnd("2 time10")

console.time("2 time40")
Fibonacci2(40) //0.005
console.timeEnd("2 time40")

console.time("2 time100")
Fibonacci2(100);//0.007
console.timeEnd("2 time100")