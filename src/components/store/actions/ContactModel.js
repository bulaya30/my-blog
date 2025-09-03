import { db, firebase } from '../../../config/DB';

export const addContact = (formData) => {
  return async (dispatch) => {
    dispatch({ type: 'CONTACT_REQUEST' });
    try {
      await db.collection('contacts').add({
        ...formData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch({ type: 'CONTACT_SUCCESS', payload: formData });
    } catch (error) {
      dispatch({ type: 'CONTACT_ERROR', payload: error.message });
    }
  };
};

// 👉 New action to fetch all messages
export const fetchContacts = () => {
  return async (dispatch) => {
    dispatch({ type: 'CONTACTS_REQUEST' });
    try {
      const snapshot = await db.collection('contacts')
        .orderBy('createdAt', 'desc')
        .get();

      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: 'CONTACTS_SUCCESS', payload: contacts });
    } catch (error) {
      dispatch({ type: 'CONTACTS_ERROR', payload: error.message });
    }
  };
};
