import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../store/actions/BlogModel';
import { Editor } from '@tinymce/tinymce-react';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Blog fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('en');

  // ----- Toast helper -----
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    console.log(toast)
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  // ----- Validation rules -----
  const validateBlog = () => {
    if (!title.trim()) return "Title is required.";
    if (title.trim().length < 5) return "Title must be at least 5 characters long.";

    if (!content.trim()) return "Content is required.";
    if (content.replace(/<[^>]+>/g, '').trim().length < 50) {
      return "Content must be at least 50 characters long.";
    }

    if (!category.trim()) return "Category is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) return showToast("User info not loaded. Please wait.");

    // Run validations
    const errorMsg = validateBlog();
    if (errorMsg) return showToast(errorMsg, 'error');

    setLoading(true);

    const blogData = {
      title: { [language]: title.trim() },
      content: { [language]: content.trim() },
      category: category.trim(),
      authorId: auth.uid,
      language: language,
    };

    try {
      const result = await dispatch(addBlog(blogData));
      if (result?.success) {
        showToast("Blog added successfully!", "success");

        // Reset form
        setTitle('');
        setContent('');
        setCategory('');
        setLanguage('en');
      } else {
        showToast(result?.error || "Failed to add blog", "error");
      }
    } catch (err) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <p>Loading user info...</p>;

  return (
    <div className="form-section">
      <div className="card border-0 shadow-sm">
        <h2>New Blog</h2>
        <div className="card-body">

          {/* Toast message */}
          {toast.message && (
            <div
              className={`toast ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-3 rounded mb-4`}
              role="alert"
            >
              {toast.message}
              {console.log(toast)}
            </div>
          )}

          <form onSubmit={handleSubmit} id="new-blog-form" autoComplete="off">

            {/* Language Selector */}
            <div className="input-box">
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
              <label htmlFor="language">Writing Language</label>
            </div>

            {/* Title */}
            <div className="input-box">
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">Title</label>
            </div>

            {/* Category */}
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
            </div>

            {/* Content */}
            <div className="input-box">
              <label htmlFor="content">Content</label>
              <Editor
                apiKey='uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o'
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
                  ],
                }}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            </div>

            {/* Submit */}
            <div className="input-box mt-3">
              <button
                id="new-article-btn"
                className="btn btn-sm w-100"
                name="submit"
                type="submit"
                style={{ display: loading ? 'none' : 'block' }}
              >
                Publish
              </button>
              <button
                className="btn btn-sm w-100 loading-btn"
                type="button"
                disabled
                style={{ display: loading ? 'block' : 'none' }}
              >
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
