import { db, firebase } from "../../../config/DB";
import axios from "axios";
import { addNotification } from "./NotificationsModel";

/**
 * Add a new project
 */
export const addProject = (project) => {
  return async (dispatch, getState) => {
    const state = getState();
    const admin = state.auth.isAdmin;

    try {
      // Handle Cloudinary photo upload
      if (project.photo instanceof File) {
        const formData = new FormData();
        formData.append("file", project.photo);
        formData.append("upload_preset", "projects");
        formData.append("folder", "projects");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dzoaynyni/image/upload",
          formData
        );
        project.photo = cloudinaryResponse.data.secure_url;
      }

      // Clean undefined/null values
      const cleanedProject = Object.fromEntries(
        Object.entries(project).filter(([_, v]) => v != null)
      );

      const docRef = await db.collection("projects").add({
        ...cleanedProject,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Notify admin
      const authorSnap = await db.collection("users").doc(project.authorId).get();
      const author = authorSnap.exists ? authorSnap.data() : null;

      await dispatch(
        addNotification({
          title: "New Project",
          message: admin
            ? `You have published a new project "${cleanedProject.title}".`
            : `${author?.firstName} ${author?.lastName} published a new project "${cleanedProject.title}".`,
          type: "Publish",
        })
      );

      dispatch({ type: "ADD_PROJECT", payload: { id: docRef.id, ...cleanedProject } });
      return { success: true };
    } catch (error) {
      dispatch({ type: "PROJECT_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Fetch projects (single or list)
 */
export const getProjects = (field, value) => {
  return (dispatch) => {
    const projectsRef = db.collection("projects");

    if (field === "id") {
      projectsRef.doc(value).onSnapshot(
        async (doc) => {
          if (!doc.exists) {
            dispatch({ type: "GET_PROJECTS", payload: null });
            return;
          }
          const projectData = { id: doc.id, ...doc.data() };
          const author = await fetchAuthor(projectData.authorId);
          dispatch({ type: "GET_PROJECTS", payload: { ...projectData, author } });
        },
        (error) => dispatch({ type: "PROJECT_ERROR", payload: error.message })
      );
    } else {
      let queryRef = projectsRef;
      if (field && value) queryRef = queryRef.where(field, "==", value);
      else queryRef = queryRef.orderBy("updatedAt", "desc");

      queryRef.onSnapshot(
        async (snapshot) => {
          const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const uniqueAuthorIds = [...new Set(projects.map((p) => p.authorId))];
          const authorMap = await fetchAuthors(uniqueAuthorIds);
          const projectsWithAuthors = projects.map((project) => ({
            ...project,
            author: authorMap[project.authorId] || null,
          }));
          const payload =
            projectsWithAuthors.length === 1 ? projectsWithAuthors[0] : projectsWithAuthors;
          dispatch({ type: "GET_PROJECTS", payload });
        },
        (error) => dispatch({ type: "PROJECT_ERROR", payload: error.message })
      );
    }
  };
};

/**
 * Update a project
 */
export const updateProject = (project) => {
  return async (dispatch) => {
    try {
      let updatedProject = { ...project };

      // Cloudinary photo upload
      if (updatedProject.photo instanceof File) {
        const formData = new FormData();
        formData.append("file", updatedProject.photo);
        formData.append("upload_preset", "projects");
        formData.append("folder", `projects/${project.id}`);

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dzoaynyni/image/upload",
          formData
        );
        updatedProject.photo = cloudinaryResponse.data.secure_url;
      }

      const cleanedProject = Object.fromEntries(
        Object.entries(updatedProject).filter(([_, v]) => v != null)
      );

      await db.collection("projects").doc(project.id).update({
        ...cleanedProject,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: "UPDATE_PROJECT", payload: cleanedProject });
      return { success: true };
    } catch (error) {
      dispatch({ type: "PROJECT_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Delete a project (author or admin)
 */
export const deleteProject = (id) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const isAdmin = state.auth.isAdmin;
      const currentUid = firebase.auth().currentUser?.uid;

      const projectRef = db.collection("projects").doc(id);
      const doc = await projectRef.get();

      if (!doc.exists) throw new Error("Project not found");

      const projectAuthorId = doc.data().authorId;
      if (!isAdmin && projectAuthorId !== currentUid) {
        throw new Error("You are not authorized to delete this project");
      }

      // Delete the project document
      await projectRef.delete();

      dispatch({ type: "DELETE_PROJECT", payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: "PROJECT_ERROR", payload: err.message });
      return { success: false, error: err.message };
    }
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
