// mock any components which are troublesome in our test suite
import '../test/mocks';

import React from 'react';
import { AppBar, Typography } from 'material-ui';
import {createMockStore, DEFAULT_INITIAL_STATE, render} from '../testutils';
import AppRoutes from './AppRoutes';
import NotFoundPage from './NotFoundPage';

const appBarTitle = testInstance => (
  testInstance.findByType(AppBar).findByType(Typography).props.children
);

/**
 * Simple unit test which assert that routes generate pages with the correct titles.
 */

test('can render /static/what-is-asset', () => {
  const testInstance = render(<AppRoutes/>, {url: '/static/what-is-asset'});

  expect(appBarTitle(testInstance)).toBe('What is an information asset?')
});

test('can render /static/what-i-do', () => {
  const testInstance = render(<AppRoutes/>, {url: '/static/what-i-do'});

  expect(appBarTitle(testInstance)).toBe('What do I need to do?')
});

test('can render /static/feedback', () => {
  const testInstance = render(<AppRoutes/>, {url: '/static/feedback'});

  expect(appBarTitle(testInstance)).toBe('Feedback')
});

test('can render /static/contact', () => {
  const testInstance = render(<AppRoutes/>, {url: '/static/contact'});

  expect(appBarTitle(testInstance)).toBe('Contact')
});

test('can render /static/tcs', () => {
  const testInstance = render(<AppRoutes/>, {url: '/static/tcs'});

  expect(appBarTitle(testInstance)).toBe('Terms & Conditions')
});

test('can render /assets/dept', () => {
  const testInstance = render(<AppRoutes/>, {url: '/assets/dept'});

  expect(appBarTitle(testInstance)).toBe('Assets: My department')
});

test('can render /assets/all', () => {
  const testInstance = render(<AppRoutes/>, {url: '/assets/all'});

  expect(appBarTitle(testInstance)).toBe('Assets: All')
});

test('/ redirects to /assets/dept', () => {
  const testInstance = render(<AppRoutes/>, {url: '/'});

  expect(appBarTitle(testInstance)).toBe('Assets: My department')
});

test('can render /asset/create', () => {
  const testInstance = render(<AppRoutes/>, {url: '/asset/create'});

  expect(testInstance.findByType(AppBar).props.title).toBe('Create new asset')
});

test('can render /asset/e20f4cd4-9f97-4829-8178-476c7a67eb97', () => {

  const assetsByUrl = new Map([[
    'http://localhost:8000/assets/e20f4cd4-9f97-4829-8178-476c7a67eb97/', {
      asset: {name: 'Super Secret Medical Data'}
    }
  ]]);

  const testInstance = render(<AppRoutes/>, {
    url: '/asset/e20f4cd4-9f97-4829-8178-476c7a67eb97',
    store: createMockStore({...DEFAULT_INITIAL_STATE, assets: {assetsByUrl}})
  });

  expect(testInstance.findByType(AppBar).props.title).toBe('Editing: Super Secret Medical Data')
});

test('/this-does-not-exist renders a not found page', () => {
  const testInstance = render(<AppRoutes/>, {url: '/this-does-not-exist'});

  expect(testInstance.findByType(NotFoundPage)).toBeDefined()
});
