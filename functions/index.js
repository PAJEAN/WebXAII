/* Packages */
const fs = require('fs');
const path = require('path');
const compression = require('compression');
/* Express */
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json()); // Body parser.
app.use(express.static('dist')); // Static files.
app.use(compression());
/* DotEnv */
require('dotenv').config();
/* AWS */
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//     apiVersion: '2006-03-01',
//     accessKeyId: process.env.ACCESSKEYID,
//     secretAccessKey: process.env.SECRETACCESSKEY,
//     endpoint: 'https://s3.filebase.com'
// });
// const BUCKETNAME = 'ceris-applications';
// const BUCKETFILENAME = 'kami.json';

/** ROUTES **/
router.get('/', function(req, res) {
    let root_folder = path.resolve(__dirname, '..');
    res.sendFile(path.join(root_folder + '/dist/index.html'));
});

router.post('/api/users', function(req, res) {
    const uid = req.body.uid;
    let rawdata = fs.readFileSync(path.join(__dirname + '/matrix.json'));
    let matrices = JSON.parse(rawdata);
    res.status(matrices.hasOwnProperty(uid) ? 200: 401).json({error: matrices.hasOwnProperty(uid)});
});

router.patch('/api/users', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname + '/matrix.json'));
    let matrices = JSON.parse(rawdata);

    const pwd = req.body.pwd;
    const uid = req.body.uid;

    if (pwd === process.env.PASSWORD && !matrices.hasOwnProperty(uid)) {
        matrices = {...matrices, [uid]: {}};

        let data = JSON.stringify(matrices, null, 2);
        fs.writeFileSync(path.join(__dirname + '/matrix.json'), data);

        res.status(200).json({
            patch: true
        });
    } else {
        res.status(401).json({
            error: true
        });
    }
});

router.get('/api/matrix', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname + '/matrix.json'));
    let matrices = JSON.parse(rawdata);

    const id = req.query.id;

    let matrix = matrices[id];
    matrix.id = id;

    res.status(200).json(matrix);
});

router.post('/api/matrix', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname + '/matrix.json'));
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

// Edit an entry of matrices.json.
router.patch('/api/matrix', (req, res) => {
    let rawdata = fs.readFileSync(path.join(__dirname + '/matrix.json'));
    let matrices = JSON.parse(rawdata);

    const uid = req.body.uid;
    const matrix = req.body.matrix;

    if (matrices.hasOwnProperty(uid)) {
        let today = new Date(Date.now());
        matrices[uid] = {}
        matrices[uid]['date'] = today.toDateString() + ' ' + today.toTimeString();
        matrices[uid]['matrix'] = matrix;

        let data = JSON.stringify(matrices, null, 2);
        fs.writeFileSync(path.join(__dirname + '/matrix.json'), data);

        // s3.putObject({
        //     Bucket: BUCKETNAME,
        //     Key: BUCKETFILENAME,
        //     Body: data,
        //     ContentType: 'application/json',
        // }, function(err, data) {
        //     if (err) { // An error occurred.
        //         let content = `${today} - ${err.stack.toString()}\n`;
        //         fs.writeFileSync(path.join(__dirname + '/log.txt'), content, { flag: 'a+' }, err => {});

        //         res.status(500).json({
        //             error: true
        //         });
        //     } 
        //     else { // Successful response.
        //         res.status(200).json({
        //             patch: true
        //         });
        //     }
        // });
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