import React from 'react'; // used implicitly by JSX
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';
import AssetListItem from '../components/AssetListItem';
import { connect } from 'react-redux';

/**
 * A table showing the assets currently in the asset summary table. 
 */
const AssetTable = ({ assetSummaries }) => (
  <div className="Asset-table">
    <Table
      fixedHeader={true}
      selectable={false}
    >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Status</TableHeaderColumn>
          <TableHeaderColumn>Department</TableHeaderColumn>
          <TableHeaderColumn>Private</TableHeaderColumn>
          <TableHeaderColumn>Last edited</TableHeaderColumn>
          <TableHeaderColumn>&nbsp;</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        showRowHover={true}
        displayRowCheckbox={false}
        className="Asset-table-body"
      >
        { assetSummaries.map(asset => <AssetListItem key={asset.url} assetUrl={asset.url} />) }
      </TableBody>
    </Table>
  </div>
);

AssetTable.propTypes = {
  assetSummaries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = ({ iarApi }) => ({
  assetSummaries: iarApi.assets.summaries,
});

export default connect(mapStateToProps)(AssetTable);
