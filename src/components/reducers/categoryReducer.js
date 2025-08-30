const initState = {
  categories: [],
  error: null,  // store errors here
};

const CategoryReducer = (state = initState, action) => {   
  switch(action.type) {
    case 'ADD_CATEGORY_SUCCESS': 
      return {
        ...state,
        categories: [...state.categories, action.payload],
        error: null // clear previous errors
      };

    case 'GET_CATEGORY':
      return { 
        ...state, 
        categories: action.payload,
      };

    case 'CATEGORY_ERROR': 
      return {
        ...state,
        error: action.payload // store the error
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
      };

    default: 
      return state;
  }
};

export default CategoryReducer;
