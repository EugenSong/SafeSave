// SavedLoginsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Import React components
import SavedLoginList from '../components/SavedLoginList';

function SavedLoginsPage() {
    const [savedLogins, setSavedLogins] = useState([]);

    // Load saved logins from the backend
    const loadSavedLogins = async () => {
        const response = await fetch(`/login_items/users/${userID}`);
        const logins = await response.json();
        setSavedLogins(logins);
    }

    useEffect(() => {
        loadSavedLogins();
    }, []);

    const deleteLoginRow = async _id => {
        const response = await fetch(`/logins/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    }

    // UPDATE a row
    const history = useNavigate();
    const editLoginRow = async login => {
        setLogin(login);
        history.push("/edit-login");
    }

    return (
        <div>
            <h1>Your Saved Logins</h1>
            <div className="login-item-list">
                <SavedLoginList
                    loginItems={savedLogins}
                    editLoginItem={editLoginRow}
                    deleteLoginItem = {deleteLoginRow}
                />
            </div>
            <Link to="/createsavedlogin">Add New Login</Link>
        </div>
    );
}

export default SavedLoginsPage;
