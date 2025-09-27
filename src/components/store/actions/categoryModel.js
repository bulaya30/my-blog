import firebase from "../../../config/DB";

/**
 * Add a new category
 */
export const addCategory = (category) => {
  return async (dispatch) => {
    try {
      // Check if category already exists
      const snapshot = await firebase
      .firestore()
      .collection("categories")
      .where("name", "==", category.name.trim())
        .get();
        
      if (!snapshot.empty) {
        const errorMsg = "Category name already exists";
        dispatch({ type: "CATEGORY_ERROR", payload: errorMsg });
        return { success: false, error: errorMsg };
      }
      
      // Add new category
      const docRef = await firebase
      .firestore()
      .collection("categories")
      .add({
          ...category,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        dispatch({
          type: "ADD_CATEGORY_SUCCESS",
        payload: { id: docRef.id, ...category },
      });

      return { success: true, category: { id: docRef.id, ...category }, error: null };
    } catch (error) {
      dispatch({ type: "CATEGORY_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Fetch categories
 */
export const getCategory = (field, value) => {
  return (dispatch) => {
    if (field === "id") {
      const docRef = firebase.firestore().collection("categories").doc(value);
      docRef.onSnapshot(
        (doc) => {
          dispatch({
            type: "GET_CATEGORY",
            payload: doc.exists ? { id: doc.id, ...doc.data() } : null,
          });
        },
        (error) => dispatch({ type: "CATEGORY_ERROR", payload: error.message })
      );
    } else {
      let collectionRef = firebase.firestore().collection("categories");
      collectionRef = field && value ? collectionRef.where(field, "==", value) : collectionRef.orderBy("createdAt", "desc");

      collectionRef.onSnapshot(
        (snapshot) => {
          const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const payload = categories.length === 1 ? categories[0] : categories;
          dispatch({ type: "GET_CATEGORY", payload });
        },
        (error) => dispatch({ type: "CATEGORY_ERROR", payload: error.message })
      );
    }
  };
};

/**
 * Update a category
 */
export const updateCategory = (category) => {
  return async (dispatch) => {
    try {
      await firebase.firestore().collection("categories").doc(category.id).update({
        name: category.name,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: "UPDATE_CATEGORY", payload: category });
      return { success: true };
    } catch (error) {
      dispatch({ type: "UPDATE_CATEGORY_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Delete a category
 */
export const deleteCategory = (id) => {
  return async (dispatch) => {
    try {
      await firebase.firestore().collection("categories").doc(id).delete();
      dispatch({ type: "DELETE_CATEGORY", payload: { id } });
      return { success: true };
    } catch (error) {
      dispatch({ type: "CATEGORY_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};
