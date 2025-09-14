import firebase from "../../../config/DB";
import { addNotification } from "./NotificationsModel";
import { ADMIN_EMAILS } from "../../../config/Admin.config";

// signIn
export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      // 1️⃣ Authenticate with Firebase Auth
      const res = await firebase
        .auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password);

      const loggedInUser = res.user;
      const uid = loggedInUser.uid;

      // 2️⃣ Get Firestore profile
      const userDocRef = firebase.firestore().collection("users").doc(uid);
      const doc = await userDocRef.get();

      if (!doc.exists) {
        throw new Error("User profile not found");
      }

      const profileData = { id: uid, ...doc.data() };

      // 3️⃣ Create final user object (auth + profile)
      const fullUser = {
        ...loggedInUser.toJSON(),
        profile: profileData,
      };

      // 4️⃣ Dispatch user + admin role
      dispatch({ type: "LOGIN_SUCCESS", payload: fullUser });
      dispatch({ type: "SET_ADMIN", payload: profileData.role === "admin" });

      return { success: true };
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", err });
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
      // 1️⃣ Create user in Firebase Auth
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);

      const createdUser = res.user;
      const uid = createdUser.uid;

      // 2️⃣ Decide role (admin/user)
      const role = ADMIN_EMAILS.includes(newUser.email.toLowerCase())
        ? "admin"
        : "user";

      // 3️⃣ Create Firestore profile document
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

      // 4️⃣ Create final user object
      const fullUser = {
        ...createdUser.toJSON(), // Firebase auth fields
        profile: { id: uid, ...profileData }, // Firestore profile
      };

      // 5️⃣ Dispatch once → keeps state consistent
      dispatch({ type: "SIGNUP_SUCCESS", payload: fullUser });
      dispatch({ type: "SET_ADMIN", payload: role === "admin" });

      // 6️⃣ Send admin notification
      await dispatch(
        addNotification({
          title: "New User",
          message: `A new user ${newUser.email} created an account.`,
          type: "Registration",
        })
      );

      return { success: true };
    } catch (err) {
      dispatch({ type: "SIGNUP_ERROR", err });
      return { success: false, error: err.message };
    }
  };
};

