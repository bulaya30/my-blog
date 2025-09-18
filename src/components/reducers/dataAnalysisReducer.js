const initialState = {
  projects: []
};

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_DATA_ANALYSIS_PROJECTS":
      return { ...state, projects: action.payload };
    case "ANALYSIS_ERROR":
      console.error(action.payload);
      return state;
    default:
      return state;
  }
}
