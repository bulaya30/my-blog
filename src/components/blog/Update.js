import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBlog, updateBlog } from '../store/actions/BlogModel';
import { getCategory } from '../store/actions/categoryModel';
import { Editor } from '@tinymce/tinymce-react';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.user);
  const blog = useSelector((state) =>
    Array.isArray(state.blog.blogs)
      ? state.blog.blogs.find((b) => b.id === id)
      : state.blog.blogs?.id === id
      ? state.blog.blogs
      : null
  );
  const category = useSelector((state) => state.category.categories || []);
  const [title, setTitle] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch blog and categories on mount
  useEffect(() => {
    dispatch(getBlog('id', id));
    dispatch(getCategory());
  }, [dispatch, id]);

  // Populate form when blog data is available
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setCategoryValue(blog.category || '');
      setContent(blog.content || '');
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedBlog = {
      title,
      authorId: auth.uid,
      category: categoryValue,
      content
    };
    try {
      dispatch(updateBlog(id, updatedBlog));
      navigate(-1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (setter) => (e) => setter(e.target.value);

  // Handle editor changes
  const handleEditorChange = (newContent) => setContent(newContent);

  if (!auth) return <p>Loading user info...</p>;
  if (!blog) return <p>Loading blog...</p>;

  return (
    <div id="main">
      <div className="container">
        <div className="row">
          <div className="form-section">
            <div className="card mt-3">
              <h2>Update Blog</h2>
              <div className="card-body">
                <form onSubmit={handleSubmit} id="new-blog-form" autoComplete="off">
                  <div className="row mb-3">
                    <div className="errors hide">error</div>
                    <div className="success-container">success</div>
                  </div>

                  <div className="input-box">
                    <input type="hidden" name="id" value={id} />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={title}
                      onChange={handleChange(setTitle)}
                    />
                    <label htmlFor="title">Title</label>
                  </div>

                  <div className="input-box">
                    <select
                      name="category"
                      id="category"
                      required
                      value={categoryValue}
                      onChange={handleChange(setCategoryValue)}
                    >
                      <option value="">Select a category</option>
                      {category.map((cat) => (
                        <option key={cat.id || cat} value={cat.name || cat}>
                          {cat.name || cat}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="category">Category</label>
                  </div>

                  <div className="input-box">
                    <label htmlFor="content">Content</label>
                    <Editor
                      apiKey="uw12u5jyw7fsvuxv9x7tp76nm2s5plzg8dqcwu60fz5jt28o"
                      id="content"
                      value={content}
                      init={{
                        height: 500,
                        menubar: false,
                        toolbar:
                          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                          'link media table mergetags | addcomment showcomments | ' +
                          'spellcheckdialog a11ycheck typography uploadcare | align lineheight |' +
                          ' checklist numlist bullist indent outdent | emoticons charmap | ' +
                          'removeformat | code preview fullscreen',
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                          'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                          'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                        ],
                        block_formats:
                          'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Code=code'
                      }}
                      onEditorChange={handleEditorChange}
                    />
                  </div>

                  <div className="input-box">
                    {!loading ? (
                      <button id="new-article-btn" className="btn btn-sm w-100" type="submit">
                        Save changes
                      </button>
                    ) : (
                      <button className="btn btn-sm w-100 loading-btn" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Saving...</span>
                      </button>
                    )}
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

export default UpdateBlog;
