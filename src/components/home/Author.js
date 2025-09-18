import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuthor, getBlog } from "../store/actions/BlogModel";
import { useTranslation } from "react-i18next";

const Author = () => {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  const [author, setAuthor] = useState(null);

  const blogs = useSelector((state) =>
    Array.isArray(state.blog.blogs)
      ? state.blog.blogs.filter((b) => b.authorId === authorId)
      : []
  );

  useEffect(() => {
    const loadAuthor = async () => {
      const data = await fetchAuthor(authorId);
      setAuthor(data);
    };

    loadAuthor();
    dispatch(getBlog());
  }, [dispatch, authorId]);

  if (!author) return <p>{t("loadingAuthor")}</p>;

  return (
    <div id="main" className="container py-3">
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-12 col-sm-12 bg-white shadow-sm p-3">
                <div className="d-flex align-items-center mb-4 p-2 author-info">
                   <div>
                        {/* Profile Picture */}
                        <img
                        src={ author.photo || "logo.png" }
                        alt={author.firstName}
                        className="rounded-circle me-3"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <div className="social-links mt-3">
                            <NavLink to={author.twitter} className="twitter mx-1"><i className="bi bi-twitter"></i></NavLink>
                            <NavLink to={author.facebook} className="facebook mx-1"><i className="bi bi-facebook"></i></NavLink>
                            <NavLink to={author.instagram} className="instagram mx-1"><i className="bi bi-instagram"></i></NavLink>
                            <NavLink to={author.linkedin} className="linkedin mx-1"><i className="bi bi-linkedin"></i></NavLink>
                        </div>
                   </div>
                   <div className="ps-3">
                     <h2>
                         {author.firstName} {author.lastName}
                     </h2>
                     <p className="mb-1">
                         <strong>{t("email")}:</strong> {author.email || ""}
                     </p>
                     <p className="mb-1">
                         <strong>{t("contact")}:</strong> {author.phone || ""}
                     </p>
                     <p className="mb-1">
                         <strong>{t("company")}:</strong> {author.company || ""}
                     </p>
                     <p className="mb-1">
                         <strong>{t("address")}:</strong> {author.address || ""}/{author.country || ""}
                     </p>
                     </div>
                </div>
            </div>
            
        </div>
        <div className="row justify-content-center mt-2">
            <div className="col-lg-6 col-md-6 col-sm-12 bg-white shadow-sm p-3">
                <h6 className="card-title fw-bold">About</h6>
                <p className="mb-1 small fst-italic">
                    {author.about || t("noBio")}
                </p>
            </div>
            
        </div>
        <div className="row justify-content-center mt-2">
            <div className="col-lg-6 col-md-6 col-sm-12 bg-white shadow-sm p-3 author-articles">
                {/* Author's Blogs */}
                <h3 className="">{t("articlesByAuthor")}</h3>
                {blogs.length === 0 ? (
                    <p>{t("noArticlesYet")}</p>
                ) : (
                    <ul className="list-group">
                        {blogs.map((blog) => (
                            <li key={blog.id} className="list-group-item">
                            <Link to={`/blogs/${blog.id}`}>{blog.title[lang]}</Link>
                            <small className="d-block text-muted">
                                {blog.createdAt?.toDate
                                ? blog.createdAt.toDate().toLocaleDateString(i18n.language, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    })
                                : t("unknownDate")}
                            </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
    // <div className="container p-5 mt-5 bg-white">
    //     <div className="row justify-content-center">
    //         <div className="col-6 col-sm-12 bg-secondary">
    //             <div className="d-flex align-items-center mb-4">
    //                 {/* Profile Picture */}
    //                 <img
    //                 src={
    //                     author.photo ||
    //                     "logo.png"
    //                 }
    //                 alt={author.firstName}
    //                 className="rounded-circle me-3"
    //                 style={{ width: "120px", height: "120px", objectFit: "cover" }}
    //                 />
    //                 <div>
    //                 <h2>
    //                     {author.firstName} {author.lastName}
    //                 </h2>
    //                 <p className="mb-1">
    //                     <strong>{t("email")}:</strong> {author.email}
    //                 </p>
    //                 </div>
    //                 <div>
    //                     <h6 className="card-title fw-bold">About</h6>
    //                     <p className="mb-1 small fst-italic">
    //                         {author.about || t("noBio")}
    //                     </p>
    //                 </div>
    //             </div>

    //         </div>
    //     </div>
    //   {/* Author Info */}

    //   {/* Author's Blogs */}
    //   <h3 className="mt-5">{t("articlesByAuthor")}</h3>
    //   {blogs.length === 0 ? (
    //     <p>{t("noArticlesYet")}</p>
    //   ) : (
    //     <ul className="list-group">
    //       {blogs.map((blog) => (
    //         <li key={blog.id} className="list-group-item">
    //           <Link to={`/blogs/${blog.id}`}>{blog.title[lang]}</Link>
    //           <small className="d-block text-muted">
    //             {blog.createdAt?.toDate
    //               ? blog.createdAt.toDate().toLocaleDateString(i18n.language, {
    //                   month: "short",
    //                   day: "numeric",
    //                   year: "numeric",
    //                 })
    //               : t("unknownDate")}
    //           </small>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
};

export default Author;
