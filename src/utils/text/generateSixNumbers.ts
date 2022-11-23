export function generateSixNumbers() {
  var min = 100000
  var maxm = 999999
  return String(Math.floor(Math.random() * (maxm - min + 1)) + min)
}
