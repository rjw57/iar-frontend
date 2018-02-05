import {
  NEW_DRAFT, PATCH_DRAFT, LOAD_DRAFT_REQUEST, LOAD_DRAFT_RESPONSE
} from '../actions/editAsset';

export const initialState = {
  // The current asset draft being edited. If the url field is set then the asset is editing an
  // existing asset, otherwise it is a new asset
  draft: { },

  // True if the draft is currently being loaded from the API. If this is true then draft.url
  // points to the asset being loaded but no other fields are populated.
  isLoading: false,
};

export default (state = initialState, action) => {
  switch(action.type) {
    case NEW_DRAFT:
      // replace the entire draft
      return { ...state, draft: action.payload.draft };
    case LOAD_DRAFT_REQUEST: {
      // a new draft is loading
      const { url } = action.payload;
      return { ...state, draft: { url }, isLoading: true };
    }
    case LOAD_DRAFT_RESPONSE: {
      // draft was loaded (or it failed)
      const { asset } = action.payload;
      return { ...state, draft: asset, isLoading: false };
    }
    case PATCH_DRAFT:
      // update fields in the current draft
      return { ...state, draft: { ...state.draft, ...action.payload.patch } };
    default:
      return state;
  }
}
