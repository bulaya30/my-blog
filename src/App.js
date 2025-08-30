import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigations/NavBar';
import Home from './components/home/Home';
import Details from './components/blog/Details';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/pages/Profile';
import BlogByCategory from './components/blog/ListByCategory';
import EditCategory from './components/category/Update';
import UpdateBlog from './components/blog/Update';
import Footer from './components/home/footer';

// Import Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom CSS
import './css/norrechel.main.css';
import './css/norrechel.profile.css';
import './css/norrechel.mobile.css';

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/blogs/:id' element={<Details />} />
            <Route path='/blogs/:id/edit' element={<UpdateBlog />} />
            <Route path='/categories/:id' element={<BlogByCategory />} />
            <Route path='/categories/:id/edit' element={<EditCategory />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
          <Footer /> 
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
