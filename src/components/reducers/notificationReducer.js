const initialState = {
  notifications: [], // start as empty array
  error: null,
};

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_NOTIFICATION':
      return { ...state, notifications: action.payload };
    case 'NOTIFICATION_SUCCESS':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'NOTIFICATION_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
