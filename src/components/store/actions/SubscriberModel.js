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


export const getSubscribers = (field, value) => {
  return (dispatch) => {
    let query;
    if (field === 'id') {
      query = firebase.firestore().collection('subscribers').doc(value);
      query.onSnapshot(doc => {
        if (doc.exists) {
          dispatch({ type: 'GET_SUBSCRIBER', payload: { id: doc.id, ...doc.data() } });
        } else {
          dispatch({ type: 'GET_SUBSCRIBER', payload: null });
        }
      }, (error) => {
        dispatch({ type: 'SUBCRIBER_ERROR', payload: error.message });
      });
    } else {
      // Fetch by field filter
      let collectionRef = firebase.firestore().collection('subscribers');
      collectionRef = (field && value)
        ? collectionRef.where(field, '==', value)
        : collectionRef.orderBy('createdAt', 'desc');
      collectionRef.onSnapshot(snapshot => {
        const subscribers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const payload = subscribers.length === 1 ? subscribers[0] : subscribers;
        dispatch({ type: 'GET_SUBSCRIBER', payload });
      }, (error) => {
        dispatch({ type: 'SUBCRIBER_ERROR', payload: error.message });
      });
    }
  };
};


export const deleteSubscribers = (id) => {
  return (dispatch) => {
    firebase.firestore().collection('subscribers').doc(id)
      .delete()
      .then(() => {
        dispatch({ type: 'DELETE_SUBSCRIBER', payload: { id } });
      })
      .catch((error) => {
        dispatch({ type: 'SUBSCRIBER_ERROR', payload: error.message });
      });
  };
};