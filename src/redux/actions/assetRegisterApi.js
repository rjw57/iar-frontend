import { RSAA } from 'redux-api-middleware';

export const ASSETS_LIST_REQUEST = Symbol('ASSETS_LIST_REQUEST');
export const ASSETS_LIST_SUCCESS = Symbol('ASSETS_LIST_SUCCESS');
export const ASSETS_LIST_FAILURE = Symbol('ASSETS_LIST_FAILURE');

export const ASSETS_DELETE_SUCCESS = Symbol('ASSETS_DELETE_SUCCESS');
export const ASSETS_DELETE_REQUEST = Symbol('ASSETS_DELETE_REQUEST');
export const ASSETS_DELETE_FAILURE = Symbol('ASSETS_DELETE_FAILURE');

export const getMoreAssets = (url) => ({
  [RSAA]: {
    endpoint: url,
    method: 'GET',
    types: [
      { type: ASSETS_LIST_REQUEST, meta: { url } },
      { type: ASSETS_LIST_SUCCESS, meta: { url } },
      { type: ASSETS_LIST_FAILURE, meta: { url } },
    ],
  }
});

export const deleteAsset = (url) => ({
  [RSAA]: {
    endpoint: url,
    method: 'DELETE',
    types: [
      { type: ASSETS_DELETE_REQUEST, meta: { url } },
      { type: ASSETS_DELETE_SUCCESS, meta: { url } },
      { type: ASSETS_DELETE_FAILURE, meta: { url } },
    ]
  }
});
