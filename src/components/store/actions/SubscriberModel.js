import { db, firebase } from '../../../config/DB';

export const addSubscriber = (email) => {
  return async (dispatch) => {
    try {
      const docRef = db.collection('subscribers').doc(email);

      const doc = await docRef.get();
      if (doc.exists) {
        return { success: false, message: 'Email already subscribed' };
      }

      await docRef.set({
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: 'SUBSCRIBE_SUCCESS', payload: email });
      return { success: true, message: 'Subscription successful' };
    } catch (error) {
      dispatch({ type: 'SUBSCRIBE_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };
};
