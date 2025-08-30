import firebase from "../../../config/DB";
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
      console.error("No user ID found in state");
      return;
    }

    try {
      let updatedProfile = { ...profile };

      // If user selected a new photo
      if (updatedProfile.photo instanceof File) {
        const extension = updatedProfile.photo.name.split('.').pop();
        const newFileName = `${updatedProfile.firstName}_${Date.now()}.${extension}`;
        const fileRef = firebase
          .storage()
          .ref()
          .child(`profilePhotos/${user.uid}/${newFileName}`);

        // Upload new photo
        await fileRef.put(updatedProfile.photo);
        const newPhotoURL = await fileRef.getDownloadURL();
        updatedProfile.photo = newPhotoURL;

        // Delete old photo if it exists and is a Firebase URL
        if (user.photo && user.photo.startsWith("https://")) {
          try {
            const oldPhotoRef = firebase.storage().refFromURL(user.photo);
            await oldPhotoRef.delete();
          } catch (deleteErr) {
            console.warn("Could not delete old profile photo:", deleteErr);
          }
        }
      }

      // Remove undefined or null values
      const cleanedProfile = Object.fromEntries(
        Object.entries(updatedProfile).filter(([_, v]) => v !== undefined && v !== null)
      );

      // Update Firestore
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
