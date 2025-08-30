import firebase from "../../../config/DB";


export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      const res = await firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
      const uid = res.user.uid;
      const userDoc = await firebase.firestore().collection("users").doc(uid).get();

      const fullUser = {
        ...res.user.toJSON(),
        profile: userDoc.exists ? userDoc.data() : {}
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: fullUser });
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', err });
    }
  };
};





export const signOut = () => {
  return (dispatch, getState) => {
    firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'SIGNOUT_SUCCESS' }); // <-- clears user in Redux immediately
      })
      .catch(err => {
        dispatch({ type: 'SIGNOUT_ERROR', err });
      });
  };
};
export const signUp = (newUser) => {
  return (dispatch) => {
    let createdUser = null;

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((res) => {
        createdUser = res.user; // save auth user
        const userDocRef = firebase.firestore().collection('users').doc(res.user.uid);

        return userDocRef.set({
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
        }).then(() => userDocRef.get()); // <-- fetch the document you just created
      })
      .then((doc) => {
        if (doc.exists) {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            payload: {
              ...createdUser.toJSON(),
              profile: doc.data() // merge Firestore profile
            }
          });
        }
      })
      .catch((err) => {
        dispatch({ type: 'SIGNUP_ERROR', err });
      });
  };
};
