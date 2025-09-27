import firebase from '../../../config/DB';

/**
 * Add a notification
 */
export const addNotification = (notification) => {
  return async (dispatch) => {
    try {
      const notificationsRef = firebase.firestore().collection('notifications');
      await notificationsRef.add({
        ...notification,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      dispatch({ type: 'NOTIFICATION_SUCCESS', payload: notification });
      return { success: true, notification, error: null };
    } catch (error) {
      dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Fetch notifications for the current user
 */
export const getNotification = () => {
  return (dispatch, getState) => {
    const state = getState();
    const currentUser = state.auth.user;

    if (!currentUser) return () => {};

    const unsubscribe = firebase.firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          dispatch({ type: 'GET_NOTIFICATION', payload: notifications });
        },
        (error) => {
          dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
        }
      );

    return unsubscribe; // for cleanup in useEffect
  };
};

/**
 * Delete a notification (admin only)
 */
export const deleteNotification = (id) => {
  return async (dispatch, getState) => {
    const state = getState();
    const isAdmin = state.auth.isAdmin;

    if (!isAdmin) {
      const errorMsg = "You are not authorized to delete notifications";
      dispatch({ type: 'NOTIFICATION_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }

    try {
      const notificationsRef = firebase.firestore().collection('notifications').doc(id);
      await notificationsRef.delete();
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};
