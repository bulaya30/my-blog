import React, { useEffect } from 'react';
import Summary from './Summary';
import { connect } from 'react-redux';
import { getBlog } from '../store/actions/BlogModel';

const Blog = ({ blogs = [], auth, loading, getBlog }) => {
  // Fetch blogs only once on component mount
  useEffect(() => {
    getBlog();
  }, [getBlog]);

  // Ensure blogs is always an array
  const safeBlogs = Array.isArray(blogs) ? blogs : blogs ? [blogs] : [];

  if (loading) {
    return (
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (safeBlogs.length === 0) {
    return (
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <p>No blogs available.</p>
      </div>
    );
  }

  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      {safeBlogs.map((blog, index) => (
        <Summary blog={blog} key={blog.id || index} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  blogs: state.blog.blogs || [],
  auth: state.auth.user || null,
  loading: state.blog.loading || false, // Assumes you track loading in Redux
});

const mapDispatchToProps = {
  getBlog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
