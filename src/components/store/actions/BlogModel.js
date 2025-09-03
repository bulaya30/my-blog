import { db, firebase, auth } from "../../../config/DB";

export const getBlog = (field, value) => {
  return (dispatch) => {
    const blogsRef = db.collection('blogs');

    if (field === 'id') {
      // Fetch single document by ID
      blogsRef.doc(value).onSnapshot(
        async (doc) => {
          if (doc.exists) {
            const blogData = { id: doc.id, ...doc.data() };
            const author = await fetchAuthor(blogData.authorId);
            dispatch({ type: 'GET_BLOG', payload: { ...blogData, author } });
          } else {
            dispatch({ type: 'GET_BLOG', payload: null });
          }
        },
        (error) => {
          dispatch({ type: 'ERROR', payload: error.message });
        }
      );
    } else {
      // Fetch collection by field filter or get all ordered by createdAt
      let queryRef = blogsRef;
      if (field && value) {
        queryRef = queryRef.where(field, '==', value);
      } else {
        queryRef = queryRef.orderBy('createdAt', 'desc');
      }

      queryRef.onSnapshot(
        async (snapshot) => {
          const blogs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          // Fetch all authors in parallel (batch)
          const uniqueAuthorIds = [...new Set(blogs.map(b => b.authorId))];
          const authorMap = await fetchAuthors(uniqueAuthorIds);

          // Attach author to each blog
          const blogsWithAuthors = blogs.map(blog => ({
            ...blog,
            author: authorMap[blog.authorId] || null
          }));

          // If only one blog matches, send object; else send array
          const payload = blogsWithAuthors.length === 1 
            ? blogsWithAuthors[0] 
            : blogsWithAuthors;

          dispatch({ type: 'GET_BLOG', payload });
        },
        (error) => {
          dispatch({ type: 'ERROR', payload: error.message });
        }
      );
    }
  };
};

// Helper to fetch one author
async function fetchAuthor(authorId) {
  if (!authorId) return null;
  try {
    const snap = await db.collection('users').doc(authorId).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error('Error fetching author', err);
    return null;
  }
}

// Helper to fetch multiple authors
async function fetchAuthors(authorIds) {
  const authorMap = {};
  await Promise.all(authorIds.map(async id => {
    const snap = await db.collection('users').doc(id).get();
    if (snap.exists) authorMap[id] = { id: snap.id, ...snap.data() };
  }));
  return authorMap;
}

export const addBlog = (blog) => {
  return async (dispatch) => {
    try {
      // Check if a blog with same title and author exists
      const snapshot = await firebase.firestore()
      .collection('blogs')
      .where('title', '==', blog.title.trim())
      .where('authorId', '==', blog.authorId.trim())
      .get();

      if (!snapshot.empty) {
        // Blog already exists
        dispatch({ type: 'ERROR', payload: 'A blog with this title and author already exists' });
        return { error: 'A blog with this title and author already exists' };
      }
      // Add new blog
      const docRef = await firebase.firestore()
        .collection('blogs')
        .add({
          ...blog,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      dispatch({ 
        type: 'ADD_BLOG_SUCCESS', 
        payload: { id: docRef.id, ...blog }
      });

      return { success: true, blog: { id: docRef.id, ...blog }, error: null };

    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};


export const updateBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      await db.collection('blogs')
        .doc(id)
        .update({
          ...blog,
          authorId: auth.currentUser.uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      dispatch({ type: 'UPDATE_BLOG', payload: { id, ...blog } });
      
    } catch (err) {
      console.error('Error updating blog:', err);
      dispatch({ type: 'ERROR', payload: err.message });
    }
  };
};

export const deleteBlog = (id) => {
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid;
    const blogRef = firebase.firestore().collection('blogs').doc(id);

    blogRef.get().then(doc => {
      if (doc.exists && doc.data().authorId === uid) {
        return blogRef.delete();
      } else {
        throw new Error("You are not authorized to delete this blog");
      }
    })
    .then(() => {
      dispatch({ type: 'DELETE_BLOG' });
    })
    .catch((err) => {
      dispatch({ type: 'ERROR', payload: err.message });
    });
  };
};

