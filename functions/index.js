/* -------------------------------------------------------------------------- */
/*                                  PACKAGES                                  */
/* -------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const compression = require('compression');
/* Express */
const express = require('express');

const app = express();

/*** For dev ***/
const cors = require('cors');
app.use(cors());

const router = express.Router();
app.use(express.json()); // Body parser.
app.use(express.static('dist')); // Static files.
app.use(compression());

/* DotEnv */
require('dotenv').config();

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const DATA_FOLDERENAME    = 'data';
const PROTOCOL_FOLDERNAME = 'protocols';
const USERDATA_FOLDERNAME = 'user-data';
const USERS_FILENAME = 'users.json';

const DATA_FOLDER_PATH = path.resolve(__dirname, DATA_FOLDERENAME);
const PROTOCOL_FOLDER_PATH = path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME);
const USERDATA_FOLDER_PATH = path.resolve(__dirname, DATA_FOLDERENAME, USERDATA_FOLDERNAME);
const USERS_FILE_PATH = path.resolve(__dirname, DATA_FOLDERENAME, USERS_FILENAME);

// const DATA_FILEPATH    = 'data.json';

const DIST_FOLDERNAME  = 'dist';
const INDEX_FILENAME   = 'index.html';


if(!fs.existsSync(USERDATA_FOLDER_PATH)) {
    fs.mkdirSync(USERDATA_FOLDER_PATH, { recursive: true });
}


/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

/**
 * Main route.
 */
router.get('/', function(req, res) {
    let root_folder = path.resolve(__dirname, '..');
    res.sendFile(path.join(root_folder, DIST_FOLDERNAME, INDEX_FILENAME));
});

/**
 * Check if user id exist.
 */
router.post('/api/users', function(req, res) {
    let rawdata = fs.readFileSync(USERS_FILE_PATH);
    let data = JSON.parse(rawdata);
    const USER_ID = req.body.uid;
    return res.status(data.hasOwnProperty(USER_ID) ? 200: 401).json({error: data.hasOwnProperty(USER_ID)});
});

/**
 * Get user data.
 */
router.get('/api/data', (req, res) => {
    let raw_user_data = fs.readFileSync(USERS_FILE_PATH);
    let user_data = JSON.parse(raw_user_data);
    const USER_ID = req.query.uid;

    if (!user_data.hasOwnProperty(USER_ID)) {
        return res.status(401).json({error: `${USER_ID} not found`});
    }

    let protocol_filename = user_data[USER_ID].hasOwnProperty('protocol') ? user_data[USER_ID]['protocol']: null;

    if (!protocol_filename) {
        return res.status(500).json({error: `Protocol key not found`}); 
    }

    let protocol_files = fs.readdirSync(PROTOCOL_FOLDER_PATH);    

    if (!protocol_files.includes(protocol_filename)) {
        return res.status(500).json({error: `Protocol file not found`});
    }

    let raw_data = fs.readFileSync(path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME, protocol_filename));    

    let return_data = {
        roles: user_data[USER_ID].hasOwnProperty('roles') ? user_data[USER_ID]['roles']: 'user',
        views: JSON.parse(raw_data)
    };
    return res.status(200).json(return_data);
});

/**
 * Edit an entry of data.json.
 */
router.patch('/api/data', (req, res) => {
    const uid = req.body.uid;
    const data_received = req.body.data;    

    try {
        let data_received_json = {
            date: new Date(),
            data: data_received
        };
        fs.writeFileSync(path.resolve(__dirname, DATA_FOLDERENAME, USERDATA_FOLDERNAME, `${uid}.json`), JSON.stringify(data_received_json, null, 2), 'utf-8');
        return res.status(200).json({});
    } catch (err) {
        console.log(err);        
        return res.status(500).json({
            error: err
        });
    }
});


/* -------------------------------------------------------------------------- */
/*                                    TODO                                    */
/* -------------------------------------------------------------------------- */

/* Admin - Add new user id */
router.patch('/api/users', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname, DATA_FILEPATH));
    let matrices = JSON.parse(rawdata);

    const pwd = req.body.pwd;
    const uid = req.body.uid;

    if (pwd === process.env.PASSWORD && !matrices.hasOwnProperty(uid)) {
        matrices = {...matrices, [uid]: {}};

        let data = JSON.stringify(matrices, null, 2);
        fs.writeFileSync(path.join(__dirname, DATA_FILEPATH), data);

        res.status(200).json({
            patch: true
        });
    } else {
        res.status(401).json({
            error: true
        });
    }
});

/* Admin - Get all data */
router.post('/api/matrix', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname, DATA_FILEPATH));
    let matrices = JSON.parse(rawdata);

    const pwd = req.body.pwd;
    if (pwd === process.env.PASSWORD) {
        res.status(200).json(matrices);
    } else {
        res.status(401).json({
            error: true
        });
    }
});

app.use('/', router);
app.listen(process.env.PORT || 3000, () => {
    console.log('Running at Port 3000');
});

/**
 * References:
 * https://www.freecodecamp.org/news/how-to-deploy-your-site-using-express-and-heroku/
 * https://devcenter.heroku.com/articles/procfile
 */