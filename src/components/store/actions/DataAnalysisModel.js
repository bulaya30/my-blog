import { db } from "../../../config/DB"

export const getProjects = () => {
  return (dispatch) => {
    db.collection("data_analysis_projects")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const projects = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          dispatch({ type: "GET_DATA_ANALYSIS_PROJECTS", payload: projects });
        },
        (error) => dispatch({ type: "ANALYSIS_ERROR", payload: error.message })
      );
  };
};
