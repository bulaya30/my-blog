import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBlog, deleteBlog } from "../store/actions/BlogModel";
import DOMPurify from "dompurify";
import Footer from "../home/footer";
import { useTranslation } from "react-i18next";

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) =>
    Array.isArray(state.blog.blogs)
      ? state.blog.blogs.find((b) => b.id === id)
      : state.blog.blogs?.id === id
      ? state.blog.blogs
      : null
  );
  const auth = useSelector((state) => state.auth.user);
  const admin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  // Fetch blog on mount
  useEffect(() => {
    dispatch(getBlog("id", id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deleteBlog(id));
    navigate(-1);
  };

  if (!blog) return <p>{t("loadingBlog")}</p>;

  return (
    <>
      <div className="container pt-5 mt-5 bg-white">
        <h2 className="text-center">
          <strong>{blog.title[lang]}</strong>
        </h2>

        <div className="row">
          <div className="col-12">
            <p className="ms-4">
              {t("category")}: <strong>{blog.category}</strong>
            </p>
            <div className="blog-details-content">
              <div
                className="blog-div-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content[lang]),
                }}
              />

              {/* Show Edit/Delete buttons */}
              {auth && blog.authorId === auth.uid ? (
                <>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDelete}
                    title={t("deleteThisArticle")}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <Link
                    className="btn btn-primary mt-3 ms-2"
                    to={`/blogs/${id}/edit`}
                    title={t("updateThisArticle")}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </>
              ) : (
                admin && (
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handleDelete}
                    title={t("deleteThisArticle")}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )
              )}

              {/* Author and Date */}
              <p className="mt-4 text-end">
                {t("writtenBy")}{" "}
                {blog.author ? (
                  <button
                    onClick={() => navigate(`/author/${blog.author.id}`)}
                    className="btn btn-link m-0 p-0"
                  >
                    {blog.author.lastName} {blog.author.firstName}
                  </button>
                ) : (
                  t("unknownAuthor")
                )}
                <br />
                {t("publishedIn")}{" "}
                {blog.createdAt?.toDate
                  ? blog.createdAt.toDate().toLocaleDateString(i18n.language, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : t("unknownDate")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Details;
