import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../store/actions/ProjectModel";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../home/footer";

const Projects = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const lang = i18n.language.startsWith("fr") ? "fr" : "en";
  const projects = useSelector((state) => state.project.projects || []);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);
  // Ensure project is always an array
  const safeProjects = Array.isArray(projects) ? projects : projects ? [projects] : [];
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
            {!safeProjects ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : safeProjects.length === 0 ? (
              <div className="col-12 text-center fw-bold">
                {t("projectsPage.noProjects")}
              </div>
            ) : (
              safeProjects.map((project) => (
                <div key={project.id} className="col-md-4 mb-4">
                  <div className="card norrechel-card h-100 p-3">
                    <h3 className="text-center">{project.title}</h3>
                    <p>
                        <strong>{t("projectsPage.tools")}:</strong>{" "}
                        {project.tools?.join(", ") || t("projectsPage.noTools")}
                      </p>
                      <p>
                        {t("acceuilPage.by")}{" "}
                        {project.author
                          ? `${project.author.firstName || ""} ${project.author.lastName || ""}`.trim()
                          : t("acceuilPage.unknownAuthor")}{" "}
                        •{" "}
                        {project.createdAt?.toDate
                          ? project.createdAt.toDate().toLocaleDateString(i18n.language, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : t("acceuilPage.unknownDate")}
                      </p>
                    <NavLink to={`/projects/${project.id}`} className="text-center read-more">
                      {t("projectsPage.viewProject")} →
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
