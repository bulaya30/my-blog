import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../store/actions/BlogModel';
import { Editor } from '@tinymce/tinymce-react';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth.user);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!auth) {
      alert('You must be logged in to create a blog');
      return;
    }

    const newBlog = {
      title,
      category,
      content,
      authorId: auth.uid,
      createdAt: new Date()
    };

    dispatch(addBlog(newBlog));

    // Reset form
    setTitle('');
    setCategory('');
    setContent('');
  };

  // Show loading if auth is not ready
  if (!auth) {
    return <p>Loading user info...</p>;
  }

  return (
    <div className="form-section">
      <div className="card">
        <h2>New Blog</h2>
        <div className="card-body">
          <form onSubmit={handleSubmit} id="new-blog-form" autoComplete="off">
            
            <div className="input-box">
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">Title</label>
              <div className="input-errors title">Blog title required</div>
            </div>

            <div className="input-box">
              <select
                name="category"
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=""></option>
                <option value="Mentorship and advice">Mentorship and advice</option>
                <option value="Tips">Tips</option>
                <option value="Business">Business</option>
              </select>
              <label htmlFor="category">Category</label>
              <div className="input-errors category"></div>
            </div>

            <div className="input-box">
              <label htmlFor="content">Content</label>
              <Editor
                apiKey="uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o"
                id="content"
                name="content"
                value={content}
                init={{
                  height: 300,
                  menubar: false,
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                    'link media table mergetags | addcomment showcomments | ' +
                    'spellcheckdialog a11ycheck typography uploadcare | align lineheight |' +
                    ' checklist numlist bullist indent outdent | emoticons charmap | ' +
                    'removeformat | code preview fullscreen',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount',
                    'directionality', 'fullscreen', 'undo', 'redo', 'lists'
                  ],
                  block_formats:
                    'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Code=code',
                }}
                onEditorChange={(newContent) => setContent(newContent)}
              />
              <div className="input-errors content"></div>
            </div>

            <div className="input-box">
              <button
                id="new-article-btn"
                className="btn btn-sm w-100"
                name="submit"
                type="submit"
              >
                Publish
              </button>
              <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Publishing...</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
