import firebase from '../../../config/DB';

export const addNotification = (blog) => {
  return async (dispatch) => {
    try {
      // 1️⃣ Determine visitor (logged-in email or IP)
      const user = firebase.auth().currentUser;
      const visitor = user?.email ?? (await (await fetch('https://api.ipify.org?format=json')).json()).ip;

      // 2️⃣ Validate required fields
      if (!blog?.title) throw new Error('Blog title is required');
      if (!visitor) throw new Error('Visitor info is required');

      const notificationsRef = firebase.firestore().collection('notifications');
      // 3️⃣ Query existing notification for this visitor & blog
      const snapshot = await notificationsRef
        .where('blog', '==', blog.title)
        .where('visitor', '==', visitor)
        .limit(1)
        .get();

      if (snapshot.empty) {
        // 4️⃣ First-time visit → create new notification
        await notificationsRef.add({
          blog: blog.title,
          authorId: blog.authorId ?? null,
          visitor,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // 5️⃣ Repeat visitor → update timestamp
        const docId = snapshot.docs[0].id;
        await notificationsRef.doc(docId).update({
          lastVisited: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }

      // 6️⃣ Dispatch success action
      dispatch({ type: 'VISIT_LOGGED', payload: { ...blog, visitor } });

    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };
};


// Fetch notifications

export const getNotification = () => {
  return (dispatch, getState) => {
    const state = getState();
    const currentUser = state.auth.user;

    if (!currentUser) {
      return () => {}; // return a dummy unsubscribe
    }

    const unsubscribe = firebase.firestore()
      .collection('notifications')
      .where('authorId', '==', currentUser.uid)   // only this user's notifications
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
