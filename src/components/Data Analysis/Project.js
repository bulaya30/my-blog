import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../store/actions/DataAnalysisModel";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../home/footer";

const Projects = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // const lang = i18n.language.startsWith("fr") ? "fr" : "en";
  const projects = useSelector((state) => state.dataAnalysis.projects || []);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <>
      <main id="main" className="projects-page">
        <div className="container py-5">
          {/* Hero Section */}
          <section className="hero text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">{t("projectsPage.title")}</h1>
            <p className="lead">{t("projectsPage.subtitle")}</p>
          </section>

          {/* Projects List */}
          <section className="row">
            {!projects ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-12 text-center fw-bold">
                {t("projectsPage.noProjects")}
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="col-md-4 mb-4">
                  <div className="card norrechel-card h-100 p-3">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p>
                      <strong>{t("projectsPage.tools")}:</strong>{" "}
                      {project.tools?.join(", ") || t("projectsPage.noTools")}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm hero-btn mt-2"
                      >
                        {t("projectsPage.viewProject")}
                      </a>
                    )}
                    <NavLink to={`/projects/${project.id}`} className="stretched-link">
                        <h3>{project.title}</h3>
                        </NavLink>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Projects;
