import firebase from '../../../config/DB';

export const addNotification = (notification) => {
  return async (dispatch) => {
    try {
      const notificationsRef = firebase.firestore().collection('notifications');
      await notificationsRef.add({
        ...notification,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      dispatch({ type: 'NOTIFICATION_SUCCESS', payload: notification });

    } catch (error) {
      dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
    }
  };
};


// Fetch notifications

export const getNotification = () => {
  return (dispatch, getState) => {
    const state = getState();
    const currentUser = state.auth.user;

    if (!currentUser) {
      return () => {}; 
    }

    const unsubscribe = firebase.firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({ type: 'GET_NOTIFICATION', payload: notifications });
      }, (error) => {
      });

    // Return unsubscribe so you can clean up in useEffect
    return unsubscribe;
  };
};
