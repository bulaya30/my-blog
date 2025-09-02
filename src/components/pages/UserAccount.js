import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import UpdateProfile from './Update'
import Password from '../auth/Password'
import { connect } from 'react-redux'

class Account extends Component {
  render() {
      const { user } = this.props;
      if (!user) return <div>Loading...</div>;
      return (
        <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                        <img src={user.photo || "logo.png"} alt="" className="rounded-circle"/>
                        <h2>{user.firstName} {user.lastName}</h2>
                        <h3>{user.title}</h3>
                        <div className="social-links mt-2">
                            <NavLink to='#' className="twitter"><i className="bi bi-twitter"></i></NavLink>
                            <NavLink to='#' className="facebook"><i className="bi bi-facebook"></i></NavLink>
                            <NavLink to='#' className="instagram"><i className="bi bi-instagram"></i></NavLink>
                            <NavLink to='#' className="linkedin"><i className="bi bi-linkedin"></i></NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body pt-3">
                        <ul className="nav nav-underline">
                            <li className="nav-item">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                            </li>

                            <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                            </li>
                        </ul>
                        <div className="tab-content pt-2">
                            <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                <h5 className="card-title">About</h5>
                                <p className="small fst-italic">{user.about}</p>

                                <h5 className="card-title">Profile Details</h5>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                    <div className="col-lg-9 col-md-8">{user.firstName} {user.lastName}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Company</div>
                                    <div className="col-lg-9 col-md-8">{user.company}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Country</div>
                                <div className="col-lg-9 col-md-8">{user.country}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Address</div>
                                    <div className="col-lg-9 col-md-8">{user.address}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Phone</div>
                                    <div className="col-lg-9 col-md-8">{user.phone}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                    <div className="col-lg-9 col-md-8">{user.email}</div>
                                </div>            
                            </div>
                            <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                                <UpdateProfile />
                            </div>
                            <div className="tab-pane fade profile-edit pt-3" id="profile-change-password">
                                <Password />
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
    // console.log('Redux User State:', state.auth);
  return {
    user: state.auth.user.profile
  }
}

export default connect(mapStateToProps)(Account)
