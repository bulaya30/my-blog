
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
