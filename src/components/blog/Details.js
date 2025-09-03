import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getBlog, deleteBlog } from '../store/actions/BlogModel';
import { addNotification } from '../store/actions/NotificationsModel';
import DOMPurify from 'dompurify';
// import moment from 'moment';

const Details = ({ blog, auth, getBlog, deleteBlog, addNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Fetch blog
  useEffect(() => {
    getBlog('id', id);
  }, [id, getBlog]);

  // Log visit
  useEffect(() => {
    if (blog && blog.title && auth && blog.authorId !== auth.uid) {
      addNotification({title: blog.title, authorId: blog.authorId});
    }
  }, [auth, blog, addNotification]);

  const handleDelete = async () => {
    await deleteBlog(id);
    navigate(-1);
  };

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="container p-5 mt-5 bg-white">
      <h2 className="text-center"><strong>{blog.title}</strong></h2>

      <div className="row">

        <div className="col-12">
          <p className='ms-4'>
            Category: <strong>{blog.category}</strong>
          </p>
          <div className="blog-details-content">
            <div 
              className="blog-div-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
            />

            {/* Show Edit/Delete only if user is blog owner */}
            {auth && blog.authorId === auth.uid && (
              <>
                <button 
                  className="btn btn-danger mt-3" 
                  onClick={handleDelete} 
                  title="Delete this Article"
                >
                  <i className="bi bi-trash"></i>
                </button>
                <Link 
                  className="btn btn-primary mt-3 ms-2" 
                  to={`/blogs/${id}/edit`} 
                  title="Update this Article"
                >
                  <i className="bi bi-pencil-square"></i>
                </Link>
              </>
            )}

            {/* CreatedAt safe render */}
            <p className='mt-4 text-end'>
              Written by {blog.author 
              ? `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim()
              : 'Unknown Author'} •{" "}
              {blog.createdAt?.toDate 
              ? blog.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Unknown Date'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  blog: state.blog.blogs,
  auth: state.auth.user,
});

const mapDispatchToProps = {
  getBlog,
  deleteBlog,
  addNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
