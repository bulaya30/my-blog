import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateProfile } from '../store/actions/UserModel';

class UpdateProfile extends Component {
  state = {
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    address: '',
    phone: '',
    title: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    about: '',
    photo: ''
  };

  componentDidMount() {
    const { profile } = this.props;
    if (profile) {
      this.setState({ ...profile });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile && this.props.profile) {
      this.setState({ ...this.props.profile });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  setPhoto = (file) => {
    this.setState({ photo: file });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.updateProfile(this.state);
  };

  render() {
    if (!this.props.profile) return <div>Loading...</div>;

    return (
      <div className="form-section">
        <form 
          id="profile-edit-form" 
          autoComplete="off" 
          encType="multipart/form-data"
          onSubmit={this.handleSubmit}
        >
          <div className="row mb-3">
            <div className="errors hide">error</div>
            <div className="success-container">success</div>
          </div>

          <div className="row mb-3">
            <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
            <div className="col-md-8 col-lg-9">
              <img 
                src={this.state.photo || "logo.png"}  
                alt="Profile" 
                className="img-preview" 
              />                                  
              <div className="pt-2 mb-3">
                <div className="input-box">
                  <input 
                    accept="image/*" 
                    type="file" id="file" name="file" 
                    onChange={(e) => this.setPhoto(e.target.files[0])}
                    />
                    <label htmlFor="file" className="btn btn-primary btn-sm text-white" title="Upload new profile image">
                      <i className="bi bi-upload"></i>
                    </label>
                </div>
              </div>
            </div>
          </div>

          {/* First Name */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                value={this.state.firstName || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="firstName">First Name</label>
              <div className="input-errors firstName"></div>
            </div>            
          </div>

          {/* Last Name */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                value={this.state.lastName || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="lastName">Last Name</label>
              <div className="input-errors lastName"></div>
            </div>                              
          </div>  

          {/* About */}
          <div className="row mb-3">
            <div className="input-box">
              <label htmlFor="about">About</label>
              <textarea 
                id="about" 
                name="about" 
                value={this.state.about || ''} 
                onChange={this.handleChange}
              />
              <div className="input-errors about"></div>
            </div>
          </div>

          {/* Company */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={this.state.company || ''} 
                required 
                onChange={this.handleChange}
              />
              <label htmlFor="company">Company</label>
              <div className="input-errors company"></div>
            </div>                             
          </div>

          {/* Title */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={this.state.title || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="title">Title</label>
              <div className="input-errors title"></div>
            </div>
          </div>

          {/* Country */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                type="text" 
                id="country" 
                name="country" 
                value={this.state.country || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="country">Country</label>
              <div className="input-errors country"></div>
            </div>
          </div>

          {/* Address */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                name="address" 
                type="text" 
                id="address" 
                value={this.state.address || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="address">Address</label>
              <div className="input-errors address"></div>
            </div>
          </div>

          {/* Phone */}
          <div className="row mb-3">
            <div className="input-box">
              <input 
                name="phone" 
                type="text" 
                id="phone" 
                value={this.state.phone || ''} 
                required 
                onChange={this.handleChange} 
              />
              <label htmlFor="phone">Phone</label>
              <div className="input-errors phone"></div>
            </div>
          </div>

          {/* Socials */}
          {['twitter','facebook','instagram','linkedin'].map(field => (
            <div className="row mb-3" key={field}>
              <div className="input-box">
                <input 
                  name={field} 
                  type="text" 
                  id={field} 
                  value={this.state[field] || ''} 
                  required 
                  onChange={this.handleChange} 
                />
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} Profile
                </label>
                <div className={`input-errors ${field}`}></div>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button type="submit" className="btn btn-sm save-btn" >Save Changes</button>
            <button className="btn btn-sm loading-btn" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="">Saving...</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    // console.log('Redux State:', state.auth);
  return {
    profile: state.auth.user.profile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (profile) => dispatch(updateProfile(profile))
  }
}   

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
