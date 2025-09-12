import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getBlog, deleteBlog } from '../store/actions/BlogModel';
import DOMPurify from 'dompurify';
import Footer from '../home/footer';
import { useTranslation } from 'react-i18next';
// import Footer from './footer';

const Details = ({ admin, blog, auth, getBlog, deleteBlog }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  // Fetch blog
  useEffect(() => {
    getBlog('id', id);
  }, [id, getBlog]);

  const handleDelete = async () => {
    await deleteBlog(id);
    navigate(-1);
  };

  if (!blog) return <p>{t('loadingBlog')}</p>;
  return (
    <>
      <div className="container p-5 mt-5 bg-white">
        <h2 className="text-center">
          <strong>{blog.title[lang]}</strong>
        </h2>

        <div className="row">
          <div className="col-12">
            <p className="ms-4">
              {t('category')}: <strong>{blog.category}</strong>
            </p>
            <div className="blog-details-content">
              <div
                className="blog-div-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content[lang]),
                }}
              />

              {/* Show Edit/Delete only if user is blog owner */}
              {auth && blog.authorId === auth.uid ? (
                <>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDelete}
                    title={t('deleteThisArticle')}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <Link
                    className="btn btn-primary mt-3 ms-2"
                    to={`/blogs/${id}/edit`}
                    title={t('updateThisArticle')}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </>
              ) : (
                admin && (
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDelete}
                    title={t('deleteThisArticle')}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )
              )}

              {/* CreatedAt safe render */}
              <p className="mt-4 text-end">
                {t('writtenBy')}{' '}
                {blog.author ? (
                  <Link to={`author/${blog.author.id}`}>
                    {blog.author.firstName.trim() || ''}{' '}
                    {blog.author.lastName.trim() || ''}
                  </Link>
                ) : (
                  t('unknownAuthor')
                )}{' '}
                <br />
                {t('publishedIn')}{' '}
                {blog.createdAt?.toDate
                  ? blog.createdAt.toDate().toLocaleDateString(i18n.language, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : t('unknownDate')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => ({
  blog: state.blog.blogs,
  auth: state.auth.user,
  admin: state.auth.isAdmin,
});

const mapDispatchToProps = {
  getBlog,
  deleteBlog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
