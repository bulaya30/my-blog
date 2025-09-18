import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from './footer';

export default function About() {
  const { t } = useTranslation();

  const timelineItems = [
    t('aboutPage.timeline.whoAmI', { returnObjects: true }),
    t('aboutPage.timeline.mission', { returnObjects: true }),
    t('aboutPage.timeline.whatIDo', { returnObjects: true }),
    t('aboutPage.timeline.approach', { returnObjects: true })
  ];

  return (
    <>
      <main id="main" className="about-page">
        <div className="container">

          {/* Hero Section */}
          <section className="hero text-center py-5 bg-light">
            <h1 className="display-4 fw-bold mb-3">{t('aboutPage.title')}</h1>
            <p className="lead mb-4">{t('aboutPage.subtitle')}</p>
            <NavLink to="/blogs" className="btn btn-sm hero-btn">
              {t('aboutPage.exploreBlogs')}
            </NavLink>
          </section>

          {/* Who I Am */}
          <section className="about-content py-5">
            <div className="row align-items-center">
              <div className="col-md-6 mb-4 mb-md-0 justify-content-center align-items-center">
                {/* Optional Image */}
                <img
                  src={ "logo.png" }
                  alt={"Norrechel"}
                  className="m-auto"
                  style={{ width: "240px", height: "240px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-6">
                <h2 className="mb-3">{t('aboutPage.whoAmITitle')}</h2>
                <p>{t('aboutPage.whoAmIText')}</p>
              </div>
            </div>
          </section>

          {/* My Mission */}
          <section className="about-content py-5 bg-light">
            <div className="row align-items-center">
              <div className="col-md-6 mb-4 mb-md-0">
                {/* Optional Image */}
              </div>
              <div className="col-md-6">
                <h2 className="mb-3">{t('aboutPage.missionTitle')}</h2>
                <p>{t('aboutPage.missionText')}</p>
              </div>
            </div>
          </section>

          {/* What I Do */}
          <section className="about-content py-5">
            <h2 className="text-center mb-4">{t('aboutPage.whatIDoTitle')}</h2>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-book fs-1 mb-3"></i>
                  <h3>{t('aboutPage.articlesTitle')}</h3>
                  <p>{t('aboutPage.articlesDesc')}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-data fs-1 mb-3"></i>
                  <h3>{t('aboutPage.dataProjectsTitle')}</h3>
                  <p>{t('aboutPage.dataProjectsDesc')}</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card norrechel-card p-3 h-100">
                  <i className="bx bx-rocket fs-1 mb-3"></i>
                  <h3>{t('aboutPage.techSolutionsTitle')}</h3>
                  <p>{t('aboutPage.techSolutionsDesc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* My Approach Timeline */}
          <section className="about-timeline py-5 bg-light">
            <h2 className="text-center mb-5">{t('aboutPage.timelineTitle')}</h2>
            <div className="timeline">
              {timelineItems.map((item, idx) => (
                <div key={idx} className="timeline-item mb-4">
                  <div className="timeline-content p-3 border-0 rounded shadow-sm bg-white">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Connect */}
          <section className="about-team py-5 text-center">
            <h2 className="mb-4">{t('aboutPage.ctaTitle')}</h2>
            <p>{t('aboutPage.ctaDesc')}</p>
            <NavLink to="/contact" className="btn btn-sm hero-btn mt-3">
              {t('aboutPage.ctaBtn')}
            </NavLink>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
