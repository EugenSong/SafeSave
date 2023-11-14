import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateSavedNotePage() {
    const [noteDetails, setNoteDetails] = useState({
        title: '',
        content: '',
        userID: null,
        userPassword: ''
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setNoteDetails(prevState => ({
                ...prevState,
                userID: location.state.userID,
                userPassword: location.state.password
            }));
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNoteDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNoteCreation = async (e) => {
        e.preventDefault();

        const { title, content, userID } = noteDetails;

        const newNote = {
            title,
            content,
            userNoteDateCreated: new Date().toISOString(),
            userNoteDateUpdated: new Date().toISOString(),
            userID: userID 
        };

        try {
            const response = await fetch('/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                alert('Note saved successfully!');
                navigate('/savednotes', { state: { userID: userID, password: noteDetails.userPassword } });
            } else {
                const errorMessage = await response.text();
                alert(`Failed to save note. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error}`);
        }
    };

    return (
        <div>
            <h1>Create a New Note</h1>
            <form onSubmit={handleNoteCreation}>
                <label>
                    Title:
                    <input 
                        type="text" 
                        name="title"
                        value={noteDetails.title} 
                        onChange={handleInputChange} 
                        placeholder="Note title"
                        required
                    />
                </label>
                <br/>
                <label>
                    Content:
                    <textarea 
                        name="content"
                        value={noteDetails.content} 
                        onChange={handleInputChange} 
                        placeholder="Write your note here..."
                        required
                    />
                </label>
                <br/>
                <button type="submit">Save Note</button>
            </form>
        </div>
    );
}

export default CreateSavedNotePage;
