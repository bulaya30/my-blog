import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Notifications from './Notifications'

export class Dashboard extends Component {
  render() {
    return (
      <article className="dashboard">
        <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 mb-2">
                <div className="row">
                    {/* Visit card */}
                    <div className="col-lg-6 col-md-6 mb-2">
                        <div className="card border-0 shadow-small info-card visits-card">
                            <div className="filter">
                                <NavLink to='#' className="icon" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></NavLink>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li className="dropdown-header text-start"><h6>Filter</h6></li>            
                                    <li><NavLink to='#' className="dropdown-item">Today</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Month</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Year</NavLink></li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Visits <span>| Today</span></h5>            
                                <div className="d-flex align-items-center">                                        
                                    <div className="ps-3">
                                        <h6>145</h6>
                                        <span className="text-success small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">increase</span>            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Comment card */}
                    <div className="col-lg-6 col-md-6">
                        <div className="card border-0 info-card visits-card">
                            <div className="filter">
                                <NavLink to='#' className="icon" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></NavLink>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li className="dropdown-header text-start"><h6>Filter</h6></li>        
                                    <li><NavLink to='#' className="dropdown-item">Today</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Month</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Year</NavLink></li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Comments <span>| Today</span></h5>            
                                <div className="d-flex align-items-center">                                        
                                    <div className="ps-3">
                                        <h6>25</h6>
                                        <span className="text-success small pt-1 fw-bold">5%</span> <span className="text-muted small pt-2 ps-1">increase</span>            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Recently viewed */}
                    <div className="col-12">
                        <div className="card recent-view overflow-auto mt-3 info-card">
                            <div className="filter">
                                <NavLink to='#' className="icon" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></NavLink>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li className="dropdown-header text-start"> <h6>Filter</h6> </li>
                                    <li><NavLink to='#' className="dropdown-item">Today</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Month</NavLink></li>
                                    <li><NavLink to='#' className="dropdown-item">This Year</NavLink></li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Recent Viewed <span>| Today</span></h5>
                                <table className="table table-borderless datatable">
                                    <thead>
                                        <tr>
                                            <th scope="col">Visitor</th>
                                            <th scope="col">Article</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Brandon Jacob</td>
                                            <td><a href="/blog">Self-Mastery</a></td>
                                            <td>09/July/2025</td>
                                            <td>03:20 PM</td>
                                        </tr>
                                        <tr>
                                            <td>Bridie Kessler</td>
                                            <td><a href="/blog">Time Management</a></td>
                                            <td>05/July/2025</td>
                                            <td>11:45 AM</td>
                                        </tr>                   
                                        <tr>
                                            <td>Jack Ma</td>
                                            <td><a href="/blog">Developping a strong Mindset</a></td>
                                            <td>03/July/2025</td>
                                            <td>10:30 AM</td>
                                        </tr>
                                        <tr>
                                            <td>John Falase</td>
                                            <td><a href="/blog">Leadership</a></td>
                                            <td>01/July/2025</td>
                                            <td>02:30 PM</td>
                                        </tr>                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-8 col-sm-12">
                <Notifications />  
            </div>
        </div>
      </article>
    )
  }
}

export default Dashboard
