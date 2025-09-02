import React, { Component } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { signUp } from '../store/actions/AuthModel';
import { connect } from 'react-redux';

class Register extends Component {
  state = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
    showPassword: false,
    showConfirmPassword: false,
  };

  handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    this.setState({
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  togglePassword = (field) => {
    if (field === 'password') {
      this.setState({ showPassword: !this.state.showPassword });
    } else if (field === 'confirmPassword') {
      this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    this.props.signUp(this.state);
  };

  render() {
    const { auth } = this.props;
    if (auth) return <Navigate to="/profile" replace />;

    return (
      <div id="main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-4 p-3">
              <div className="auth-container">
                <div className="auth-section">
                  <div className="form-container login">
                    <h2 className="form-title">Create Account</h2>
                    <div className="auth-info-content login">
                      <h2>Join Us</h2>
                      <p>Fill in your details to get started with your new account.</p>
                    </div>
                    <form
                      id="registration-form"
                      autoComplete="off"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="input-box">
                        <input
                          type="text"
                          id="fname"
                          required
                          onChange={this.handleChange}
                        />
                        <label htmlFor="fname">First Name</label>
                        <div className="input-errors fname">First name required</div>
                      </div>

                      <div className="input-box">
                        <input
                          type="text"
                          id="lname"
                          required
                          onChange={this.handleChange}
                        />
                        <label htmlFor="lname">Last Name</label>
                        <div className="input-errors lname">Last name required</div>
                      </div>

                      <div className="input-box">
                        <input
                          type="email"
                          id="email"
                          required
                          onChange={this.handleChange}
                        />
                        <label htmlFor="email">Email Address</label>
                        <div className="input-errors email">Valid email required</div>
                      </div>

                      {/* Password Field */}
                      <div className="input-box position-relative">
                        <input
                          type={this.state.showPassword ? 'text' : 'password'}
                          id="password"
                          required
                          onChange={this.handleChange}
                        />
                        <label htmlFor="password">Password</label>
                        <i
                          className={`bx ${
                            this.state.showPassword ? 'bx-show' : 'bx-hide'
                          } password-toggle`}
                          onClick={() => this.togglePassword('password')}
                          style={{ position: 'absolute', right: '10px', top: '50%', cursor: 'pointer', transform: 'translateY(-50%)' }}
                        ></i>
                        <div className="input-errors password">Password required</div>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="input-box position-relative">
                        <input
                          type={this.state.showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          required
                          onChange={this.handleChange}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <i
                          className={`bx ${
                            this.state.showConfirmPassword ? 'bx-show' : 'bx-hide'
                          } password-toggle`}
                          onClick={() => this.togglePassword('confirmPassword')}
                          style={{ position: 'absolute', right: '10px', top: '50%', cursor: 'pointer', transform: 'translateY(-50%)' }}
                        ></i>
                        <div className="input-errors confirmPassword">Passwords must match</div>
                      </div>

                      <div className="input-box d-flex input-term mb-3">
                        <input
                          type="checkbox"
                          id="agree"
                          onChange={this.handleChange}
                        />
                        <label htmlFor="agree" className="term">
                          I agree to the
                          <NavLink to="/terms"> terms and conditions</NavLink>
                        </label>
                      </div>

                      <div className="input-box">
                        <button
                          id="register-btn"
                          className="btn btn-sm w-100"
                          type="submit"
                        >
                          Register
                        </button>
                        <button
                          className="btn btn-sm w-100 loading-btn"
                          type="button"
                          disabled
                        >
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>Registering...</span>
                        </button>
                      </div>

                      <br />
                      <div className="auth-link">
                        <p>
                          Already have an account?
                          <NavLink className="signUp-link" to="/login">
                            {' '}
                            Login
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth.user,
  profile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (userData) => dispatch(signUp(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
