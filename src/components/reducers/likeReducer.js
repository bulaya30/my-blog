

const initState = {
    likes: []
}

const LikeReducer = (state = initState, action) => {    
    switch(action.type) {
        case 'ADD_LIKE_SUCCESS' : 
            return {
                ...state,
                likes: [...state.likes, action.payload],
                error: null
            };
        case 'GET_LIKE' :
            return { 
                ...state, 
                likes: action.payload,
            };
        case 'ERROR' : 
            return state
        case 'UPDATE_LIKE' :
            return {
                ...state,
            }
        case 'DELETE_LIKE' :
            return {
                ...state,
            }
        default : 
        return state
    }
}

export default LikeReducer