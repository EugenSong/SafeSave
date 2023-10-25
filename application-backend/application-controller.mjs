import 'dotenv/config';
import express from 'express';
import * as appModel from './application-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

const userRouter = express.Router();
const loginItemRouter = express.Router();
const notesRouter = express.Router();

app.use('/users', userRouter);
app.use('/login_items', loginItemRouter);
app.use('/notes', notesRouter);

// CREATE (POST) controller ******************************************

// POST REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

// POST Users Table endpoint ****************************************************
userRouter.post('/', (req,res) => {
    appModel.createUser(req.body, (err, result) => { 
        if (err !== null) {
            if (err.code === "EMPTY_FIELD") res.status(406).send({"error": `${err.code} - Not all fields populated.`});
            else if (err.code === 'ER_DUP_ENTRY') res.status(409).send({"error": `${err.code} - Conflict between entered values and data in database.`});
            else res.status(400).send({"error": `Bad Request.`});
        }
        else {
            if (result.length == 0) res.status(400).send({"error": "Could not create user."});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({"insertId": `${result.insertId}`});
            }
        }
    })
});

// POST UserLoginItems Table endpoint ****************************************************
loginItemRouter.post('/', (req,res) => { 
    appModel.createUserLoginItem(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "EMPTY_FIELD") res.status(406).send({"error": `${err.code} - Not all fields populated.`});
            else res.status(400).send({"error": `${err.code} - Bad Request.`});
        }
        else {
            if (result.length == 0) res.status(400).send({"error": "Could not create user login item"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({"insertId": `${result.insertId}`});
            }
        }
    })
});

// POST UserNotes Table endpoint ****************************************************
notesRouter.post('/', (req,res) => { 
    appModel.createUserNote(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "EMPTY_FIELD") res.status(406).send({"error": `${err.code} - Not all fields populated.`});
            else res.status(400).send({"error": `${err.code} - Bad Request.`});
        }
        else {
            if (result.length == 0) res.status(400).send({"error": "Could not create user login item"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(201).send({"insertId": `${result.insertId}`});
            }
        }
    })
});

// GET HTTP ENDPOINTS ****************************************************

// GET Users Table endpoints ****************************************************
userRouter.get('/', (req,res) => { 
    appModel.getAllUsers((err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "Could not retrieve user from specified username"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

userRouter.get('/:username', (req,res) => { 
    appModel.getUserByUsername(req.params.username, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "Could not retrieve user from specified username"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

// GET UserLoginItems Table endpoints ****************************************************
loginItemRouter.get('/', (req,res) => { 
    appModel.getAllLoginItems((err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "Could not retrieve user login items"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

loginItemRouter.get('/users/:id', (req,res) => { 
    appModel.getSingleUserLoginItems(req.params.id, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

loginItemRouter.get('/users/:id/website/:website', (req,res) => { 
    appModel.getUserLoginItemByWebsite(req.params.id, req.params.website, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID with given website"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

loginItemRouter.get('/users/:id/username/:username', (req,res) => { 
    appModel.getUserLoginItemByUsername(req.params.id, req.params.username, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID with given username"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

// GET UserNotes Table endpoints ****************************************************
notesRouter.get('/', (req,res) => { 
    appModel.getAllUserNotes((err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "Could not retrieve user notes"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

notesRouter.get('/users/:id', (req,res) => { 
    appModel.getSingleUserNotes(req.params.id, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "No notes found for specified user ID"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
    })
});

notesRouter.get('/users/:id/title/:title', (req,res) => { 
    appModel.getUserNoteByTitle(req.params.id, req.params.title, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.length == 0) res.status(404).send({"error": "No notes found for specified user ID with given title"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        } 
    })
});

// UPDATE (PATCH) controller ************************************

// PATCH REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT


userRouter.patch('/', (req,res) => { 
    appModel.patchUser(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_USER_ID") res.status(406).send({"error": `${err.code} - User ID required to update user information.`});
            else if (err.code === "NO_CHANGE") res.status(404).send({"error": `${err.code} - User information not modified.`});
            else res.status(400).send({"error": `${err.code} - Bad Request.`});
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

loginItemRouter.patch('/', (req,res) => { 
    appModel.patchLoginItem(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({"error": `${err.code} - User ID required to update user information.`});
            else if (err.code === "NO_CHANGE") res.status(404).send({"error": `${err.code} - User information not modified.`});
            else res.status(400).send({"error": `${err.code} - Bad Request.`});
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

notesRouter.patch('/', (req,res) => { 
    appModel.patchNote(req.body, (err, result) => {
        if (err !== null) {
            if (err.code === "NO_ID") res.status(406).send({"error": `${err.code} - User ID required to update user information.`});
            else if (err.code === "NO_CHANGE") res.status(404).send({"error": `${err.code} - User information not modified.`});
            else res.status(400).send({"error": `${err.code} - Bad Request.`});
        }
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).end();
        }
    })
});

// UPDATE (DELETE) controller ************************************

// DELETE REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

userRouter.delete('/:userId', (req,res) => { 
    appModel.deleteUser(req.params.userId, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.affectedRows === 0) res.status(404).send({"error": "No users found with specified user ID"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});

loginItemRouter.delete('/users/:userId/login_items/:loginItemId', (req,res) => { 
    appModel.deleteUserLoginItem(req.params.userId, req.params.loginItemId, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.affectedRows === 0) res.status(404).send({"error": "No login items found for specified user ID with given login item ID"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});


notesRouter.delete('/users/:userId/notes/:noteId', (req,res) => { 
    appModel.deleteNote(req.params.userId, req.params.noteId, (err, result) => {
        if (err !== null) res.status(400).send({"error": `${err.code} - Bad Request.`});
        else {
            if (result.affectedRows === 0) res.status(404).send({"error": "No notes found for specified user ID with given note ID"});
            else {
                console.log(result);
                res.set('Content-Type', 'application/json');
                res.status(204).end();
            }
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});