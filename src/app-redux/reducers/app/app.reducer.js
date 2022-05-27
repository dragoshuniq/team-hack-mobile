// * Actions types
import * as TYPES from 'app-redux/actions/app/app.actions-types';

// * Default state
const defaultState = {
  isLoading: false,
  isSignedIn: false,
  hasResponse: null,
  response: null,
  location: null,
};

// * Reducer
export default function appReducer(state = {...defaultState}, action = {}) {
  switch (action.type) {
    case TYPES.SETTER: {
      return {...state, ...action.value};
    }

    default:
      return state;
  }
}
