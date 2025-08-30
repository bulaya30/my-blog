import React, { Component } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { signUp } from '../store/actions/AuthModel'
import { connect } from 'react-redux'

class Register extends Component {
    state = {
        fname: '',
        lname: '',
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.signUp(this.state); // call your redux action
    };

  render() {
    const { auth } = this.props
    if (auth) {
        return <Navigate to="/profile" replace />;
    }
    return (
     <div id="main">
        <div className="container">
            <div className="row">
                <div className="col-8"></div>
                <div className="col-4 p-3">
                    <div className="row">
                        <div className="auth-container">
                            <div className="auth-section">
                                <div className="form-container login">
                                    <h2 className="form-title">Registration</h2>
                                    <div className="auth-info-content login">
                                        <h2>LET US KNOW YOU</h2>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, eveniet?</p>
                                    </div>
                                    <div className="errors hide">error</div>
                                    <form id="registration-form" autoComplete="off" onSubmit={this.handleSubmit}>

                                        <div className="input-box">
                                            <input type="text" id="fname" name="fname" required onChange = {this.handleChange}/>
                                            <label htmlFor="fname">First name</label>
                                            <div className="input-errors fname">First name required</div>
                                        </div>
                                        <div className="input-box">
                                            <input type="text" id="lname" name="lname" required onChange = {this.handleChange}/>
                                            <label htmlFor="lname">Last name</label>
                                            <div className="input-errors lname">Last name required</div>
                                        </div>
                                        <div className="input-box">
                                            <input type="email" id="email" name="email" required onChange = {this.handleChange}/>
                                            <label htmlFor="email">Email address</label>
                                            <div className="input-errors email">Email required</div>
                                        </div>
                                        <div className="input-box">
                                            <input type="password" id="password" name="password" required onChange = {this.handleChange}/>
                                            <label htmlFor="password">Password</label>
                                            <div className="input-errors password">Password required</div>
                                        </div>
                                        <div className="input-box d-flex input-term">
                                            <input type="checkbox" id="term" name="term" />
                                            <label htmlFor="term" className="term ">I agree and accept the 
                                                <NavLink to=''> terms and conditions</NavLink></label>
                                            
                                        </div>
                                         <div className="input-box">
                                            <button id="register-btn" className="btn btn-sm w-100" name="submit" type="submit">Register</button>
                                            <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="">Registering...</span>
                                            </button>
                                        </div>
                                        <br/>
                                        <div className="auth-link">
                                            <p>Already have an account? 
                                                <NavLink className="signUp-link" to='/login'> Login</NavLink></p>
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
    return {
        auth: state.auth.user,
        profile: state.auth.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (userData) => dispatch(signUp(userData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
