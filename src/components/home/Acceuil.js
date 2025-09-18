import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { getBlog } from '../store/actions/BlogModel';
// import DataProjects from '../Data Analysis/DataProjects';
import { getProjects } from '../store/actions/DataAnalysisModel';
import { addSubscriber } from '../store/actions/SubscriberModel';
import Footer from './footer';

function Acceuil() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  const [email, setEmail] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const blogs = useSelector(state => state.blog.blogs);
  const projects = useSelector(state => state.dataAnalysis.projects);

  // Ensure blogs and projects are always arrays
  const safeBlogs = Array.isArray(blogs) ? blogs : blogs ? [blogs] : [];
  const safeProjects = Array.isArray(projects) ? projects : projects ? [projects] : [];

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBlogs(true);
      setLoadingProjects(true);
      await dispatch(getBlog());
      await dispatch(getProjects());
      setLoadingBlogs(false);
      setLoadingProjects(false);
    };
    fetchData();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addSubscriber(email));
    if (result.success) {
      alert(t("acceuilPage.subscribeSuccess"));
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
            <h1 className="display-5 fw-bold mb-3">{t("acceuilPage.heroTitle")}</h1>
            <p className="lead mb-4">{t("acceuilPage.heroSubtitle")}</p>
            <NavLink to="/blogs" className="btn btn-sm px-4 hero-btn">
              {t("acceuilPage.exploreBlogs")}
            </NavLink>
          </section>

          {/* Focus Areas */}
          <section className="home-categories home-section my-5">
            <h2 className="mb-4 text-center">{t("acceuilPage.focusAreas")}</h2>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-brain fs-1 mb-3"></i>
                  <h3>{t("acceuilPage.personalGrowthTitle")}</h3>
                  <p>{t("acceuilPage.personalGrowthDesc")}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-star fs-1 mb-3"></i>
                  <h3>{t("acceuilPage.dataProjectsTitle")}</h3>
                  <p>{t("acceuilPage.dataProjectsDesc")}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-rocket fs-1 mb-3"></i>
                  <h3>{t("acceuilPage.techSolutionsTitle")}</h3>
                  <p>{t("acceuilPage.techSolutionsDesc")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest Blogs */}
          <section className="latest-blogs home-section my-5">
            <h2 className="mb-4 text-center">{t("acceuilPage.latestBlogs")}</h2>
            <div className="row">
              {loadingBlogs ? (
                <div className="col-12 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : !blogs || blogs.length === 0 ? (
                <div className="col-12">
                  <div className="blog-card norrechel-card p-3 h-100 text-center fw-bold h3">
                    {t("acceuilPage.noBlogsYet")}
                  </div>
                </div>
              ) : (
                safeBlogs.slice(0, 3).map((blog) => (
                  <div key={blog.id} className="col-md-4 mb-4">
                    <div className="blog-card norrechel-card p-3 h-100">
                      <h3>{blog.title[lang]}</h3>
                      <p>
                        {t("acceuilPage.by")}{" "}
                        {blog.author
                          ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim()
                          : t("acceuilPage.unknownAuthor")}{" "}
                        •{" "}
                        {blog.createdAt?.toDate
                          ? blog.createdAt.toDate().toLocaleDateString(i18n.language, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : t("acceuilPage.unknownDate")}
                      </p>
                      <NavLink to={`/blogs/${blog.id}`} className="read-more">
                        {t("acceuilPage.readMore")} →
                      </NavLink>
                    </div>
                  </div>
                ))
              )}
            </div>
            {blogs && blogs.length !== 0 && (
              <div className="text-center mt-3">
                <NavLink to="/blogs" className="btn hero-btn">
                  {t("acceuilPage.viewAllBlogs")}
                </NavLink>
              </div>
            )}
          </section>

          {/* Data Analysis Projects Section */}
          <section className="latest-blogs home-section my-5">
            <h2 className="mb-4 text-center">{t("dataProjectsPage.title")}</h2>
            <p className="text-center mb-4">{t("dataProjectsPage.subtitle")}</p>
            <div className="row">
              {loadingProjects ? (
                <div className="col-12 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : !projects || projects.length === 0 ? (
                <div className="col-12 text-center fw-bold h3">
                  {t("dataProjectsPage.noProjects")}
                </div>
              ) : (
                safeProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="col-md-4 mb-4">
                    <div className="blog-card norrechel-card p-3 h-100">
                      <h3>{project.title[lang]}</h3>
                      <p>{project.description[lang]}</p>
                      <NavLink to={`/projects/${project.id}`} className="read-more">
                        {t("dataProjectsPage.viewProject")}
                      </NavLink>
                    </div>
                  </div>
                ))
              )}
            </div>
            {projects && projects.length !== 0 && (
              <div className="text-center mt-3">
                <NavLink to="/projects" className="btn hero-btn">
                  {t("dataProjectsPage.viewAllProjects")}
                </NavLink>
              </div>
            )}
          </section>

          {/* About */}
          <section className="about home-section bg-white container mb-3 py-4 text-center">
            <h2>{t("acceuilPage.aboutSection.title")}</h2>
            <p className="lead">{t("acceuilPage.aboutSection.text")}</p>
            <NavLink to="/about" className="hero-btn btn mt-3">
              {t("acceuilPage.aboutSection.learnMore")}
            </NavLink>
          </section>

          {/* Newsletter */}
          <section className="newsletter container text-center my-5">
            <h2>{t("acceuilPage.newsletterTitle")}</h2>
            <p>{t("acceuilPage.newsletterDesc")}</p>
            <form className="d-flex justify-content-center" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={t("acceuilPage.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn sub-btn">
                {t("acceuilPage.subscribeBtn")}
              </button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Acceuil;
