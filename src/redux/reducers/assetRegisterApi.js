import {
  ASSETS_LIST_REQUEST, ASSETS_LIST_SUCCESS, ASSETS_LIST_FAILURE,
  ASSETS_DELETE_SUCCESS
} from '../actions/assetRegisterApi';

const ASSET_LIST_ENDPOINT = 'http://localhost:8080/assets/';

/**
 * State managed by the asset API reducers.
 *
 * This state mirrors the REST API endpoints.
 */
export const initialState = {
  // Current list of asset summaries fetched from .../assets/ endpoint.
  assets: {
    // The URL which resulted in the current state of this object.
    url: null,

    // True if there is currently a request in flight to refresh/extend this list.
    isLoading: false,

    // If not-null, this URL should be used to fetch results to add to the end of the current asset
    // list in order to extend it.
    next: ASSET_LIST_ENDPOINT,

    // If not-null, this URL should be used to fetch results to add to the beginning of the current
    // asset list in order to extend it.
    previous: null,

    // List of asset summaries. These are objects which just contain the { url } field of the
    // assets. This is used to defined the *ordering* of the assets and their existence or
    // otherwise in the list but nothing more.
    summaries: [ ],
  },

  // An object which maps asset URLs to the underlying asset object.
  assetsByUrl: { },
}

export default (state = initialState, action) => {
  switch(action.type) {
    case ASSETS_LIST_REQUEST:
      return {...state, assets: { ...state.assets, isLoading: true } };
    case ASSETS_LIST_SUCCESS: {
      const prevAssets = state.assets;
      const { next, previous, results } = action.payload;
      const { url } = action.meta;

      // By default, replace summaries with summaries from payload. The summary is just an object
      // with the url extracted.
      let nextSummaries = results.map(({ url }) => ({ url }));

      if(url === prevAssets.next) {
        // This was a request to extend asset list forward.
        nextSummaries = [...prevAssets.summaries, ...nextSummaries];
      } else if(url === state.previous) {
        // This was a request to extend asset list backward.
        nextSummaries = [...nextSummaries, ...prevAssets.summaries];
      }

      return { ...state,
        assets: {
          ...prevAssets,
          url, next, previous,
          isLoading: false,
          summaries: nextSummaries,
        },

        // construct new mapping of urls -> assets
        assetsByUrl: {
          ...state.assetsByUrl,

          // an object whose fields are the urls of the assets returned in our results and whose
          // values are those assets.
          ...results.reduce((obj, asset) => { obj[asset.url] = asset; return obj; }, {}),
        }
      };
    }
    case ASSETS_LIST_FAILURE:
      // Should probably do a bit more here...
      return {...state, assets: { ...state.assets, isLoading: false } };

    case ASSETS_DELETE_SUCCESS:
      return {
        ...state, assets: {
          ...state.assets,
          summaries: state.assets.summaries.filter(asset => asset.url !== action.meta.url),
        }
      };
    default:
      return state;
  }
};
