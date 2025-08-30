const initState = {
  authError: null,
  user: null,
};

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,  
      };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: {
          ...state.profile,       // keep existing profile data
          ...action.payload,      // merge updates
        },
      };

    case "UPDATE_PROFILE_ERROR":
      return {
        ...state,
        authError: action.err.message,
      };

    default:
      return state;
  }
};

export default UserReducer;
