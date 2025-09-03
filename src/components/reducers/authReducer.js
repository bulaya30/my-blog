const initState = {
  authError: null,
  user: null,
};

const authReducer = (state = initState, action) => {

  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "LOGIN_AUTH":
    case "PROFILE_LOADED":
      return { ...state, authError: null, user: action.payload };
    case "LOGIN_ERROR":
      return { ...state, authError: "Wrong email address or password" };
    case "SIGNOUT_SUCCESS":
      return { ...state, user: null }; // clear user
    case "SIGNUP_SUCCESS":
      return { ...state, authError: null };
    case "SIGNUP_ERROR":
      return { ...state, authError: action.err.message };
    default:
      return state;
  }
};

export default authReducer;
