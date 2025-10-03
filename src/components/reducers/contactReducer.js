const initialState = {
  loading: false,
  success: false,
  error: null,
  messages: [] // for admin list
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONTACT_REQUEST':
    case 'CONTACTS_REQUEST':
      return { ...state, loading: true, error: null, success: false };

    case 'CONTACT_SUCCESS':
      return { ...state, loading: false, success: true };
    case 'DELETE_CONTACT':
      return { ...state};

    case 'CONTACTS_SUCCESS':
      return { ...state, loading: false, messages: action.payload };

    case 'CONTACT_ERROR':
    case 'CONTACTS_ERROR':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default contactReducer;
