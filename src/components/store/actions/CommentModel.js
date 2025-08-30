import firebase from "../../../config/DB";

export const addComment = (comment) => {
  return (dispatch) => {
    firebase.firestore().collection('comments').add({
      ...comment
    }).then((docRef) => {
      dispatch({ 
        type: 'ADD_COMMENT_SUCCESS', 
        payload: { id: docRef.id, ...comment }
      });
    }).catch((error) => {
      dispatch({ type: 'ERROR', payload: error.message });
    });
  };
};

export const getComment = (field, value) => {
  return (dispatch) => {
      let query;
          if (field === 'id') {
            query = firebase.firestore().collection('comments').doc(value);
            query.onSnapshot(doc => {
              if (doc.exists) {
                dispatch({ type: 'GET_COMMENT', payload: { id: doc.id, ...doc.data() } });
              } else {
                dispatch({ type: 'GET_COMMENT', payload: null });
              }
              }, (error) => {
                dispatch({ type: 'ERROR', payload: error.message });
              });
            } else {
                // Fetch by field filter
                let collectionRef = firebase.firestore().collection('comments');
                collectionRef = (field && value)
                  ? collectionRef.where(field, '==', value)
                  : collectionRef.orderBy('createdAt', 'desc');
                collectionRef.onSnapshot(snapshot => {
                  const category = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                  }));
                  const payload = category.length === 1 ? category[0] : category;
                  dispatch({ type: 'GET_COMMENT', payload });
                }, (error) => {
                  dispatch({ type: 'ERROR', payload: error.message });
                });
              }
            }
};

export const updateComment = (Comment) => {
  return (dispatch, getState) => {
    firebase.firestore().collection('comments')
      .doc(Comment.id)
      .update({
        name: Comment.name,
        updatedAt: new Date()
      })
      .then(() => {
        dispatch({ type: 'UPDATE_COMMENT', payload: Comment });
      })
      .catch((err) => {
        dispatch({ type: 'UPDATE_COMMENT_ERROR', err });
      });
  };
};
export const deleteComment = (id) => {
  return (dispatch) => {
    firebase.firestore().collection('comments').doc(id)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_COMMENT', payload: { id } });
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: error.message });
      });
  };
};