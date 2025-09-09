import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

 const timelineItems = [
    t('aboutPage.timeline.discover', { returnObjects: true }),
    t('aboutPage.timeline.character', { returnObjects: true }),
    t('aboutPage.timeline.value', { returnObjects: true }),
    t('aboutPage.timeline.goals', { returnObjects: true })
  ];


  return (
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

        {/* Mission Section */}
        <section className="about-content py-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Optional Image */}
            </div>
            <div className="col-md-6">
              <h2 className="mb-3">{t('aboutPage.missionTitle')}</h2>
              <p>{t('aboutPage.mission1')}</p>
              <p>{t('aboutPage.mission2')}</p>
              <NavLink to="/contact" className="btn btn-sm hero-btn mt-3">
                {t('aboutPage.join')}
              </NavLink>
            </div>
          </div>
        </section>

        {/* Vision Timeline */}
        <section className="about-timeline py-5 bg-light">
          <h2 className="text-center mb-5">{t('aboutPage.visionJourney')}</h2>
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

        {/* Call to Action */}
        <section className="about-team py-5 text-center">
          <h2 className="mb-4">{t('aboutPage.ctaTitle')}</h2>
          <p>{t('aboutPage.ctaDesc')}</p>
          <NavLink to="/contact" className="btn btn-sm hero-btn mt-3">
            {t('aboutPage.join')}
          </NavLink>
        </section>

      </div>
    </main>
  );
}
