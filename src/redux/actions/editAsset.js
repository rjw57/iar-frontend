import { getAsset } from './assetRegisterApi';

export const NEW_DRAFT = Symbol('NEW_DRAFT');
export const PATCH_DRAFT = Symbol('PATCH_DRAFT');
export const LOAD_DRAFT_REQUEST = Symbol('LOAD_DRAFT_REQUEST');
export const LOAD_DRAFT_RESPONSE = Symbol('LOAD_DRAFT_RESPONSE');

/**
 * Load an existing asset into the draft. If the asset is present in the global assets.assetsByUrl
 * map then it is used directly, otherwise fetch the asset using the API. If the url is undefined
 * or null, start a new draft.
 *
 * Implemented as a thunk action so requires the redux-thunk middleware.
 */
export const loadDraft = (url = null) => (dispatch, getState) => {
  // If no url was provided, start an empty draft.
  if(url === null) { dispatch(newDraft({ })); return; }

  // Attempt to extract the asset from assetsByUrl
  const { assets: { assetsByUrl } } = getState();
  const assetRecord = assetsByUrl.get(url);

  if(assetRecord) {
    // If we succeeded, start the new draft immeditely.
    dispatch(newDraft(assetRecord.asset));
  } else {
    // Fetch the asset from the API.
    dispatch(loadDraftRequest(url));
    dispatch(getAsset(url))
    .then(() => {
      const { assets: { assetsByUrl } } = getState();
      const assetRecord = assetsByUrl.get(url);
      if(assetRecord) {
        dispatch(loadDraftResponse(assetRecord.asset));
      } else {
        // TODO: show error in snackbar?
      }
    });
  }
};

/**
 * Internal action dispatched by loadDraft when a network request has been made.
 */
const loadDraftRequest = url => ({
  type: LOAD_DRAFT_REQUEST,
  payload: { url },
});

/**
 * Internal action dispatched by loadDraft when a network response has been received.
 */
const loadDraftResponse = asset => ({
  type: LOAD_DRAFT_RESPONSE,
  payload: { asset },
});

/**
 * Replace the current asset draft. Have the url field of the asset be set if this is editing a
 * current asset, otherwise a new asset will be created.
 */
export const newDraft = (draft = {}) => ({
  type: NEW_DRAFT,
  payload: { draft },
});

/**
 * Update some field(s) in the current draft.
 */
export const patchDraft = patch => ({
  type: PATCH_DRAFT,
  payload: { patch },
});
