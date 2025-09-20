import firebase from "../../../config/DB";
import axios from "axios";
let unsubscribeProfile = null;

export const listenToAuthChanges = () => {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      // Clean up previous listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (user) {
        // Real-time listener on the user's Firestore profile
        unsubscribeProfile = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const userData = {
            ...user.toJSON(),
            profile: doc.exists ? doc.data() : {}
          };
          dispatch({ type: "LOGIN_AUTH", payload: userData });
          });
      } else {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      }
    });
  };
};

export const updateProfile = (profile) => {
  return async (dispatch, getState) => {
    const state = getState();
    const user = state.auth?.user;
    if (!user) return;

    try {
      let updatedProfile = { ...profile };

      // If user selected a new photo
      if (updatedProfile.photo instanceof File) {
        const formData = new FormData();
        formData.append("file", updatedProfile.photo);
        formData.append("upload_preset", "user_profiles");
        formData.append("folder", `user_profiles/${user.uid}`);

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dzoaynyni/image/upload",
          formData
        );
        updatedProfile.photo = cloudinaryResponse.data.secure_url;
      }

      // Remove undefined or null values before updating Firestore
      const cleanedProfile = Object.fromEntries(
        Object.entries(updatedProfile).filter(([_, v]) => v !== undefined && v !== null)
      );

      // Update Firestore profile
      await firebase.firestore().collection("users").doc(user.uid).update(cleanedProfile);

      dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: cleanedProfile });
      return { success: true };
    } catch (err) {
      dispatch({ type: "UPDATE_PROFILE_ERROR", err });
      return { success: false, error: err.message };
    }
  };
};

export const updatePassword = (currentPassword, newPassword) => {
  return async (dispatch, getState) => {
    const state = getState();
    const user = state.auth?.user;

    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    try {
      const currentUser = firebase.auth().currentUser;

      // Reauthenticate user first
      const credential = firebase.auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await currentUser.reauthenticateWithCredential(credential);

      // Now update the password
      await currentUser.updatePassword(newPassword);

      dispatch({ type: "UPDATE_PASSWORD_SUCCESS" });
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      dispatch({ type: "UPDATE_PASSWORD_ERROR", payload: error.message });
      return { success: false, error: error.message };
    }
  };
};
