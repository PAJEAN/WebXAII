/* -------------------------------------------------------------------------- */
/*                                  PACKAGES                                  */
/* -------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const compression = require('compression');
/* Express */
const express = require('express');
const cors = require('cors');

const app = express();

/* For dev */
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

const DATA_FILEPATH   = 'Vasconcelos_repr.json';
const DIST_FOLDERNAME = 'dist';
const INDEX_FILENAME  = 'index.html';

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
    let rawdata = fs.readFileSync(path.join(__dirname, DATA_FILEPATH));
    let data = JSON.parse(rawdata);
    const USER_ID = req.body.uid;
    return res.status(data.hasOwnProperty(USER_ID) ? 200: 401).json({error: data.hasOwnProperty(USER_ID)});
});

/**
 * Get user data.
 */
router.get('/api/data', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname, DATA_FILEPATH));
    let data = JSON.parse(rawdata);
    const USER_ID = req.query.uid;    

    if (!data.hasOwnProperty(USER_ID)) {
        return res.status(401).json({error: data.hasOwnProperty(USER_ID)});
    }

    let user_data = {
        roles:  data[USER_ID]['roles'] ? data[USER_ID]['roles']: '',
        views: data[USER_ID]['views']
    };
    return res.status(200).json(user_data);
});

/**
 * Edit an entry of data.json.
 */
router.patch('/api/data', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname, DATA_FILEPATH));
    let matrices = JSON.parse(rawdata);

    const uid = req.body.uid;
    const data_received = req.body.data;

    if (matrices.hasOwnProperty(uid)) {
        let today = new Date(Date.now());
        matrices[uid]['date'] = today.toDateString() + ' ' + today.toTimeString();
        matrices[uid]['data'] = data_received;

        let data = JSON.stringify(matrices, null, 2);

        console.log(data);

        fs.writeFileSync(path.join(__dirname, DATA_FILEPATH), data);
        return res.status(200).json({});
    } else {
        return res.status(401).json({
            error: true
        });
    }
});

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