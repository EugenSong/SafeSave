import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const [username, setUsername] = useState('Guest');

    // Load saved logins from the backend
    const loadSavedLogins = async () => {
        const response = await fetch('/logins');
        const logins = await response.json();
        setSavedLogins(logins);
    }

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        const response = await fetch('/notes');
        const notesData = await response.json();
        setSavedNotes(notesData);
    }

    useEffect(() => {
        loadSavedLogins();
        loadSavedNotes();
        // Fetch username later
        setUsername('John Doe'); // Placeholder
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

    return (
        <div>
            <h1>Welcome to SafeSave, {username}!</h1> {/* Dynamic welcome message */}
            <p>Your secure vault for online credentials and notes.</p>
            <div>
                <h2>Your Saved Logins</h2>
                <ul>
                    {savedLogins.map(login => (
                        <li key={login._id}>
                            {login.name} <button onClick={() => deleteLoginRow(login._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <Link to="/createsavedlogin">Add New Login</Link>
            </div>

            <div>
                <h2>Quick Summary</h2>
                <p>You have {savedLogins.length} saved logins and {savedNotes.length} saved notes.</p>
            </div>

            <section>
                <h2>Why Use SafeSave?</h2>
                <p>With SafeSave, you can securely store your passwords and ensure they're always at your fingertips. Never forget a password again!</p>
            </section>
        </div>
    );
}

export default HomePage;
