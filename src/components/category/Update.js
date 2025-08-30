import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateCategory, getCategory } from '../store/actions/categoryModel'; 

const EditCategory = ({ singleCategory, updateCategory, getCategory }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    id: ''
  });

  // Fetch category by ID
  useEffect(() => {
    getCategory('id', id);
    setFormData(prev => ({ ...prev, id }));
  }, [id, getCategory]);
  useEffect(() => {
    if (singleCategory) {
      setFormData({
        name: singleCategory.name || '',
        id: singleCategory.id || id
      });
    }
  }, [singleCategory, id]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCategory(formData); // dispatch redux action
  };

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          <div className="form-section">
            <div className="card mt-3">
              <h2>Update Category</h2>
              <div className="card-body">
                <form onSubmit={handleSubmit} id="new-category-form" autoComplete="off">
                  <div className="row mb-3">
                    <div className="errors hide">error</div>
                    <div className="success-container">success</div>
                  </div>
                  <div className="input-box">
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      required 
                      onChange={handleChange}  
                    /> 
                    <input 
                      type="hidden" 
                      name="id" 
                      id="id" 
                      value={formData.id} 
                      readOnly
                    />
                    <label htmlFor="name">Name</label>
                    <div className="input-errors name">Category name required</div>
                  </div>
                  <div className="input-box">
                    <button 
                      id="new-category-btn" 
                      className="btn btn-sm w-100" 
                      type="submit"
                    >
                      Update
                    </button>
                    <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Updating...</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // console.log(state)
  return{
  singleCategory: state.category.categories || null
  };
}

const mapDispatchToProps = {
  updateCategory,
  getCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory);
