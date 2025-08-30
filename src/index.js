import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import './css/norrechel.main.css';
import './css/norrechel.profile.css';
import './css/norrechel.mobile.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './components/store/store';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './config/DB';
import { onAuthStateChanged } from "firebase/auth";
import { listenToAuthChanges } from './components/store/actions/UserModel';

// Import your Sidebar context provider
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

let unsubscribeProfile = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch({ type: 'LOGIN_AUTH', payload: user.toJSON() });
    store.dispatch({ type: 'LOGIN_SUCCESS', payload: user.toJSON() });

    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }

    unsubscribeProfile = store.dispatch(listenToAuthChanges());

    firebase.firestore().collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          store.dispatch({
            type: 'PROFILE_LOADED',
            payload: { id: doc.id, ...doc.data() }
          });
        }
      });
  } else {
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }
    store.dispatch({ type: 'SIGNOUT_SUCCESS' });
  }

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
});
