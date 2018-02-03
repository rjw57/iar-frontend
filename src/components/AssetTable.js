import React from 'react'; // used implicitly by JSX
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AssetListItem from '../components/AssetListItem';
import { connect } from 'react-redux';

/**
 * A table showing the assets currently in the asset summary table.
 *
 * The unconnected component is exported by name.
 */
export const AssetTable = ({ assetSummaries, isLoadingAssets = false }) => (
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
        {
          // Display a "no assets" row if there is no loading happening and there are no assets.
          ((assetSummaries.length === 0) && !isLoadingAssets) ? <ZeroAssetsRow /> : null
        }
        { assetSummaries.map(asset => <AssetListItem key={asset.url} assetUrl={asset.url} />) }
      </TableBody>
    </Table>
  </div>
);

AssetTable.propTypes = {
  assetSummaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoadingAssets: PropTypes.bool,
};

/**
 * Table row which is displayed when there are no assets in the current list.
 */
export const ZeroAssetsRow = () => (
  <TableRow>
    <TableRowColumn colSpan={6} style={{textAlign: 'center'}}>
      There are no assets to display
    </TableRowColumn>
  </TableRow>
);

const mapStateToProps = ({ iarApi }) => ({
  assetSummaries: iarApi.assets.summaries,
  isLoadingAssets: iarApi.assets.isLoading,
});

export default connect(mapStateToProps)(AssetTable);
