import firebase from "../../../config/DB";
import { addNotification } from "./NotificationsModel";
import { ADMIN_EMAILS } from "../../../config/Admin.config";

/**
 * Sign In
 */
export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password);

      const loggedInUser = res.user;
      const uid = loggedInUser.uid;

      const userDocRef = firebase.firestore().collection("users").doc(uid);
      const doc = await userDocRef.get();

      if (!doc.exists) {
        throw new Error("User profile not found");
      }

      const profileData = { id: uid, ...doc.data() };

      const fullUser = {
        ...loggedInUser.toJSON(),
        profile: profileData,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: fullUser });
      dispatch({ type: "SET_ADMIN", payload: profileData.role === "admin" });

      return { success: true };
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", payload: err.message });
      return { success: false, error: err.message };
    }
  };
};

/**
 * Sign Out
 */
export const signOut = () => {
  return async (dispatch) => {
    try {
      await firebase.auth().signOut();
      dispatch({ type: "SIGNOUT_SUCCESS" });
      return { success: true };
    } catch (err) {
      dispatch({ type: "SIGNOUT_ERROR", payload: err.message });
      return { success: false, error: err.message };
    }
  };
};

/**
 * Sign Up
 */
export const signUp = (newUser) => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);

      const createdUser = res.user;
      const uid = createdUser.uid;

      const role = ADMIN_EMAILS.includes(newUser.email.toLowerCase())
        ? "admin"
        : "user";

      const userDocRef = firebase.firestore().collection("users").doc(uid);
      const profileData = {
        firstName: newUser.fname,
        lastName: newUser.lname,
        email: newUser.email,
        company: "",
        country: "",
        address: "",
        phone: "",
        title: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        photo: "",
        about: "",
        role,
      };

      await userDocRef.set(profileData);

      const fullUser = {
        ...createdUser.toJSON(),
        profile: { id: uid, ...profileData },
      };

      dispatch({ type: "SIGNUP_SUCCESS", payload: fullUser });
      dispatch({ type: "SET_ADMIN", payload: role === "admin" });

      await dispatch(
        addNotification({
          title: "New User",
          message: `A new user ${newUser.email} created an account.`,
          type: "Registration",
        })
      );

      return { success: true };
    } catch (err) {
      dispatch({ type: "SIGNUP_ERROR", payload: err.message });
      return { success: false, error: err.message };
    }
  };
};
