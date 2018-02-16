import Cache from '../cache';
import { Map } from 'immutable';
import reducer, { initialState } from './lookupApi';
import {
  PEOPLE_GET_SELF_REQUEST, PEOPLE_GET_SELF_SUCCESS, PEOPLE_GET_SUCCESS,
  PEOPLE_LIST_SUCCESS, INSTITUTIONS_LIST_SUCCESS
} from '../actions/lookupApi';

// test that the state is correctly initialised.
test('the state is correctly initialised', () => {
  const nextState = reducer(undefined, {});

  expect(nextState.peopleByCrsid instanceof Map).toBe(true);
  expect(nextState.matchingPeopleByQuery instanceof Cache).toBe(true);
});

// test that a people list result is cached
test('a people list result is cached', () => {

  const results = [
    {
      url: "http://localhost:8080/people/crsid/msb999",
      cancelled: false,
      identifier: {scheme: "crsid", value: "msb999"},
      visibleName: "M. Bamford"
    }
  ];

  const action = {
    type: PEOPLE_LIST_SUCCESS,
    meta: {query: 'msb9'},
    payload: {results: results, count: 1, offset: 0, limit: 10}
  };

  const nextState = reducer(initialState, action);

  expect(nextState.matchingPeopleByQuery.get('msb9')).toBe(results);
  // check the state wasn't mutated
  expect(Object.is(initialState.matchingPeopleByQuery, nextState.matchingPeopleByQuery)).toBe(false);
});

// test the people list cache doesn't grow beyond 20
test('the people list cache is pruned', () => {

  const results = [
    {
      url: "http://localhost:8080/people/crsid/msb999",
      cancelled: false,
      identifier: {scheme: "crsid", value: "msb999"},
      visibleName: "M. Bamford"
    }
  ];

  const action = {
    type: PEOPLE_LIST_SUCCESS,
    payload: {results: results, count: 1, offset: 0, limit: 10}
  };

  let nextState = initialState;
  for (let i = 0; i < 30; i++) {
      nextState = reducer(nextState, {...action, meta: {query: 'msb' + i}});
  }

  expect(nextState.matchingPeopleByQuery.size).toBe(20);
  expect(nextState.matchingPeopleByQuery.get('msb0')).not.toBeDefined();
  expect(nextState.matchingPeopleByQuery.get('msb10')).toBeDefined();
});

// check that a retrieved person model is set in peopleByCrsid
test('a retrieved person model is set in peopleByCrsid', () => {

  const payload = {
    url: "http://localhost:8080/people/crsid/msb999",
    cancelled: false,
    identifier: {scheme: "crsid", value: "msb999"},
    visibleName: "M. Bamford",
    isStaff: true,
    isStudent: false
  };

  const nextState = reducer(initialState, {type: PEOPLE_GET_SUCCESS, payload: payload});

  expect(nextState.peopleByCrsid.get('msb999')).toBe(payload);
  // check the state wasn't mutated
  expect(Object.is(initialState.peopleByCrsid, nextState.peopleByCrsid)).toBe(false);
});

// check that the selfLoading flag is set when the self is requested
test("the selfLoading flag is set", () => {

  const nextState = reducer(initialState, {type: PEOPLE_GET_SELF_REQUEST});

  expect(nextState.self).toBeNull();
  expect(nextState.selfLoading).toBe(true);
});

// check that the authenticated user's profile is set in self
test("the authenticated user's profile is set in self", () => {

  const payload = {
    url: "http://localhost:8080/people/crsid/msb999",
    cancelled: false,
    identifier: {scheme: "crsid", value: "msb999"},
    visibleName: "M. Bamford",
    isStaff: true,
    isStudent: false,
    institutions:[
      {instid:"CL",name:"Department of Computer Science and Technology"},
      {instid:"UIS",name:"University Information Services"}
    ]
  };

  const nextState = reducer(initialState, {type: PEOPLE_GET_SELF_SUCCESS, payload: payload});

  expect(nextState.self).toBe(payload);
  expect(nextState.selfLoading).toBe(false);
  // check the state wasn't mutated
  expect(Object.is(initialState.self, nextState.self)).toBe(false);
});

test('institutions are copied from institution list success action', () => {
  const initialState = reducer(undefined, { type: 'not-an-action' });
  expect(initialState.institutions.fetchedAt).toBeNull();
  expect(initialState.institutions.byInstid.get('AAA')).toBeUndefined();

  const action = {
    type: INSTITUTIONS_LIST_SUCCESS,
    payload: { results: [
      { instid: 'AAA', name: 'Dept of A' },
      { instid: 'BBB', name: 'Dept of B' },
    ] },
  };

  const nextState = reducer(initialState, action);

  expect(nextState.institutions.fetchedAt).not.toBeNull();
  expect(nextState.institutions.byInstid.get('AAA')).toEqual({ instid: 'AAA', name: 'Dept of A' });
  expect(nextState.institutions.byInstid.get('BBB')).toEqual({ instid: 'BBB', name: 'Dept of B' });
});
