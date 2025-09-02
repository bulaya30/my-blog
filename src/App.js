import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigations/NavBar';
import Acceuil from './components/home/Acceuil';
import Details from './components/blog/Details';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/pages/Profile';
import BlogByCategory from './components/blog/ListByCategory';
import EditCategory from './components/category/Update';
import UpdateBlog from './components/blog/Update';
import { SidebarProvider } from './components/context/sidebarContext';

// Import Bootstrap & CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import './css/norrechel.style.css';
import './css/norrechel.profile.css';
import './css/norrechel.mobile.css';

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <SidebarProvider>
          <div className="App">
            <NavBar />
            <Routes>
              <Route exact path='/' element={<Acceuil />} />
              <Route path='/blogs/:id' element={<Details />} />
              <Route path='/blogs/:id/edit' element={<UpdateBlog />} />
              <Route path='/categories/:id' element={<BlogByCategory />} />
              <Route path='/categories/:id/edit' element={<EditCategory />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    );
  }
}

export default App;
