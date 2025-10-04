import { db, firebase } from '../../../config/DB';
import { addNotification } from './NotificationsModel';

/**
 * Add a contact message
 */
export const addContact = (formData) => {
  return async (dispatch) => {
    dispatch({ type: 'CONTACT_REQUEST' });
    try {
      await db.collection('contacts').add({
        ...formData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await dispatch(addNotification({
        title: "New Subscriber",
        message: `A new user ${formData.email} just contacted.`,
        type: "Contact",
      }));

      dispatch({ type: 'CONTACT_SUCCESS', payload: formData });
      return { success: true, contact: formData, error: null };
    } catch (error) {
      dispatch({ type: 'CONTACT_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

/**
 * Fetch all contacts/messages
 */
export const getContacts = () => {
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
      return { success: true, contacts, error: null };
    } catch (error) {
      dispatch({ type: 'CONTACTS_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};


/**
 * Delete a Contact
 */
export const deleteContact = (id) => {
  return async (dispatch) => {
    try {
      await firebase.firestore().collection("contacts").doc(id).delete();
      dispatch({ type: "DELETE_CONTACT", payload: { id } });
      return { success: true };
    } catch (error) {
      console.log(error.message)
      dispatch({ type: "CONTACT_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};
