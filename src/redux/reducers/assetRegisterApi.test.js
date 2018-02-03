import reducer, { initialState } from './assetRegisterApi';
import { ASSETS_LIST_SUCCESS, ASSETS_DELETE_SUCCESS } from '../actions/assetRegisterApi';

test('asset list response updates replaces list if url does not match next or prev', () => {
  const previousState = { ...initialState,
    assets: { ...initialState.assets, summaries: [{url: 'x'}, {url: 'y'}] },
  };
  const action = { type: ASSETS_LIST_SUCCESS, meta: { url: 'zzz' }, payload: {
    next: 'xxx', previous: 'yyy', results: [{url: 'a'}, {url: 'b'}] } };
  const nextState = reducer(initialState, action);
  expect(nextState.assets.next).toBe('xxx');
  expect(nextState.assets.previous).toBe('yyy');
  expect(nextState.assets.summaries).toEqual([{url: 'a'}, {url: 'b'}]);
});

test('asset delete response deletes asset', () => {
  const previousState = { ...initialState,
    assets: { ...initialState.assets, summaries: [{url: 'x'}, {url: 'y'}, {url: 'z'}] },
  };
  const action = { type: ASSETS_DELETE_SUCCESS, meta: { url: 'y' } };
  const nextState = reducer(previousState, action);
  expect(nextState.assets.summaries).toEqual([{url: 'x'}, {url: 'z'}]);
});
