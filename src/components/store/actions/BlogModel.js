import { db, firebase } from "../../../config/DB";
import { addNotification } from "./NotificationsModel";

/**
 * Fetch a single blog or list of blogs
 */
export const getBlog = (field, value) => {
  return (dispatch) => {
    const blogsRef = db.collection("blogs");

    if (field === "id") {
      blogsRef.doc(value).onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            const blogData = { id: doc.id, ...data };
            const author = await fetchAuthor(blogData.authorId);
            dispatch({ type: "GET_BLOG", payload: { ...blogData, author } });
          } else {
            dispatch({ type: "GET_BLOG", payload: null });
          }
        },
        (error) => dispatch({ type: "ERROR", payload: error.message })
      );
    } else {
      let queryRef = blogsRef;
      if (field && value) queryRef = queryRef.where(field, "==", value);
      else queryRef = queryRef.orderBy("updatedAt", "desc");

      queryRef.onSnapshot(
        async (snapshot) => {
          const blogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const uniqueAuthorIds = [...new Set(blogs.map((b) => b.authorId))];
          const authorMap = await fetchAuthors(uniqueAuthorIds);

          const blogsWithAuthors = blogs.map((blog) => ({
            ...blog,
            author: authorMap[blog.authorId] || null,
          }));

          const payload = blogsWithAuthors.length === 1 ? blogsWithAuthors[0] : blogsWithAuthors;
          dispatch({ type: "GET_BLOG", payload });
        },
        (error) => dispatch({ type: "ERROR", payload: error.message })
      );
    }
  };
};

/**
 * Add a new blog
 */
export const addBlog = (blog) => {
  return async (dispatch, getState) => {
    const state = getState();
    const admin = state.auth.isAdmin;

    try {
      const titleField = "title.en";
      const snapshot = await db
        .collection("blogs")
        .where(titleField, "==", blog.title.en.trim())
        .where("authorId", "==", blog.authorId.trim())
        .get();

      if (!snapshot.empty) {
        const msg = "A blog with this title and author already exists";
        dispatch({ type: "ERROR", payload: msg });
        return { success: false, error: msg };
      }

      const docRef = await db.collection("blogs").add({
        ...blog,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      const authorSnap = await db.collection("users").doc(blog.authorId).get();
      const author = authorSnap.exists ? authorSnap.data() : null;

      await dispatch(
        addNotification({
          title: "New Article",
          message: admin
            ? `You have published a new article "${blog.title.en}".`
            : `${author?.firstName} ${author?.lastName} published a new article "${blog.title.en}".`,
          type: "Publish",
        })
      );

      dispatch({ type: "ADD_BLOG_SUCCESS", payload: { id: docRef.id, ...blog } });
      return { success: true, ...blog, error: null };
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Update a blog
 */
export const updateBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      await db.collection("blogs").doc(id).update({
        ...blog,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: "UPDATE_BLOG", payload: { id, ...blog } });
      return { success: true };
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      return { success: false, error: err.message };
    }
  };
};

/**
 * Delete a blog
 */
export const deleteBlog = (id) => {
  return async (dispatch, getState) => {
    const state = getState();
    const isAdmin = state.auth.isAdmin;
    const currentUid = firebase.auth().currentUser?.uid;

    try {
      const doc = await db.collection("blogs").doc(id).get();

      if (!doc.exists) throw new Error("Blog not found");

      const blogAuthorId = doc.data().authorId;

      if (!isAdmin && blogAuthorId !== currentUid) {
        throw new Error("You are not authorized to delete this blog");
      }

      await db.collection("blogs").doc(id).delete();
      dispatch({ type: "DELETE_BLOG", payload: id });

      return { success: true };
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
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
