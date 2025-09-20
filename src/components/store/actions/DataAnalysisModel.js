import { db, firebase } from "../../../config/DB";

export const addProject = (project) => {
  return async (dispatch) => {
    try {
      const docRef = await db.collection("projects").add({
        ...project,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updateddAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({
        type: "ADD_PROJECT_SUCCESS",
        payload: { id: docRef.id, ...project },
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

export const getProjects = (field, value) => {
  return (dispatch) => {
    const projectsRef = db.collection("projects");
    if (field === "id") {
      projectsRef.doc(value).onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            const projectData = {
              id: doc.id, ...data,
            };
            const author = await fetchAuthor(projectData.authorId);
            dispatch({ type: "GET_DATA_ANALYSIS_PROJECTS", payload: { ...projectData, author } });
          } else {
            dispatch({ type: "GET_BLOG", payload: null });
          }
        },
        (error) => dispatch({ type: "ANALYSIS_ERROR", payload: error.message })
      );
    } else {
      let queryRef = projectsRef;
      if (field && value) queryRef = queryRef.where(field, "==", value);
      else queryRef = queryRef.orderBy("updatedAt", "desc");

      queryRef.onSnapshot(async (snapshot) => {
        const projects = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, ...data,
          };
        });

        const uniqueAuthorIds = [...new Set(projects.map((b) => b.authorId))];
        const authorMap = await fetchAuthors(uniqueAuthorIds);

        const projectsWithAuthors = projects.map((project) => ({
          ...project,
          author: authorMap[project.authorId] || null,
        }));

        const payload =
          projectsWithAuthors.length === 1 ? projectsWithAuthors[0] : projectsWithAuthors;

        dispatch({ type: "GET_DATA_ANALYSIS_PROJECTS", payload });
      }, (error) => dispatch({ type: "ANALYSIS_ERROR", payload: error.message }));
    }
  };
};


export const updateProject = (project) => {
  return async  (dispatch) => {
    try {
      await firebase.firestore().collection('projects').doc(project.id)
      .update({
        ...project,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      dispatch({ type: 'UPDATE_ANALYSIS', payload: project });
       return { success: true };
    } catch (error) {
       dispatch({ type: 'ANALYSIS_ERROR', error })
       return {success: false, error: error.message}
    }
  };
};


/**
 * Delete a blog (only author or admin)
 */
export const deleteBlog = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const isAdmin = state.auth.isAdmin;
    const currentUid = firebase.auth().currentUser?.uid;

    const projectRef = db.collection("projects").doc(id);

    projectRef
      .get()
      .then((doc) => {
        if (!doc.exists) throw new Error("Project not found");

        const projectAuthorId = doc.data().authorId;

        if (isAdmin || projectAuthorId === currentUid) {
          return projectRef.delete();
        } else {
          throw new Error("You are not authorized to delete this project");
        }
      })
      .then(() => dispatch({ type: "DELETE_ANALYSIS", payload: id }))
      .catch((err) => dispatch({ type: "ANALYSIS_ERROR", payload: err.message }));
  };
};


/**
 * Helper functions
 */
export async function fetchAuthor(authorId) {
  if (!authorId) return null;
  try {
    const snap = await db.collection("users").doc(authorId).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  } catch {
    return null;
  }
}

async function fetchAuthors(authorIds) {
  const authorMap = {};
  await Promise.all(
    authorIds.map(async (id) => {
      const snap = await db.collection("users").doc(id).get();
      if (snap.exists) authorMap[id] = { id: snap.id, ...snap.data() };
    })
  );
  return authorMap;
}
