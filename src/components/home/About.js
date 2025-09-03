import React from 'react';
import { NavLink } from 'react-router-dom';
// import missionImg from '../assets/mission.jpg'; // replace with your actual image

export default function About() {
  return (
    <main id="main" className="about-page">
      <div className="container">

        {/* Hero Section */}
        <section className="hero text-center py-5 bg-light">
          <h1 className="display-4 fw-bold mb-3">About Norrechel</h1>
          <p className="lead mb-4">
            Empowering young people to discover their potential and rise to their goals.
          </p>
          <NavLink to="/blogs" className="btn btn-sm hero-btn">
            Explore Our Blogs
          </NavLink>
        </section>

        {/* Mission Section */}
        <section className="about-content py-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* <img src={missionImg} alt="Mission" className="img-fluid rounded shadow" /> */}
            </div>
            <div className="col-md-6">
              <h2 className="mb-3">Our Mission</h2>
              <p>
                Norrechel is dedicated to helping young people discover their potential, develop their character,
                raise their value, and commit to actions that move them closer to achieving their goals.
              </p>
              <p>
                Through thoughtful articles, guides, and mentorship insights, we aim to inspire growth, self-confidence,
                and a mindset focused on success.
              </p>
              <NavLink to="/contact" className="btn btn-sm hero-btn mt-3">
                Join Norrechel
              </NavLink>
            </div>
          </div>
        </section>

        {/* Vision Timeline */}
        <section className="about-timeline py-5 bg-light">
          <h2 className="text-center mb-5">Our Vision Journey</h2>
          <div className="timeline">
            {[
              { title: "Discover Potential", desc: "Encourage young people to identify their strengths and passions." },
              { title: "Develop Character", desc: "Provide resources to nurture integrity, resilience, and leadership skills." },
              { title: "Raise Value", desc: "Empower our audience to increase their personal and professional value." },
              { title: "Commit to Goals", desc: "Motivate them to take consistent actions that lead to real achievements." }
            ].map((item, idx) => (
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
          <h2 className="mb-4">Start Your Journey Today</h2>
          <p>We believe every young person has the potential to achieve greatness. Take the first step with us.</p>
          <NavLink to="/contact" className="btn btn-sm hero-btn mt-3">Join Norrechel</NavLink>
        </section>

      </div>
    </main>
  );
}
