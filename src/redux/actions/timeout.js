export const TOKEN_TIMED_OUT = Symbol('TOKEN_TIMED_OUT');

export const tokenTimedOut = () => ({
  type: TOKEN_TIMED_OUT,
});
