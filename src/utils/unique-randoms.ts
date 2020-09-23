import _ from "lodash";

export function uniqueRandoms(min: number, max: number, count: number): number[] {
  const set = new Set<number>()

  if (max - min < count) {
    return _.range(min, max)
  }

  while (set.size < count) {
    set.add(_.random(min, max))
  }

  return Array.from(set.values())
}
