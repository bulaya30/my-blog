
const initialState = {
  subscribers: [],
  error: null,
};

const subscriberReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUBSCRIBE_SUCCESS':
      return {
        ...state,
        subscribers: [...state.subscribers, action.payload],
        error: null,
      };
      case 'GET_SUBSCRIBER':
      return { 
        ...state, 
        subscribers: action.payload,
      };

    case 'DELETE_SUBSCRIBER': 
      return {
        ...state
      };

    case 'SUBSCRIBE_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default subscriberReducer;
