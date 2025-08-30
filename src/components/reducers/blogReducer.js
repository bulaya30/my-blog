const initState = {
  blogs: []
};

const BlogReducer = (state = initState, action) => {

  switch (action.type) {
    case 'ADD_BLOG_SUCCESS':
      return {
        ...state,
        blogs: [...state.blogs, action.payload], // consistent payload naming
        error: null
      };

    case 'GET_BLOG':
      return { 
        ...state, 
        blogs: action.payload
      };

    case 'UPDATE_BLOG': // optional helper
    console.log('Blog updated:', action.payload);
      return state
    case 'DELETE_BLOG': // optional helper
    console.log('Blog deleted:', action.payload);
      return state

    case 'ERROR':
      return { 
        ...state, 
        error: action.payload || action.error || 'Unknown error' 
      };

    default:
      return state;
  }
};

export default BlogReducer;
