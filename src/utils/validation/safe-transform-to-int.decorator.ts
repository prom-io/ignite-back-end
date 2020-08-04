import { Transform } from "class-transformer";
import _ from "lodash"

export function SafeTransformToInt() {
  return Transform(value => {
    if (value === "" || value === null || value === undefined) {
      return undefined
    }

    const intValue = parseInt(value, 10)

    return _.isInteger(intValue) ? intValue : undefined
  })
}
