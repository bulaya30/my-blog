const initState = {
  comments: []
};

const CommentReducer = (state = initState, action) => {    
  switch(action.type) {
    case 'ADD_COMMENT_SUCCESS': 
      return {
        ...state,
        comments: [...state.comments, action.payload],
        error: null
      };
    case 'GET_COMMENT':
      return { 
        ...state, 
        comments: Array.isArray(action.payload)
          ? action.payload
          : [action.payload].filter(Boolean)
      };
    case 'ERROR': 
      return state;
    case 'UPDATE_COMMENT':
      return { ...state };
    case 'DELETE_COMMENT':
      return { ...state };
    default: 
      return state;
  }
};

export default CommentReducer;
