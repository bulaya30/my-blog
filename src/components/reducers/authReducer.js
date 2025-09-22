const initState = {
  authError: null,
  user: null,
  isAdmin: false,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };

    case "LOGIN_SUCCESS":
    case "LOGIN_AUTH":
    case "PROFILE_LOADED":
    case "SIGNUP_SUCCESS":   // ✅ now handled same as login
      return { ...state, authError: null, user: {...action.payload} };

    case "LOGIN_ERROR":
      return { ...state, authError: "Wrong email address or password" };

    case "SIGNOUT_SUCCESS":
      return { ...state, user: null };

    case "SIGNUP_ERROR":
      return { ...state, authError: action.err.message };

    default:
      return state;
  }
};

export default authReducer;
