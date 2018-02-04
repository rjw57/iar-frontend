import React from 'react'; // used implicitly by JSX
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';
import CircularProgress from 'material-ui/CircularProgress';
import { getMoreAssets } from '../redux/actions';
import { connect } from 'react-redux';

/**
 * A component which requests more assets when it becomes visible. The request is only made if the
 * "next" URL is not the same as the "lastRequestedUrl" in the asset state. If there are more
 * assets loading, this component renders as a loading indicator.
 */
const GetMoreAssets = ({ nextUrl, shouldLoadMore, isLoading, getMoreAssets }) => (
  <VisibilitySensor
    active={shouldLoadMore}
    onChange={isVisible => { if(isVisible && shouldLoadMore) { getMoreAssets(nextUrl); } }}
  >
    <CircularProgress style={{visibility: isLoading ? 'visible' : 'hidden' }} />
  </VisibilitySensor>
);

GetMoreAssets.propTypes = {
  nextUrl: PropTypes.string,
  shouldLoadMore: PropTypes.bool.isRequired,
  getMoreAssets: PropTypes.func.isRequired,
}

const mapStateToProps = ({ iarApi }) => ({
  nextUrl: iarApi.assets.next,

  isLoading: iarApi.assets.isLoading,

  // The logic here is that we should only request more assets when the last requested URL is not
  // the current next URL.
  shouldLoadMore:
    (iarApi.assets.next !== null) && (iarApi.assets.lastRequestedUrl !== iarApi.assets.next),
});

const mapDispatchToProps = { getMoreAssets };

/**
 * An GetMoreAssets which is not connected to the redux store. Useful for testing.
 */
export const UnconnectedGetMoreAssets = GetMoreAssets;

export default connect(mapStateToProps, mapDispatchToProps)(GetMoreAssets);
