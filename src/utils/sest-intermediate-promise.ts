import { promisify } from "util";

export const setImmediatePromise = promisify(setImmediate);
