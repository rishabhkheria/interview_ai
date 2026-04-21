import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import './navbar.scss';

const Navbar = () => {
    const { user, handleLogout, handleUpdateProfile } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', username: '' });
    const [toastMessage, setToastMessage] = useState('');
    const dropdownRef = useRef(null);

    // Format first name
    const rawFirstName = user?.firstName || '';
    const rawUsername = user?.username || 'User';
    // If firstName exists, use it, else split username
    let firstNameFormatted = rawFirstName;
    if (!firstNameFormatted) {
        const firstPart = rawUsername.split(/[\s._-]+/)[0];
        firstNameFormatted = firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
    } else {
        firstNameFormatted = firstNameFormatted.charAt(0).toUpperCase() + firstNameFormatted.slice(1).toLowerCase();
    }

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    useEffect(() => {
        if (showAccountModal && user) {
            setEditForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || ''
            });
            setIsEditing(false);
        }
    }, [showAccountModal, user]);

    const handleSaveProfile = async () => {
        const res = await handleUpdateProfile(editForm);
        if (res.success) {
            setIsEditing(false);
            setToastMessage('✅ Updated Successfully!');
            setTimeout(() => setToastMessage(''), 3000);
        } else {
            setToastMessage('❌ ' + (res.message || 'Failed to update'));
            setTimeout(() => setToastMessage(''), 3000);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleAccountClick = () => {
        setDropdownOpen(false);
        setShowAccountModal(true);
    };

    return (
        <nav className="main-navbar">
            <Link to="/" className="main-navbar__brand">
                <img src="/logo.png" alt="Interview AI Logo" className="main-navbar__logo" />
                Interview <span className="highlight">AI</span>
            </Link>

            <div className="main-navbar__profile" ref={dropdownRef}>
                <button className="main-navbar__avatar-btn" onClick={toggleDropdown}>
                    <span className="main-navbar__greeting">Hello! {firstNameFormatted}</span>
                    <div className="main-navbar__avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                </button>

                {dropdownOpen && (
                    <div className="main-navbar__dropdown">
                        <button className="dropdown-item" onClick={handleAccountClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            Account Info
                        </button>
                        <button className="dropdown-item" onClick={onLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {showAccountModal && (
                <div className="account-modal-overlay" onClick={() => setShowAccountModal(false)}>
                    <div className="account-modal" onClick={(e) => e.stopPropagation()}>
                        
                        {!isEditing && (
                            <button className="account-modal__edit-btn" onClick={() => setIsEditing(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                        )}
                        
                        <button className="account-modal__close" onClick={() => setShowAccountModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        <div className="account-modal__avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        
                        {isEditing ? (
                            <div className="edit-profile-form">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} placeholder="First name" />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} placeholder="Last name" />
                                </div>
                                <div className="input-group">
                                    <label>Username</label>
                                    <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} placeholder="Username" />
                                </div>
                                <div className="edit-actions">
                                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className="btn-save" onClick={handleSaveProfile}>Save</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="account-modal__username">{user?.username || 'User'}</h2>
                                <p className="account-modal__email">{user?.email || 'No email available'}</p>
                                {(user?.firstName || user?.lastName) && (
                                    <p className="account-modal__fullname">{(user.firstName + ' ' + user.lastName).trim()}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {toastMessage && (
                <div className="toast-notification">
                    {toastMessage}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
