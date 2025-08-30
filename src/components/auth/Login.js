import React, { Component } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { signIn } from '../store/actions/AuthModel'
import firebase from '../../config/DB'; // Import Firebase directly for login

class Login extends Component {
    state = {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.signIn(this.state)
    }
  render() {
    const { authError, auth } = this.props;
   
    if (auth) {
        return <Navigate to="/" replace />;
    }
    return (
     <div id="main">
        {/* {auth.isLoaded ? null : <div>Loading...</div>} */}
        <div className="container">
            <div className="row">
                <div className="col-8"></div>
                <div className="col-4 p-3">
                    <div className="row">
                        <div className="auth-container">
                            <div className="auth-section">
                                <div className="form-container login">
                                    <h2 className="form-title">Login</h2>
                                    <div className="auth-info-content login">
                                        <h2>LET US KNOW YOU</h2>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, eveniet?</p>
                                    </div>
                                    {authError ? <div className="errors hide">{authError }</div> : null}
                                    <form id="login-form" autoComplete="off" onSubmit={this.handleSubmit}>
                                        <div className="input-box">
                                            <input type="email" id="email" name="email" required onChange = {this.handleChange} />
                                            <label htmlFor="email">Email address</label>
                                            <div className="input-errors email">Email address required</div>
                                        </div>
                                        <div className="input-box">
                                            <input type="password" id="password" name="password" required onChange = {this.handleChange} />
                                            <label htmlFor="password">Password</label>
                                            <div className="input-errors password">Password required</div>
                                        </div>
                                        <div className="input-box">
                                            <button id="login-btn" className="btn btn-sm w-100" name="submit" type="submit">Login</button>
                                            <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="">Loging in...</span>
                                            </button>
                                        </div>
                                        <br/>
                                        <div className="auth-link">
                                            <p>Don't have an account? 
                                                <NavLink className="signUp-link" to='/register'> Register</NavLink></p>
                                        </div>
                                    </form>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
    )
  }
}

const mapStateToProps = (state) => {
    // console.log('Auth State:', state);
    return {    
        authError: state.auth.authError,
        auth: firebase.auth().currentUser, // Get current user from Firebase
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (user) => dispatch(signIn(user))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)
