import { TOKEN_TIMED_OUT } from '../actions/timeout';

export const initialState = {
  needNewLogin: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, needNewLogin: false };
    case TOKEN_TIMED_OUT:
      return { ...state, needNewLogin: true };
    default:
      return state;
  }
}
