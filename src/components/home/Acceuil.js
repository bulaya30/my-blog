import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next"; // ✅ import i18next
import { getBlog } from '../store/actions/BlogModel';
import { addSubscriber } from '../store/actions/SubscriberModel';
import Footer from './footer';

function Acceuil() {
  const { t, i18n } = useTranslation(); // ✅ use t()
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const blogs = useSelector(state => state.blog.blogs);
  const { error } = useSelector(state => state);

  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  if (!blogs || blogs.length === 0) {
    return <div>{t("loadingBlogs")}</div>; // ✅ translated
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addSubscriber(email));
    if (result.success) {
      alert(t("subscribeSuccess")); // ✅ translated
      setEmail('');
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <div id="main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero text-center py-5 d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-5 fw-bold mb-3">{t("heroTitle")}</h1>
            <p className="lead mb-4">{t("heroSubtitle")}</p>
            <NavLink to="/blogs" className="btn btn-sm px-4 hero-btn">
              {t("exploreBlogs")}
            </NavLink>
          </section>

          {/* Featured Categories */}
          <section className="home-categories home-section my-5">
            <h2 className="mb-4 text-center">{t("focusAreas")}</h2>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-brain fs-1 mb-3"></i>
                  <h3>{t("personalGrowthTitle")}</h3>
                  <p>{t("personalGrowthDesc")}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-star fs-1 mb-3"></i>
                  <h3>{t("valueImpactTitle")}</h3>
                  <p>{t("valueImpactDesc")}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-rocket fs-1 mb-3"></i>
                  <h3>{t("goalAchievementTitle")}</h3>
                  <p>{t("goalAchievementDesc")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest Blogs */}
          <section className="latest-blogs home-section my-5">
            <h2 className="mb-4 text-center">{t("latestBlogs")}</h2>
            <div className="row">
              {Array.isArray(blogs) &&
                blogs.slice(0, 3).map((blog) => (
                  <div key={blog.id} className="col-md-4 mb-4">
                    <div className="blog-card norrechel-card p-3 h-100">
                      <h3>{blog.title}</h3>
                      <p>
                        {t("by")}{" "}
                        {blog.author
                          ? `${blog.author.firstName || ""} ${
                              blog.author.lastName || ""
                            }`.trim()
                          : t("unknownAuthor")}{" "}
                        •{" "}
                        {blog.createdAt?.toDate
                          ? blog.createdAt
                              .toDate()
                              .toLocaleDateString(i18n.language, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                          : t("unknownDate")}
                      </p>
                      <NavLink to={`/blogs/${blog.id}`} className="read-more">
                        {t("readMore")} →
                      </NavLink>
                    </div>
                  </div>
                ))}
            </div>
            <div className="text-center mt-3">
              <NavLink to="/blogs" className="btn hero-btn">
                {t("viewAllBlogs")}
              </NavLink>
            </div>
          </section>

          {/* About */}
          <section className="about home-section bg-white container mb-3 py-4 text-center">
            <h2>{t("aboutTitle")}</h2>
            <p className="lead">{t("aboutText")}</p>
            <NavLink to="/about" className="hero-btn btn mt-3">
              {t("learnMore")}
            </NavLink>
          </section>

          {/* Newsletter */}
          <section className="newsletter container text-center my-5">
            <h2>{t("newsletterTitle")}</h2>
            <p>{t("newsletterDesc")}</p>

            <form className="d-flex justify-content-center" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn sub-btn">
                {t("subscribeBtn")}
              </button>
            </form>

            {error && <p className="text-danger mt-2">{error}</p>}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Acceuil;
