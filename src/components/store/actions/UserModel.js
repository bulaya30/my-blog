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
    if (!user) {
      return;
    }

    try {
      let updatedProfile = { ...profile };

      // If user selected a new photo
      if (updatedProfile.photo instanceof File) {
        const formData = new FormData();
        formData.append("file", updatedProfile.photo);
        formData.append("upload_preset", "user_profiles"); // <- your actual preset name
        formData.append("folder", `user_profiles/${user.uid}`); // optional folder by user ID

        // Upload to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dzoaynyni/image/upload",
          formData
        );

        updatedProfile.photo = cloudinaryResponse.data.secure_url;

      }

      // Remove undefined or null values
      const cleanedProfile = Object.fromEntries(
        Object.entries(updatedProfile).filter(([_, v]) => v !== undefined && v !== null)
      );

      // Update Firestore (or your backend DB)
      await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .update(cleanedProfile);

      dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: cleanedProfile });
    } catch (err) {
      console.error("Error updating profile:", err);
      dispatch({ type: "UPDATE_PROFILE_ERROR", err });
    }
  };
};
