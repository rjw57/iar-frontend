import React from 'react';
import { AppBar } from 'material-ui';
import '../style/App.css';

const TITLES = {
  '/static/what-is-asset': 'What is an information asset?',
  '/static/what-i-do': 'What do I need to do?',
  '/static/feedback': 'Feedback',
  '/static/contact': 'Contact',
  '/static/tcs': 'Terms & Conditions',
};

/*
  Renders the app bar of the IAR app's static pages.
 */
const StaticHeader = ({ title }) => (
  <div className="App-header">
    <AppBar title={ title } />
  </div>
);

/*
  Renders the IAR app's static pages.
 */
const Static = ({ match }) => (
  <div>
    <StaticHeader title={ TITLES[match.url] } />
    <div className="App-main">
      <h1>Copy for "{ TITLES[match.url] }"</h1>
    </div>
  </div>
);

export default Static;
