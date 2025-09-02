import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getBlog } from '../store/actions/BlogModel'
import { connect } from 'react-redux'
import Category from '../category/List'
import Footer from './footer'

function Acceuil() {
    const blogs = useSelector(state=>state);
   console.log(blogs);
    // const latestBlogs = blogs.slice(0, 3);
    // console.log(latestBlogs);

  return (
    <>
    <div id="main">
        <div className="container">
            {/* Hero Section */}
            <section className="hero text-center py-5 d-flex flex-column justify-content-center align-items-center">
                <h1 className="display-5 fw-bold mb-3">
                    Discover Insightful Articles
                </h1>
                <p className="lead mb-4">
                    Your go-to hub for blogs on tech, creativity, and more.
                </p>
                <NavLink 
                    to="/blogs" 
                    className="btn btn-primary btn-lg px-4 hero-btn"
                >
                    Explore Blogs
                </NavLink>
            </section>
            {/* Categories */}
            <section className="home-categories home-section container">
                <h2>Featured Categories</h2>
                <div className="grid">
                    <div className="card norrechel-card">
                        <i className="bx bx-code"></i>
                        <h3>Technology</h3>
                        <p>Latest trends and coding tips.</p>
                    </div>
                    <div className="card norrechel-card">
                        <i className="bx bx-brain"></i>
                        <h3>Mentorship</h3>
                        <p>Guides and resources to learn faster.</p>
                    </div>
                    <div className="card norrechel-card">
                        <i className="bx bx-paint"></i>
                        <h3>Business</h3>
                        <p>Run and Manage your Business.</p>
                    </div>
                </div>
            </section>
            {/* Latest Blogs */}
            <section className="latest-blogs home-section container">
                <h2>Latest Blogs</h2>
                <div className="grid mb-3">
                    <div className="blog-card norrechel-card">                        
                        <h3>How to Build Better Apps</h3>
                        <p>By John Doe • Aug 30, 2025</p>
                        <NavLink to="/blogs/1" className="read-more">Read More →</NavLink>
                    </div>
                    <div className="blog-card norrechel-card">
                        <h3>UI Design in 2025</h3>
                        <p>By Jane Smith • Aug 29, 2025</p>
                        <NavLink to="/blogs/2" className="read-more">Read More →</NavLink>
                    </div>
                    <div className="blog-card norrechel-card">
                        <h3>AI for Beginners</h3>
                        <p>By Alex Roe • Aug 28, 2025</p>
                        <NavLink to="/blogs/3" className="read-more">Read More →</NavLink>
                    </div>
                </div>
                <NavLink to="/blogs" className="hero-btn">View All Blogs</NavLink>
            </section>
            {/* About */}
            <section className="about home-section bg-white container mb-3">
                <h2>About This Site</h2>
                <p>This blog was created to share knowledge and inspire curious minds. Whether you’re into coding, design, or creative writing, there’s something here for you.</p>
                <NavLink to="/about" className="hero-btn">Learn More</NavLink>
            </section>
            
            {/* Newsletter */}
            <section className="newsletter container text-center">
                <h2>Stay Updated!</h2>
                <p>Get the latest articles straight to your inbox.</p>
                <form className='d-flex'>
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit" className="btn sub-btn">Subscribe</button>
                </form>
            </section>
        </div>
    </div>
    <Footer />
    </>
  )
}
export default Acceuil;