const initState = {
  authError: null,
  user: null,
};

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_PROFILE":
      console.log(action.payload)
      return {
        ...state,
        user: action.payload,  
      };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user : action.payload,
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
