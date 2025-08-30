import firebase from "../../../config/DB";

export const addLike = (like) => {
  return (dispatch) => {
    firebase.firestore().collection('likes').add({
      ...like
    }).then((docRef) => {
      dispatch({ 
        type: 'ADD_LIKE_SUCCESS', 
        payload: { id: docRef.id, ...like } // lowercase 'like'
      });
    }).catch((error) => {
      dispatch({ type: 'ERROR', payload: error.message });
    });
  };
};

export const getLike = (field, value) => {
  return (dispatch) => {
    let query;
        if (field === 'id') {
          query = firebase.firestore().collection('likes').doc(value);
          query.onSnapshot(doc => {
            if (doc.exists) {
              dispatch({ type: 'GET_LIKE', payload: { id: doc.id, ...doc.data() } });
            } else {
              dispatch({ type: 'GET_LIKE', payload: null });
            }
            }, (error) => {
              dispatch({ type: 'ERROR', payload: error.message });
            });
          } else {
              // Fetch by field filter
              let collectionRef = firebase.firestore().collection('likes');
              collectionRef = (field && value)
                ? collectionRef.where(field, '==', value)
                : collectionRef.orderBy('createdAt', 'desc');
              collectionRef.onSnapshot(snapshot => {
                const category = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
                const payload = category.length === 1 ? category[0] : category;
                dispatch({ type: 'GET_LIKE', payload });
              }, (error) => {
                dispatch({ type: 'ERROR', payload: error.message });
              });
            }
          }
};

export const updateLike = (like) => {
  return (dispatch) => {
    firebase.firestore().collection('likes')
      .doc(like.id)
      .update({
        ...like,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        dispatch({ type: 'UPDATE_LIKE', payload: like });
      })
      .catch((err) => {
        dispatch({ type: 'ERROR', err });
      });
  };
};

export const deleteLike = (id) => {
  return (dispatch) => {
    firebase.firestore().collection('likes').doc(id)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_LIKE', payload: { id } });
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: error.message });
      });
  };
};
