import { db, firebase } from '../../../config/DB';
import { addNotification } from './NotificationsModel';

export const addSubscriber = (email) => {
  return async (dispatch) => {
    try {
      const docRef = db.collection('subscribers').doc(email);

      const doc = await docRef.get();
      if (doc.exists) {
        return { success: false, message: 'Email already subscribed' };
      }

      await db.collection('subscribers').add({
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await dispatch(addNotification({
        title: "New Subscriber",
        message: `A new user ${email} just subscribed.`,
        type: "subscription",
      }));
      dispatch({ type: 'SUBSCRIBE_SUCCESS', payload: email });
      return { success: true, message: 'Subscription successful' };
    } catch (error) {
      dispatch({ type: 'SUBSCRIBE_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };
};
