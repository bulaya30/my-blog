const initialState = {
  projects: []
};

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_DATA_ANALYSIS_PROJECTS":
      return { ...state, projects: action.payload };
    case "UPDATE_ANALYSIS":
    case "DELETE_ANALYSIS":
      return state;
    case "ANALYSIS_ERROR":
      return state;
    default:
      return state;
  }
}
