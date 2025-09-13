import firebase from "../../../config/DB";
import { addNotification } from "./NotificationsModel";
import { ADMIN_EMAILS } from "../../../config/Admin.config";

export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      const res = await firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
      const uid = res.user.uid;

      // Fetch user profile
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      const profileData = doc.exists ? { id: doc.id, ...doc.data() } : {};

      // Update Redux
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...res.user.toJSON(), profile: profileData } });
      dispatch({ type: 'PROFILE_LOADED', payload: profileData });
      dispatch({ type: 'SET_ADMIN', payload: profileData.role === 'admin' });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', err });
      return { success: false, error: err.message };
    }
  };
};

// Sign Out
export const signOut = () => {
  return async (dispatch) => {
    try {
      await firebase.auth().signOut();
      dispatch({ type: 'SIGNOUT_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'SIGNOUT_ERROR', err });
    }
  };
};
export const signUp = (newUser) => {
  return async (dispatch) => {
    try {
      // 1️⃣ Create user with email & password
      const res = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      const createdUser = res.user;

      // 2️⃣ Send email verification
      await createdUser.sendEmailVerification();  // 🔹 verification email sent here

      // 3️⃣ Determine role
      const role = ADMIN_EMAILS.includes(newUser.email.toLowerCase()) ? 'admin' : 'user';

      // 4️⃣ Save user profile in Firestore
      const userDocRef = firebase.firestore().collection('users').doc(createdUser.uid);
      await userDocRef.set({
        firstName: newUser.fname,
        lastName: newUser.lname,
        email: newUser.email,
        company: '',
        country: '',
        address: '',
        phone: '',
        title: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        photo: '',
        about: '',
        role,
      });

      // 5️⃣ Fetch the created document
      const doc = await userDocRef.get();

      // 6️⃣ Update Redux state
      if (doc.exists) {
        const profileData = { id: doc.id, ...doc.data() };
        dispatch({ type: 'PROFILE_LOADED', payload: profileData });
        dispatch({ type: 'SET_ADMIN', payload: profileData.role === 'admin' });

        dispatch({ type: 'SIGNUP_SUCCESS', payload: { ...createdUser.toJSON(), profile: profileData } });
      }

      // 7️⃣ Send admin notification
      await dispatch(addNotification({
        title: "New User",
        message: `A new user ${newUser.email} created an account.`,
        type: "Registration",
      }));

      return { success: true };

    } catch (err) {
      dispatch({ type: 'SIGNUP_ERROR', err });
      return { success: false, error: err.message };
    }
  };
};
