import React, { Component } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn } from '../store/actions/AuthModel';
import firebase from '../../config/DB'; // Firebase instance

class Login extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false, // toggle state
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state);
  };

  render() {
    const { authError, auth } = this.props;

    if (auth) return <Navigate to="/" replace />;

    return (
      <div id="main" className="login-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-8 col-sm-10">
              <div className="auth-container">
                <div className="form-container login">
                  <h2 className="form-title text-center my-4">Welcome Back</h2>
                  <div className="auth-info-content login text-center mb-3">
                    <h4>Sign in to your account</h4>
                  </div>

                  {authError && <div className="errors">{authError}</div>}

                  <form id="login-form" autoComplete="off" onSubmit={this.handleSubmit}>
                    <div className="input-box">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        onChange={this.handleChange}
                      />
                      <label htmlFor="email">Email address</label>
                      <div className="input-errors email">Email address required</div>
                    </div>

                    <div className="input-box position-relative">
                      <input
                        type={this.state.showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        onChange={this.handleChange}
                      />
                      <label htmlFor="password">Password</label>
                      <i
                        className={`bx ${this.state.showPassword ? 'bx-show' : 'bx-hide'} password-toggle`}
                        onClick={this.togglePassword}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          cursor: 'pointer',
                          transform: 'translateY(-50%)',
                        }}
                      ></i>
                      <div className="input-errors password">Password required</div>
                    </div>

                    <div className="input-box">
                      <button id="login-btn" className="btn w-100" type="submit">
                        Login
                      </button>
                      <button className="btn w-100 loading-btn" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Logging in...</span>
                      </button>
                    </div>

                    <div className="auth-link mt-3 text-center">
                      <p>
                        Don't have an account?
                        <NavLink className="signUp-link ms-1" to="/register">
                          Register
                        </NavLink>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authError: state.auth.authError,
  auth: firebase.auth().currentUser, // Current user from Firebase
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (user) => dispatch(signIn(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
