import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { connect } from 'react-redux';
import { getAssetList } from '../redux/actions';

/**
 * Extends the list of assets when isVisible prop becomes true. Caches the last requested "next"
 * URL in state to avoid multiple requests. If isVisible becomes true and nextUrl is "null", then
 * the asset list is re-fetched from the start.
 */
class AssetListLoader extends Component {
  constructor(props) {
    super(props);
    this.state = { didRequestList: false, lastUrl: null };
  }

  render() {
    const { children } = props;
    return <div>{ children }</div>
  }
}

const mapStateToProps = ({ iarApi }) => ({
  nextUrl: iarApi.assets.next
});

const mapDispatchToProps = { getAssetList };

export default connect(mapStateToProps, mapDispatchToProps)(AssetList);
