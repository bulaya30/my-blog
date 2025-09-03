import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCategory } from '../store/actions/categoryModel';
import { getBlog } from '../store/actions/BlogModel';
import Blog from '../blog/List';

function BlogByCategory({ auth, category, blogs, getCategory, getBlog }) {
  const { id } = useParams();

  // Load category by ID when component mounts or ID changes
  useEffect(() => {
    if (id) getCategory('id', id);
  }, [id, getCategory]);
  // Load blogs once category is available
  useEffect(() => {
    if (category && category.name) {
      getBlog('category', category.name);
    }
  }, [category, getBlog]);

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          {!category ? (
            <p>Loading category...</p>
          ) : !blogs ? (
            <p>Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <h2>No Blog found in this Category</h2>
          ) : (
            <>
              <div className='col-4 m-0'>
                <div className='category-content'>
                  <h2>Category</h2>
                  <p>{category.name}</p>
                </div>
              </div>
              <div className='col-8 col-md-8 col-sm-8'>
                <Blog blogs={blogs} auth={auth} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) =>{ 
  return {
  auth: state.auth.user,
  category: state.category.categories || null,
  blogs: state.blog.blogs || []
}};

const mapDispatchToProps = {
  getCategory,
  getBlog
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogByCategory);
