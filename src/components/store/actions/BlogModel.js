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
    const lang = navigator.language.startsWith("fr") ? "fr" : "en";

    if (field === "id") {
      blogsRef.doc(value).onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            const blogData = {
              id: doc.id,
              title: data.title[lang] || data.title.en,
              content: data.content[lang] || data.content.en,
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
      if (field && value) queryRef = queryRef.where(field, "==", value);
      else queryRef = queryRef.orderBy("updatedAt", "desc");

      queryRef.onSnapshot(async (snapshot) => {
        const blogs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title[lang] || data.title.en,
            content: data.content[lang] || data.content.en,
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
          blogsWithAuthors.length === 1 ? blogsWithAuthors[0] : blogsWithAuthors;

        dispatch({ type: "GET_BLOG", payload });
      }, (error) => dispatch({ type: "ERROR", payload: error.message }));
    }
  };
};

export const addBlog = (blog) => {
  return async (dispatch) => {
    try {
      // Determine the language of the original submission
      const lang = blog.language || "en"; // default to English

      // Prevent duplicates: check title in the submitted language
      const titleField = lang === "en" ? "title.en" : "title.fr";
      const snapshot = await db
        .collection("blogs")
        .where(titleField, "==", lang === "en" ? blog.title.en.trim() : blog.title.fr.trim())
        .where("authorId", "==", blog.authorId.trim())
        .get();

      if (!snapshot.empty) {
        const msg = "A blog with this title and author already exists";
        dispatch({ type: "ERROR", payload: msg });
        return { success: false, error: msg };
      }

      // Translate title & content
      let title = {}, content = {};
      if (lang === "en") {
        title.en = blog.title.en.trim();
        content.en = blog.content.en.trim();
        title.fr = await translateText(title.en, "fr");
        content.fr = await translateText(content.en, "fr");
      } else {
        title.fr = blog.title.fr.trim();
        content.fr = blog.content.fr.trim();
        title.en = await translateText(title.fr, "en");
        content.en = await translateText(content.fr, "en");
      }

      // Save to Firestore
      const docRef = await db.collection("blogs").add({
        title,
        content,
        category: blog.category || "",
        authorId: blog.authorId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Notify admin
      const authorSnap = await db.collection("users").doc(blog.authorId).get();
      const author = authorSnap.exists ? authorSnap.data() : null;

      await dispatch(
        addNotification({
          title: "New Article",
          message: `${author?.firstName || ""} ${author?.lastName || ""} published a new article "${title[lang]}".`,
          type: "Publish",
        })
      );

      // Dispatch success
      dispatch({
        type: "ADD_BLOG_SUCCESS",
        payload: { id: docRef.id, title, content, category: blog.category, authorId: blog.authorId },
      });

      return { success: true, blog: { id: docRef.id, title, content }, error: null };
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
      const title = {};
      const content = {};

      try {
        if (blog.language === 'en') {
          title.en = blog.title.en;
          content.en = blog.content.en;
          title.fr = await translateText(blog.title.en, 'fr');
          content.fr = await translateText(blog.content.en, 'fr');
        } else {
          title.fr = blog.title.fr;
          content.fr = blog.content.fr;
          title.en = await translateText(blog.title.fr, 'en');
          content.en = await translateText(blog.content.fr, 'en');
        }
      } catch (translationError) {
        console.error('Translation failed:', translationError);
        if (!title.en) title.en = blog.title.en || '';
        if (!title.fr) title.fr = blog.title.fr || '';
        if (!content.en) content.en = blog.content.en || '';
        if (!content.fr) content.fr = blog.content.fr || '';
      }

      await db.collection('blogs').doc(id).update({
        title,
        content,
        category: blog.category,
        authorId: auth.currentUser.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({
        type: 'UPDATE_BLOG',
        payload: { id, title, content, category: blog.category, authorId: auth.currentUser.uid },
      });

      return { success: true };
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
      return { success: false, error: err.message };
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
