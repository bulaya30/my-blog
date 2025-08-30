import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/home.css'; // your existing CSS
import 'boxicons/css/boxicons.min.css';

const HomePage = () => {
  return (
    <div className="home-page">

      
      {/* Hero Section */}
      <section className="hero text-center">
        <h1>Discover Insightful Articles</h1>
        <p>Your go-to hub for blogs on tech, creativity, and more.</p>
        <NavLink to="/blogs" className="btn">Explore Blogs</NavLink>
      </section>

      {/* Categories */}
      <section className="categories container">
        <h2>Featured Categories</h2>
        <div className="grid">
          <div className="card">
            <i className="bx bx-code"></i>
            <h3>Technology</h3>
            <p>Latest trends and coding tips.</p>
          </div>
          <div className="card">
            <i className="bx bx-brain"></i>
            <h3>Education</h3>
            <p>Guides and resources to learn faster.</p>
          </div>
          <div className="card">
            <i className="bx bx-paint"></i>
            <h3>Design</h3>
            <p>Creative inspiration and tools.</p>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="latest-blogs container">
        <h2>Latest Blogs</h2>
        <div className="grid">
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x180" alt="Blog thumbnail" />
            <h3>How to Build Better Apps</h3>
            <p>By John Doe • Aug 30, 2025</p>
            <NavLink to="/blogs/1" className="read-more">Read More →</NavLink>
          </div>
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x180" alt="Blog thumbnail" />
            <h3>UI Design in 2025</h3>
            <p>By Jane Smith • Aug 29, 2025</p>
            <NavLink to="/blogs/2" className="read-more">Read More →</NavLink>
          </div>
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x180" alt="Blog thumbnail" />
            <h3>AI for Beginners</h3>
            <p>By Alex Roe • Aug 28, 2025</p>
            <NavLink to="/blogs/3" className="read-more">Read More →</NavLink>
          </div>
        </div>
        <NavLink to="/blogs" className="btn">View All Blogs</NavLink>
      </section>

      {/* About */}
      <section className="about container">
        <h2>About This Site</h2>
        <p>This blog was created to share knowledge and inspire curious minds. Whether you’re into coding, design, or creative writing, there’s something here for you.</p>
        <NavLink to="/about" className="btn">Learn More</NavLink>
      </section>

      {/* Newsletter */}
      <section className="newsletter container text-center">
        <h2>Stay Updated!</h2>
        <p>Get the latest articles straight to your inbox.</p>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit" className="btn">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-4">
        <p>© 2025 MyBlog. All rights reserved.</p>
        <div className="socials">
          <a href="#"><i className="bx bxl-facebook"></i></a>
          <a href="#"><i className="bx bxl-twitter"></i></a>
          <a href="#"><i className="bx bxl-instagram"></i></a>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
