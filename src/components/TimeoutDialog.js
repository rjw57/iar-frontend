import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { connect } from 'react-redux';
import { login, logout } from '../redux/actions/auth';

/**
 * A modal dialogue box that asks for confirmation before deleting an asset.
 *
 * The dialogue box is "open" when the URL of the asset being considered for deletion is truthy.
 */
const TimeoutDialog = ({ isOpen, login, logout }) => (
  <Dialog open={isOpen}>
    <DialogTitle>Session has timed out</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Your session has timed out. Please sign in to continue.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={logout}>
        Sign out
      </Button>
      <Button color="primary" onClick={login}>
        Sign in with Raven
      </Button>
    </DialogActions>
  </Dialog>
);

TimeoutDialog.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = ({ timeout: { needNewLogin } }) => ({ isOpen: needNewLogin });

const mapDispatchToProps = { login, logout };

export default connect(mapStateToProps, mapDispatchToProps)(TimeoutDialog);
