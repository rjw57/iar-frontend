import { combineReducers } from 'redux';
import { authReducer as auth } from 'redux-implicit-oauth2';
import iarApi from './assetRegisterApi';
import deleteConfirmation from './deleteConfirmation';

/**
 * Combine all reducers used in the application together into one reducer.
 */
export default combineReducers({ auth, iarApi, deleteConfirmation });
