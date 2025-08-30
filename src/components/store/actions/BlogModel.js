import { db, firebase, auth } from "../../../config/DB";


export const getBlog = (field, value) => {
  return (dispatch) => {
    const blogsRef = db.collection('blogs');

    if (field === 'id') {
      // Fetch single document by ID
      blogsRef.doc(value).onSnapshot(
        (doc) => {
          if (doc.exists) {
            dispatch({ type: 'GET_BLOG', payload: { id: doc.id, ...doc.data() } });
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
        (snapshot) => {
          const blogs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          // If only one blog matches, send just the object; otherwise send array
          const payload = blogs.length === 1 ? blogs[0] : blogs;
          dispatch({ type: 'GET_BLOG', payload });
        },
        (error) => {
          dispatch({ type: 'ERROR', payload: error.message });
        }
      );
    }
  };
};


export const addBlog = (blog) => {
  return (dispatch, getState) => {

    firebase.firestore().collection('blogs').add({
      ...blog,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
      dispatch({ 
        type: 'ADD_BLOG_SUCCESS', 
        payload: { id: docRef.id, ...blog }
      });
    }).catch((error) => {
      dispatch({ type: 'ERROR', payload: error.message });
    });
  };
};

export const updateBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      console.log('Current user: ', auth.currentUser.uid)
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

