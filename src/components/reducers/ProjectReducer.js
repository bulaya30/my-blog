const initialState = {
  projects: []
};

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_PROJECT": 
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    case "GET_PROJECTS":
      return { ...state, projects: action.payload };
    case "UPDATE_PROJECT":
    case "DELETE_PROJECT":
      return state;
    case "PROJECT_ERROR":
      return state;
    default:
      return state;
  }
}
