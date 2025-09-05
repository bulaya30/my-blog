import { db, firebase, auth } from "../../../config/DB";
import { addNotification } from "./NotificationsModel";
import { translateText } from "../../../translator/Translator";

/**
 * Fetch a single blog or a list of blogs
 * Returns the content in user's language automatically (EN or FR)
 */
export const getBlog = (field, value) => {
  return (dispatch) => {
    const blogsRef = db.collection("blogs");

    // Auto detect browser language
    const lang = navigator.language.startsWith("fr") ? "fr" : "en";

    if (field === "id") {
      blogsRef.doc(value).onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            const blogData = {
              id: doc.id, 
              title: lang === "fr" ? data.title_fr : data.title_en,
              content: lang === "fr" ? data.content_fr : data.content_en,
              authorId: data.authorId,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt || null,
            };
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
      if (field && value) {
        queryRef = queryRef.where(field, "==", value);
      } else {
        queryRef = queryRef.orderBy("createdAt", "desc");
      }

      queryRef.onSnapshot(
        async (snapshot) => {
          const blogs = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: lang === "fr" ? data.title_fr : data.title_en,
              content: lang === "fr" ? data.content_fr : data.content_en,
              authorId: data.authorId,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt || null,
            };
          });

          const uniqueAuthorIds = [...new Set(blogs.map((b) => b.authorId))];
          const authorMap = await fetchAuthors(uniqueAuthorIds);

          const blogsWithAuthors = blogs.map((blog) => ({
            ...blog,
            author: authorMap[blog.authorId] || null,
          }));

          const payload =
            blogsWithAuthors.length === 1
              ? blogsWithAuthors[0]
              : blogsWithAuthors;

          dispatch({ type: "GET_BLOG", payload });
        },
        (error) => dispatch({ type: "ERROR", payload: error.message })
      );
    }
  };
};

/**
 * Add a new blog
 * Automatically translates English → French
 */
export const addBlog = (blog) => {
  return async (dispatch) => {
    try {
      // Prevent duplicates
      const snapshot = await db
        .collection("blogs")
        .where("title_en", "==", blog.title.trim())
        .where("authorId", "==", blog.authorId.trim())
        .get();

      if (!snapshot.empty) {
        const msg = "A blog with this title and author already exists";
        dispatch({ type: "ERROR", payload: msg });
        return { success: false, error: msg };
      }

      // Auto-translate
      const title_fr = await translateText(blog.title, "fr");
      const content_fr = await translateText(blog.content, "fr");

      const docRef = await db.collection("blogs").add({
        ...blog,
        title_en: blog.title,
        content_en: blog.content,
        title_fr,
        content_fr,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      const author = await fetchAuthor(blog.authorId);
      await dispatch(
        addNotification({
          title: "New Article",
          message: `${author?.firstName || ""} ${
            author?.lastName || ""
          } published a new Article "${blog.title}".`,
          type: "Publish",
        })
      );

      dispatch({
        type: "ADD_BLOG_SUCCESS",
        payload: { id: docRef.id, ...blog, title_fr, content_fr },
      });

      return {
        success: true,
        blog: { id: docRef.id, ...blog, title_fr, content_fr },
        error: null,
      };
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Update a blog
 * Automatically re-translates English → French if title/content change
 */
export const updateBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      const title_fr = await translateText(blog.title, "fr");
      const content_fr = await translateText(blog.content, "fr");

      await db.collection("blogs").doc(id).update({
        ...blog,
        title_en: blog.title,
        content_en: blog.content,
        title_fr,
        content_fr,
        authorId: auth.currentUser.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({
        type: "UPDATE_BLOG",
        payload: { id, ...blog, title_fr, content_fr },
      });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
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

    const blogRef = db.collection("blogs").doc(id);

    blogRef
      .get()
      .then((doc) => {
        if (!doc.exists) throw new Error("Blog not found");

        const blogAuthorId = doc.data().authorId;

        if (isAdmin || blogAuthorId === currentUid) {
          return blogRef.delete();
        } else {
          throw new Error("You are not authorized to delete this blog");
        }
      })
      .then(() => dispatch({ type: "DELETE_BLOG", payload: id }))
      .catch((err) => dispatch({ type: "ERROR", payload: err.message }));
  };
};

/**
 * Helper functions
 */
async function fetchAuthor(authorId) {
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
