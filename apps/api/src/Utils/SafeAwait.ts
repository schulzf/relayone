export const safeAwait = async <T, E = Error>(promise: Promise<T>): Promise<{ result: T; error: null } | { result: null; error: E }> => {
  try {
    const result = await promise;

    return { result, error: null };
  } catch (error) {
    return { result: null, error: error as E };
  }
};

export const safeReturn = <T, E = Error>(fn: () => T): { result: T; error: null } | { result: null; error: E } => {
  try {
    return { result: fn(), error: null };
  } catch (error) {
    return { result: null, error: error as E };
  }
};
