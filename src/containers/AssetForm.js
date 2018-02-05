import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { RadioButton, RadioButtonGroup, TextField } from 'material-ui';
import { AssetFormHeader, BooleanChoice, CheckboxGroup, Lookup } from '../components'
import Page from '../containers/Page';
import { connect } from 'react-redux';
import { snackbarOpen } from '../redux/actions/snackbar';
import { loadDraft, patchDraft } from '../redux/actions/editAsset';
import CircularProgress from 'material-ui/CircularProgress';

import {
  DATA_SUBJECT_LABELS, DATA_CATEGORY_LABELS, RISK_TYPE_LABELS,
  DIGITAL_STORAGE_SECURITY_LABELS, PAPER_STORAGE_SECURITY_LABELS
} from '../data/assetRegisterApi';

/**
 * Form for creating/editing an asset.
 */
class AssetForm extends Component {
  componentDidMount() {
    // Load draft asset from asset URL.
    const { loadDraft, url } = this.props;
    loadDraft(url);
  }

  // Either creates a new asset or updates an existing one depending on whether the current draft
  // has a URL.
  saveDraft() {
    const { draft } = this.props;
    console.log('Save', draft);
  }

  render() {
    const { isLoading = false, draft, draft: { url, name }, patchDraft } = this.props;

    return (<Page>
      <AssetFormHeader
        onClick={() => this.saveDraft()}
        title={
          isLoading ? '' : (url ? 'Editing' : 'Creating') + ': ' + (name ? name : 'Untitled asset')
        }
      />
      {
        // If the current draft is being loaded over the network, render a progress indicator
        // rather than showing the form.
        isLoading
        ? <div style={{textAlign: 'center'}}><CircularProgress size={80} /></div>
        : renderAssetForm({ draft, patchDraft })
      }
    </Page>);
  }
};

AssetForm.propTypes = {
  isLoading: PropTypes.bool,
  draft: PropTypes.object.isRequired,
  patchDraft: PropTypes.func.isRequired,
}

const renderAssetForm = ({ draft = {}, patchDraft }) => {
  // Most components simply patch their value back into the asset by wiring up onChange to this
  // convenience event handler.
  const handleChange = (event, value) => {
    patchDraft({ [event.target.name]: value === '' ? null : value });
  }

  // Unpack current draft into individual fields. Provide *display* defaults.
  const {
    name = '',
    department = '',
    purpose = '',
    research = '',
    owner = '',
    private: is_private = null,
    personal_data = null,
    data_subject = [],
    data_category = [],
    recipients_category = '',
    recipients_outside_eea = '',
    retention = null,
    retention_other = '',
    risk_type = [],
    storage_location = '',
    storage_format = [],
    paper_storage_security = [],
    digital_storage_security = [],
  } = draft;

  return (<div>
    <div className="App-grid-container App-grid-2">
      <div className="App-grid-item">
        <TextField
          hintText="Asset name"
          name='name'
          value={name}
          onChange={handleChange}
        />
      </div>
      <div className="App-grid-item">
        <TextField
          hintText="Asset department"
          name='department'
          value={department}
          onChange={handleChange}
        />
      </div>
      <div className="App-grid-item">
        <TextField
          hintText="Purpose of holding this asset"
          name='purpose'
          value={purpose}
          onChange={handleChange}
        />
      </div>
      <div className="App-grid-item"/>
      <div className="App-grid-item">
        Is this for research purposes?
      </div>
      <div className="App-grid-item">
        <BooleanChoice name="research" value={research} onChange={handleChange} />
      </div>
      <div className="App-grid-item">
        <Lookup
          disabled={!research}
          hintText="Principle Investigator"
          name="owner"
          value={owner}
          onChange={handleChange}
          fetch={(...args) => console.log('Lookup fetch:', ...args)}
        />
      </div>
      <div className="App-grid-item"/>
      <div className="App-grid-item">
        Is this data private to the department?
      </div>
      <div className="App-grid-item">
        <BooleanChoice name="private" value={is_private} onChange={handleChange} />
      </div>
      <div className="App-grid-item">
        Does this asset hold any Personal Data?
      </div>
      <div className="App-grid-item">
        <BooleanChoice name="personal_data" value={personal_data} onChange={handleChange} />
      </div>
    </div>

    <CheckboxGroup
      title='Who does this Personal Data belong to?'
      name='data_subject'
      labels={DATA_SUBJECT_LABELS}
      values={data_subject}
      onChange={handleChange}
      disabled={!personal_data}
    />

    <CheckboxGroup
      title='What kind of personal data is held?'
      name='data_category'
      labels={DATA_CATEGORY_LABELS}
      values={data_category}
      onChange={handleChange}
      columns="2"
      disabled={!personal_data}
    />

    <div className="App-grid-container App-grid-2">
      <div className="App-grid-item">
        <TextField
          hintText="Who is the asset shared with?"
          name='recipients_category'
          value={recipients_category}
          onChange={handleChange}
          disabled={!personal_data}
        />
      </div>
      <div className="App-grid-item">
        <TextField
          hintText="Is the asset shared outside of the EEA? If so, to whom?"
          name='recipients_outside_eea'
          value={recipients_outside_eea}
          onChange={handleChange}
          disabled={!personal_data}
          style={{ width: 400 }}
        />
      </div>
    </div>

    <div style={{padding: '20px 0'}}>How long will this asset be retained for?</div>
    <div className="App-grid-container App-grid-1">
      <RadioButtonGroup
        name="retention"
        valueSelected={retention}
        onChange={handleChange}
      >
        <RadioButton disabled={!personal_data} style={style.retention}
                     value="<=1" label="Less than 1 year" />
        <RadioButton disabled={!personal_data} style={style.retention}
                     value=">1,<=5" label="1 - 5 years" />
        <RadioButton disabled={!personal_data} style={style.retention}
                     value=">5,<=10" label="6 - 10 years" />
        <RadioButton disabled={!personal_data} style={style.retention}
                     value=">10,<=75" label="10 - 75 years" />
        <RadioButton disabled={!personal_data} style={style.retention}
                     value="forever" label="Forever" />
        <RadioButton disabled={!personal_data} style={{...style.retention, borderWidth: '1px'}}
                     value="other" label="Other"  />
      </RadioButtonGroup>
    </div>

    <div className="App-grid-container App-grid-1">
      <div className="App-grid-item">
        <TextField
          hintText="Other retention period"
          name="retention_other"
          disabled={retention !== 'other'}
          value={retention_other}
          onChange={handleChange}
        />
      </div>
    </div>

    <CheckboxGroup
      title='What are the risks of holding this information asset?'
      name="risk_type"
      labels={RISK_TYPE_LABELS}
      values={risk_type}
      onChange={handleChange}
    />

    <div className="App-grid-container App-grid-1">
      <div className="App-grid-item">
        <TextField
          hintText="Where is the asset stored?"
          name="storage_location"
          value={storage_location}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="App-grid-container App-grid-2">
      <div className="App-grid-item">
        What format is the asset stored in?
      </div>
      <div className="App-grid-item">
        <RadioButtonGroup
          name="storage_format"
          valueSelected={storage_format ? storage_format.sort().toString() : ''}
          onChange={(event, value) => patchDraft({storage_format: value.split(',')})}
          style={style.storageFormatGroup}
        >
          <RadioButton value="digital" label="Digital" style={style.storageFormatButton} />
          <RadioButton value="paper" label="Paper" style={style.storageFormatButton} />
          <RadioButton value="digital,paper" label="Both" style={style.storageFormatButton} />
        </RadioButtonGroup>
      </div>
    </div>

    <CheckboxGroup
      title='What are the risks of holding this information asset?'
      labels={DIGITAL_STORAGE_SECURITY_LABELS}
      name="digital_storage_security"
      values={digital_storage_security ? digital_storage_security : []}
      onChange={handleChange}
      disabled={storage_format.indexOf("digital") === -1}
    />
    <CheckboxGroup
      labels={PAPER_STORAGE_SECURITY_LABELS}
      name="paper_storage_security"
      values={paper_storage_security ? paper_storage_security : []}
      onChange={handleChange}
      disabled={storage_format.indexOf("paper") === -1}
    />
  </div>);
};

export const UnconnectedAssetForm = AssetForm;

const mapStateToProps = ({ editAsset: { draft, isLoading } }) => ({ draft, isLoading });

const mapDispatchToProps = { loadDraft, patchDraft, handleMessage: snackbarOpen };

export default connect(mapStateToProps, mapDispatchToProps)(AssetForm);

/**
 * Custom styling for specific components.
 */
const style = {
  retention: {
    borderWidth: '1px 1px 0',
    borderStyle: 'solid',
    borderColor: '#d1d1d1',
    padding: '10px 20px'
  },

  storageFormatGroup: {
    display: 'flex',
    borderLeft: '1px solid #d1d1d1'
  },

  storageFormatButton: {
    width: 'auto',
    borderWidth: '1px 1px 1px 0',
    borderStyle: 'solid',
    borderColor: '#d1d1d1',
    padding: "10px 20px"
  },
};
