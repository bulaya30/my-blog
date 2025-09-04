import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './components/store/store';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './config/DB';
import { onAuthStateChanged } from "firebase/auth";
import { listenToAuthChanges } from './components/store/actions/UserModel';
import { SidebarProvider } from './components/navigations/SidebarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const auth = firebase.auth();

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();


let unsubscribeProfile = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userData = user.toJSON();
    store.dispatch({ type: 'LOGIN_AUTH', payload: userData });
    store.dispatch({ type: 'LOGIN_SUCCESS', payload: userData });

    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }

    // Start listening to profile changes
    unsubscribeProfile = store.dispatch(listenToAuthChanges());

    // Load profile and set isAdmin from role
    try {
      const doc = await firebase.firestore().collection('users').doc(user.uid).get();
      if (doc.exists) {
        const profileData = { id: doc.id, ...doc.data() };
        store.dispatch({ type: 'PROFILE_LOADED', payload: profileData });
        store.dispatch({ type: 'SET_ADMIN', payload: profileData.role === 'admin' });
      }
    } catch (err) {
    }

  } else {
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }
    store.dispatch({ type: 'SIGNOUT_SUCCESS' });
  }
});
