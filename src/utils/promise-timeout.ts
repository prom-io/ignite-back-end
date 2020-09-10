export class PromiseTimeoutError extends Error {}

/**
 * @throws {PromiseTimeoutError}
 * 
 * @example
 * ```ts
 * const user = await promiseTimeout(this.usersRepository.findOne(), 10000)
 * 
 * // you can also catch the timeout error
 * const user = await promiseTimeout(this.usersRepository.findOne(), 10000)
 *   .catch(err => {
 *       if (err instanceof PromiseTimeoutError) {
 *           throw new InternalServerErrorException("Database request is processing more than 10000ms")
 *       }
 *   })
 * ```
 */
export function promiseTimeout<T = any>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const promiseWithTimeout = new Promise((resolve) => setTimeout(() => resolve({timeout: true}), timeoutMs))

  return Promise.race([
      promise.then(result => ({ result })),
      promiseWithTimeout,
    ]).then((result: {result: T} | { timeout: boolean }) => {
      if ("result" in result) {
        return result.result
      } else {
        throw new PromiseTimeoutError(`Timeout of ${timeoutMs}ms exceeded`)
      }
    })
}
