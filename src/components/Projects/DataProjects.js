import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProjects } from "../store/actions/DataAnalysisModel";
import Footer from "../home/footer";

const DataProjects = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";
  const dispatch = useDispatch();
  const st = useSelector((state) => state);
  console.log(st)
  const [loading, setLoading] = useState(true);
  const projects = useSelector((state) => state.project.projects);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      await dispatch(getProjects()); // Fetch your projects from Firestore
      setLoading(false);
    };
    fetchProjects();
  }, [dispatch]);

  const safeProjects = Array.isArray(projects) ? projects : projects ? [projects] : [];

  return (
    <>
        <div className="container my-5">
        <section className="text-center mb-5">
            <h1>{t("dataProjectsPage.title")}</h1>
            <p className="lead">{t("dataProjectsPage.subtitle")}</p>
        </section>

        <div className="row">
            {loading ? (
            <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            ) : safeProjects.length === 0 ? (
            <div className="col-12 text-center fw-bold h3">
                {t("dataProjectsPage.noProjects")}
            </div>
            ) : (
            safeProjects.map((project) => (
                <div key={project.id} className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
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
        </div>
        <Footer />
    </>
  );
};

export default DataProjects;
