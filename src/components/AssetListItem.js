import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { confirmDelete } from '../redux/actions/deleteConfirmation';

import {TableRow, TableRowColumn} from 'material-ui/Table';
import { RaisedButton } from 'material-ui';
import TickIcon from 'material-ui/svg-icons/action/done';

const AssetListItem = ({assetUrl, assetsByUrl, confirmDelete}) => {
  const asset = assetsByUrl ? assetsByUrl[assetUrl] : null;
  if(!asset) {
    console.error('Asset ' + assetUrl + ' could not be found in assetsByUrl');
    return <div />;
  }
  return (
    <TableRow hoverable={true}>
      <TableRowColumn><Link to={'/asset/' + asset.id}>{asset.name}</Link></TableRowColumn>
      <TableRowColumn>{asset.status}</TableRowColumn>
      <TableRowColumn>{asset.department}</TableRowColumn>
      <TableRowColumn>{asset.private ? <TickIcon/> : ""}</TableRowColumn>
      <TableRowColumn>{asset.updated_at}</TableRowColumn>
      <TableRowColumn>
        <RaisedButton onClick={() => confirmDelete(asset.url)}>Delete</RaisedButton>
      </TableRowColumn>
    </TableRow>
  );
};

AssetListItem.propTypes = {
  assetUrl: PropTypes.string.isRequired,
  assetsByUrl: PropTypes.object.isRequired,
  confirmDelete: PropTypes.func.isRequired,
};

const mapStateToProps = ({ iarApi }) => ({
  assetsByUrl: iarApi.assetsByUrl,
});

const mapDispatchToProps = { confirmDelete };

export default connect(mapStateToProps, mapDispatchToProps)(AssetListItem);
