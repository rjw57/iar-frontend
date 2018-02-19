import { RSAA } from 'redux-api-middleware';

export const PEOPLE_LIST_REQUEST = Symbol('PEOPLE_LIST_REQUEST');
export const PEOPLE_LIST_SUCCESS = Symbol('PEOPLE_LIST_SUCCESS');
export const PEOPLE_LIST_FAILURE = Symbol('PEOPLE_LIST_FAILURE');

export const PEOPLE_GET_REQUEST = Symbol('PEOPLE_GET_REQUEST');
export const PEOPLE_GET_SUCCESS = Symbol('PEOPLE_GET_SUCCESS');
export const PEOPLE_GET_FAILURE = Symbol('PEOPLE_GET_FAILURE');

export const PEOPLE_GET_SELF_REQUEST = Symbol('PEOPLE_GET_SELF_REQUEST');
export const PEOPLE_GET_SELF_SUCCESS = Symbol('PEOPLE_GET_SELF_SUCCESS');
export const PEOPLE_GET_SELF_FAILURE = Symbol('PEOPLE_GET_SELF_FAILURE');
export const PEOPLE_GET_SELF_RESET = Symbol('PEOPLE_GET_SELF_RESET');

export const ENDPOINT_PEOPLE = process.env.REACT_APP_ENDPOINT_LOOKUP + 'people';

/**
 * Fetch a list of people.
 *
 * @param query the search text used to search for people.
 * @param limit the max size of the list to return (default 10).
 */
export const listPeople = (query, limit = 10) => {
  const the_limit = parseInt(limit, 10);
  if (!the_limit || the_limit <= 0) {
    throw new Error('the limit must be > 0');
  }
  return {
    [RSAA]: {
      endpoint: ENDPOINT_PEOPLE + "?limit=" + the_limit + "&query=" + encodeURIComponent(query),
      method: 'GET',
      types: [
        {type: PEOPLE_LIST_REQUEST, meta: {query}},
        {type: PEOPLE_LIST_SUCCESS, meta: {query}},
        {type: PEOPLE_LIST_FAILURE, meta: {query}},
      ]
    }
  }
};

/**
 * Fetch a person by their CRSID.
 */
export const getPeople = (crsid) => ({
  [RSAA]: {
    endpoint: ENDPOINT_PEOPLE + '/crsid/' + crsid,
    method: 'GET',
    types: [PEOPLE_GET_REQUEST, PEOPLE_GET_SUCCESS, PEOPLE_GET_FAILURE]
  }
});

/**
 * Fetch the authenticated user's profile.
 */
export const getSelf = () => ({
  [RSAA]: {
    endpoint: ENDPOINT_PEOPLE + '/token/self?fetch=all_insts',
    method: 'GET',
    types: [PEOPLE_GET_SELF_REQUEST, PEOPLE_GET_SELF_SUCCESS, PEOPLE_GET_SELF_FAILURE]
  }
});

/**
 * Reset the authenticated user's profile.
 */
export const resetSelf = () => ({
  type: PEOPLE_GET_SELF_RESET,
});
