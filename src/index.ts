
import { add } from './a'

const c = Math.random() * 100

const sum = add(1, 2)
console.log(sum, sum)

export default add(3, c)
export {
  sum, add
}