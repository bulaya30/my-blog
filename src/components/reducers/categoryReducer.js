

const initState = {
    categories: []
}

const CategoryReducer = (state = initState, action) => {    
    switch(action.type) {
        case 'ADD_CATEGORY_SUCCESS' : 
            return {
                ...state,
                categories: [...state.categories, action.payload], // consistent payload naming
                error: null
            };
        case 'GET_CATEGORY' :
            // console.log('Get category from Reducer:', action.payload);
            return { 
                ...state, 
                categories: action.payload,
            };
        case 'ERROR' : 
            return state
        case 'UPDATE_CATEGORY' :
            console.log('Category updated:', action.payload);
            return {
                ...state,
            }
        case 'DELETE_CATEGORY' :
            return {
                ...state,
            }
        default : 
        return state
    }
}

export default CategoryReducer