import React from 'react';

/**
 * Mock any troublesome components which don't play well with the DOM implementation in our test
 * suite.
 */

// need to mock the material-ui checkbox as we get 'TypeError: Cannot read property 'checked' of
// undefined' when rendered with react-test-renderer. see
// https://stackoverflow.com/questions/48465807/why-is-my-renderer-failing-when-using-material-ui-using-jest-and-react-test-rend
jest.mock('material-ui/Checkbox', () => () => <input type='check' />);

// GetMoreAssets needs mocking here because of the VisibilitySensor component it uses which requires
// more of the DOM to be present than is provided by our test suite.
jest.mock('../components/GetMoreAssets', () => () => <div />);
