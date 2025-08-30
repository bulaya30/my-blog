import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addCategory } from '../store/actions/categoryModel'

export class CreateCategory extends Component {
    state = {
      name: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.add(this.state)
        this.setState({ name: '' }) // Reset the input field after submission
    }
  render() {
    return (
                <div className="form-section">
                    <div className="card">
                      <h2>New Category</h2>
                      <div className="card-body">
                        <form onSubmit={this.handleSubmit} id="new-category-form" autoComplete="off">
                          <div className="row mb-3">
                            <div className="errors hide">error</div>
                            <div className="success-container">success</div>
                          </div>
                          <div className="input-box">
                            <input type="text" id="name" name="name" required onChange={this.handleChange}  /> 
                            <label htmlFor="name">Name</label>
                            <div className="input-errors name">Category name required</div>
                          </div>
                          <div className="input-box">
                            <button id="new-category-btn" className="btn btn-sm w-100" name="submit" type="submit">Add</button>
                            <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              <span className="">Adding...</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: (category) => dispatch(addCategory(category))
  }
} 

export default connect(null, mapDispatchToProps)(CreateCategory)
