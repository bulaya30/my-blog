import React, { Component } from 'react'

class Password extends Component {
    state = {
        currentPassword: '',
        newPassword: '',
        renewPassword: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
    }
  render() {
    return (
      <form autoComplete="off">
            <div className="row mb-3">
                <div className="input-box">
                    <input name="currentPassword" type="password" id="currentPassword" required onChange={this.handleChange} />
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-errors currentPassword"></div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="input-box">
                    <input name="newPassword" type="password" id="newPassword" required onChange={this.handleChange} />
                    <label htmlFor="newPassword">Nw Password</label>
                    <div className="input-errors newPassword"></div>
                </div>
            </div>
                        
            <div className="row mb-3">
                <div className="input-box">
                    <input name="renewPassword" type="text" id="renewPassword" required onChange={this.handleChange} />
                    <label htmlFor="renewPassword">Confirm</label>
                    <div className="input-errors renewPassword"></div>
                </div>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-sm save-btn" >Save Changes</button>
                <button className="btn btn-sm loading-btn" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="">Saving...</span>
                </button>
            </div>
        </form>
    )
  }
}

export default Password
