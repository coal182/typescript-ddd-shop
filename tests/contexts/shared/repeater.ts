import { IntegerMother } from './integer-mother';
export class Repeater {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static random(callable: Function, iterations: number) {
    return Array(iterations || IntegerMother.random(20))
      .fill({})
      .map(() => callable());
  }
}
