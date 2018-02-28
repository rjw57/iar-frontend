import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tokenTimedOut } from '../redux/actions/timeout';

//const TIMEOUT_HEAD_ROOM = 3590000; // milliseconds
const TIMEOUT_HEAD_ROOM = 120000; // milliseconds

class TokenTimeout extends Component {
  constructor(...args) {
    super(...args);

    this.timeoutID = null;
    this.expiresAt = null;

    const { auth } = this.props;
    this.handleNextAuth(auth);
  }

  handleNextAuth(auth) {
    if(!auth.isLoggedIn) {
      // cancel any pending timeout
      if(this.timeoutID !== null) {
        window.clearTimeout(this.timeoutID);
        this.timeoutID = null;
      }
    }

    // if expiresAt has changed, update timeout
    if(auth.expiresAt !== this.expiresAt) {
      // cancel any existing timeout
      if(this.timeoutID !== null) {
        window.clearTimeout(this.timeoutID);
        this.timeoutID = null;
      }

      // set a new timeout
      const now = (new Date()).getTime()
      const timeoutDelay = auth.expiresAt - now - TIMEOUT_HEAD_ROOM;

      // sanity check delay
      if(timeoutDelay < 0) {
        console.error('Token had very short timeout.');
        console.error('Expires at ' + new Date(auth.expiresAt));
        console.error('Now is ' + new Date(now));
        console.error('Head room ' + TIMEOUT_HEAD_ROOM / 1000 + ' seconds');
        console.error('Would therefore fire at ' + new Date(timeoutDelay + now));

        // token has therefore already timed out
        this.handleTimeout();
      }

      this.timeoutID = window.setTimeout(() => this.handleTimeout(), timeoutDelay);
    }
  }

  // Called before the token times out. Log the user in again.
  // TODO: check auth matches expected auth
  handleTimeout() {
    console.log('token timeout');
    this.props.tokenTimedOut();
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    this.handleNextAuth(auth);
  }

  render() { return null; }
};

TokenTimeout.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    expiresAt: PropTypes.number,
  }).isRequired,
  tokenTimedOut: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({ auth });

TokenTimeout = connect(mapStateToProps, { tokenTimedOut })(TokenTimeout);

export default TokenTimeout;
