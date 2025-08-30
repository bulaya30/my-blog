import firebase from "../../../config/DB";


export const addCategory = (category) => {
  return async (dispatch) => {
    try {
      // Check if category already exists
      const snapshot = await firebase.firestore()
        .collection('categories')
        .where('name', '==', category.name.trim())
        .get();

      if (!snapshot.empty) {
        // Category already exists
        dispatch({ type: 'CATEGORY_ERROR', payload: 'Category name already exists' });
        return {error : 'Category name already exists'};
      }

      // Add new category
      const docRef = await firebase.firestore()
        .collection('categories')
        .add({
          ...category,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      dispatch({ 
        type: 'ADD_CATEGORY_SUCCESS', 
        payload: { id: docRef.id, ...category }
      });
       return { success: true, category, error: null };

    } catch (error) {
      dispatch({ type: 'CATEGORY_ERROR', payload: error.message });
    }
  };
};

export const getCategory = (field, value) => {
  return (dispatch) => {
    let query;
    if (field === 'id') {
      query = firebase.firestore().collection('categories').doc(value);
      query.onSnapshot(doc => {
        if (doc.exists) {
          console.log('Category mpdel data ', {id: doc.id, ...doc.data()})
          dispatch({ type: 'GET_CATEGORY', payload: { id: doc.id, ...doc.data() } });
        } else {
          dispatch({ type: 'GET_CATEGORY', payload: null });
        }
      }, (error) => {
        dispatch({ type: 'CATEGORY_ERROR', payload: error.message });
      });
    } else {
      // Fetch by field filter
      let collectionRef = firebase.firestore().collection('categories');
      collectionRef = (field && value)
        ? collectionRef.where(field, '==', value)
        : collectionRef.orderBy('createdAt', 'desc');
      collectionRef.onSnapshot(snapshot => {
        const category = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const payload = category.length === 1 ? category[0] : category;
        dispatch({ type: 'GET_CATEGORY', payload });
      }, (error) => {
        dispatch({ type: 'CATEGORY_ERROR', payload: error.message });
      });
    }
  };
};


export const updateCategory = (category) => {
  return (dispatch, getState) => {
    firebase.firestore().collection('categories')
      .doc(category.id)
      .update({
        name: category.name,
        updatedAt: new Date()
      })
      .then(() => {
        dispatch({ type: 'UPDATE_CATEGORY', payload: category });
      })
      .catch((err) => {
        dispatch({ type: 'UPDATE_CATEGORY_ERROR', err });
      });
  };
};
export const deleteCategory = (id) => {
  return (dispatch) => {
    firebase.firestore().collection('categories').doc(id)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_CATEGORY', payload: { id } });
      })
      .catch((error) => {
        dispatch({ type: 'CATEGORY_ERROR', payload: error.message });
      });
  };
};