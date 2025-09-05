import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Summary = ({ blog }) => {
  console.log(blog)
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${blog.id}`}
          aria-expanded="false"
          aria-controls={`collapse${blog.id}`}
        >
          {blog.title}
        </button>
      </h2>
      <div
        id={`collapse${blog.id}`}
        className="accordion-collapse collapse"
        data-bs-parent="#accordionFlushExample"
      >
        <div className="accordion-body">
            <div
                className="blog-content-preview mb-2"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blog.content.slice(0, 700)+ '...'),
                }}
            />
          <Link to={`/blogs/${blog.id}`}>Read more</Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
