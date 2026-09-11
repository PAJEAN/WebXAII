/* -------------------------------------------------------------------------- */
/*                                  PACKAGES                                  */
/* -------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const compression = require('compression');
/* Express */
const express = require('express');
/* Mutex */
const { Mutex } = require('async-mutex');

const app = express();

const file_mutex = new Mutex();

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
const PROLIFIC_FILENAME = 'prolific.json';

const DATA_FOLDER_PATH = path.resolve(__dirname, DATA_FOLDERENAME);
const PROTOCOL_FOLDER_PATH = path.resolve(DATA_FOLDER_PATH, PROTOCOL_FOLDERNAME);
const USERDATA_FOLDER_PATH = path.resolve(DATA_FOLDER_PATH, USERDATA_FOLDERNAME);
const USERS_FILE_PATH = path.resolve(DATA_FOLDER_PATH, USERS_FILENAME);
const PROLIFIC_FILE_PATH = path.resolve(DATA_FOLDER_PATH, PROLIFIC_FILENAME);

const DIST_FOLDERNAME  = 'dist';
const INDEX_FILENAME   = 'index.html';

if(!fs.existsSync(USERDATA_FOLDER_PATH)) {
    fs.mkdirSync(USERDATA_FOLDER_PATH, { recursive: true });
}

if(!fs.existsSync(PROLIFIC_FILE_PATH)) {
    fs.writeFileSync(PROLIFIC_FILE_PATH, JSON.stringify({}, null, 2), 'utf-8');
}

async function prolific_auth(USER_ID) {
    const release = await file_mutex.acquire(); // bloque les accès concurrents.
        
    try {
        let prolific_assigned_id = JSON.parse(await fs.promises.readFile(PROLIFIC_FILE_PATH));

        let protocol_files = await fs.promises.readdir(PROTOCOL_FOLDER_PATH);            

        if (prolific_assigned_id.hasOwnProperty(USER_ID)) {
            let protocol_filename = prolific_assigned_id[USER_ID]['protocol'];

            if (!protocol_filename) {
                return { status: 500, json: {error: `Protocol key not found`} };
            }

            if (!protocol_files.includes(protocol_filename)) {
                return { status: 500, json: {error: `Protocol file not found`} };
            }

            let raw_data = await fs.promises.readFile(path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME, protocol_filename));

            // Get experiment data of the user (if exist).
            let experiment_user_data_path = path.resolve(__dirname, DATA_FOLDERENAME, USERDATA_FOLDERNAME, `${USER_ID}.json`);
            let experiment_user_data = {};
            if(fs.existsSync(experiment_user_data_path)) {
                experiment_user_data = JSON.parse(await fs.promises.readFile(experiment_user_data_path));
            }

            let return_data = {
                roles: 'user',
                views: JSON.parse(raw_data),
                is_completed: experiment_user_data.hasOwnProperty('is_completed') ? experiment_user_data['is_completed']: false,
                user_data: experiment_user_data.hasOwnProperty('data') ? experiment_user_data['data']: []
            };

            return { status: 200, json: return_data };

        } else {
            assigned_ids = Object.values(prolific_assigned_id).map(x => x['protocol']);                
    
            let available_ids = protocol_files.filter(x => !assigned_ids.includes(x));
    
            if (available_ids.length == 0) {
                return { status: 500, json: {error: `No remaining protocols`} };
            }
    
            prolific_assigned_id[USER_ID] = { protocol: available_ids[Math.floor(Math.random() * available_ids.length)] };
    
            await fs.promises.writeFile(PROLIFIC_FILE_PATH, JSON.stringify(prolific_assigned_id, null, 2), 'utf-8');

            let raw_data = await fs.promises.readFile(path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME, prolific_assigned_id[USER_ID]['protocol']));

            let return_data = {
                roles: 'user',
                views: JSON.parse(raw_data),
                is_completed: false,
                user_data: []
            };

            return { status: 200, json: return_data };
        }
    }  catch (err) {
        console.error(err);
        return { status: 500, json: { error: 'Server error' } };
    } finally {
        release(); // libère le verrou.
    }
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
 * Get user from prolific id.
 */
router.get('/api/prolific', async function(req, res) {
    const USER_ID = req.query.PROLIFIC_PID;

    if (!USER_ID) {
        console.error('No prolific id found');        
        return res.redirect(`/#/auth/${USER_ID}`);
    }

    result = await prolific_auth(USER_ID);    

    if (result['status'] != 200) {
        console.error(result['json']);
        return res.redirect(`/#/auth/${USER_ID}`);
    }

    res.redirect(`/#/auth/${USER_ID}`);
});

/**
 * Get user data protocol.
 */
router.get('/api/data', async (req, res) => {
    let raw_user_data = fs.readFileSync(USERS_FILE_PATH);
    let user_data = JSON.parse(raw_user_data);

    const USER_ID = req.query.uid;    

    if (user_data.hasOwnProperty(USER_ID)) {
        // return res.status(401).json({error: `${USER_ID} not found`});

        let protocol_filename = user_data[USER_ID].hasOwnProperty('protocol') ? user_data[USER_ID]['protocol']: null;

        if (!protocol_filename) {
            return res.status(500).json({error: `Protocol key not found`});
        }

        let protocol_files = fs.readdirSync(PROTOCOL_FOLDER_PATH);

        if (!protocol_files.includes(protocol_filename)) {
            return res.status(500).json({error: `Protocol file not found`});
        }

        let raw_data = fs.readFileSync(path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME, protocol_filename));

        // Get experiment data of the user (if exist).
        let experiment_user_data_path = path.resolve(__dirname, DATA_FOLDERENAME, USERDATA_FOLDERNAME, `${USER_ID}.json`);
        let experiment_user_data = {};
        if(fs.existsSync(experiment_user_data_path)) {
            experiment_user_data = JSON.parse(fs.readFileSync(experiment_user_data_path));
        }

        let return_data = {
            roles: user_data[USER_ID].hasOwnProperty('roles') ? user_data[USER_ID]['roles']: 'user',
            views: JSON.parse(raw_data),
            is_completed: experiment_user_data.hasOwnProperty('is_completed') ? experiment_user_data['is_completed']: false,
            user_data: experiment_user_data.hasOwnProperty('data') ? experiment_user_data['data']: []
        };
        return res.status(200).json(return_data);
    } else {
        result = await prolific_auth(USER_ID);
        return res.status(result['status']).json(result['json']);
    }

    // I] Check if id.
    //      I.1] Get current exp.
    // II] If not id.
    //      II.1] Get all values.
    //      II.2] Get all protocols.
    //      II.3] Get all availables protocols.
    //      II.4] If not 0, rand a protocol.
    //      II.5] Write this assiation in prolific file.
    
});

/**
 * Edit an entry of data.json.
 */
router.patch('/api/data', (req, res) => {
    const USER_ID = req.body.uid;
    const data_received = req.body.data;

    let experiment_user_data_path = path.resolve(__dirname, DATA_FOLDERENAME, USERDATA_FOLDERNAME, `${USER_ID}.json`);

    try {
        // Get user protocol.
        let raw_user_data = fs.readFileSync(USERS_FILE_PATH);
        let prolific_raw_user_data = fs.readFileSync(PROLIFIC_FILE_PATH);
        let user_data = {};
        
        if (JSON.parse(raw_user_data).hasOwnProperty(USER_ID)) {
            user_data = JSON.parse(raw_user_data);
        } else if (JSON.parse(prolific_raw_user_data).hasOwnProperty(USER_ID)) {
            user_data = JSON.parse(prolific_raw_user_data);
        } else {
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

        let raw_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, DATA_FOLDERENAME, PROTOCOL_FOLDERNAME, protocol_filename)));

        // Check if experiment if completed.      
        let is_completed = Object.keys(data_received).length >= Object.keys(raw_data).length; // >= because front add the authentication view but we do not capture time or other info on last view.

        // Get first connection info of the user.
        let experiment_user_data = {};
        if(fs.existsSync(experiment_user_data_path)) {
            experiment_user_data = JSON.parse(fs.readFileSync(experiment_user_data_path));
        }

        let data_received_json = {
            first_connection: experiment_user_data.hasOwnProperty('first_connection') ? experiment_user_data['first_connection']: new Date(),
            last_modification: new Date(),
            is_completed: is_completed,
            data: data_received
        };
        fs.writeFileSync(experiment_user_data_path, JSON.stringify(data_received_json, null, 2), 'utf-8');
        return res.status(200).json({});
    } catch (err) {
        console.log(err);        
        return res.status(500).json({
            error: err
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