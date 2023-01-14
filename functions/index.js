const functions = require("firebase-functions");

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require('express')
const cors = require('cors')
let hbs = require('handlebars');
const engines = require('consolidate');
const { json } = require("express");

const app = express()

app.use(cors({ origin: true }))

app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

// database
const database = admin.firestore()

// main route
app.get('/', async(req, res) => {
    res.render('index');
})

// create
app.post('/students', (req, res) => {
    let studentArray = req.body.studentArray;

    let ts = Date.now();
    let id = Math.floor(ts/1000);
    (async() => {
        try {
            await database.collection('students').doc(`/${id}/`).create({
                student_id     : id,
                student_name   : studentArray[0].name,
                student_email  : studentArray[1].email,
                student_gender : studentArray[2].gender,
                student_dob    : studentArray[3].dob,
                student_phone  : studentArray[4].phone
            });
            return res.json({ success: 1, message: 'Added successfully' });
        } catch(error) {
            console.log(error)
            return res.json({ success: 0, errMessage: 'Something went wrong!' });
        }
    }) ();
})

// get
app.get('/students', (req, res) => {
    (async() => {
        try {
            let all_students_detail     = [];
            let all_data                = database.collection('students');
            await all_data.get().then((data) => {
                let docs = data.docs;

                docs.map((doc) => {
                    all_students_detail.push({
                        id     : doc.data().student_id,
                        name   : doc.data().student_name,
                        dob    : doc.data().student_dob,
                        gender : doc.data().student_gender,
                        email  : doc.data().student_email,
                        phone  : doc.data().student_phone
                    });
                });
                return all_students_detail;
            })
            return res.status(200).send({ success: 1, data: all_students_detail });
        } catch(error) {
            console.log(error)
            return res.status(500).send({ success: 0, errMessage: 'Something went wrong!' });
        }
    }) ();
})

// get/id
app.get('/students/:id', (req, res) => {
    (async() => {
        try {
            let student_id       = req.params.id;
            let data             = database.collection('students').doc(student_id);
            const res_data       = await data.get();
            let detail           = res_data.data();
            let student_detail   = [];
            student_detail.push({
                id     : detail.student_id,
                name   : detail.student_name,
                dob    : detail.student_dob,
                gender : detail.student_gender,
                email  : detail.student_email,
                phone  : detail.student_phone
            })

            return res.json({ success: 1, data: student_detail });
        } catch(error) {
            console.log(error);
            return res.json({ success: 0, errMessage: 'Something went wrong!' });
        }
    }) ();
})

// update/id
app.post('/students/:id', (req, res) => {
    (async() => {
        try {
            let student_id       = req.body.id
            let studentArray     = req.body.studentArray
            let data             = database.collection('students').doc(student_id)

            await data.update({
                student_name   : studentArray[0].name,
                student_email  : studentArray[1].email,
                student_gender : studentArray[2].gender,
                student_dob    : studentArray[3].dob,
                student_phone  : studentArray[4].phone
            })
            
            return res.status(200).send({ success: 1, message: 'Updated successfully' })
        } catch(error) {
            console.log(error)
            return res.status(500).send({ success: 0, errMessage: 'Something went wrong!' });
        }
    }) ();
})


// delete/id
app.delete('/students/:id', (req, res) => {
    (async() => {
        try {
            let student_id       = req.params.id
            let data             = database.collection('students').doc(student_id)

            await data.delete()
            return res.status(200).send({ success: 1, message: 'Deleted successfully' })
        } catch(error) {
            console.log(error)
            return res.status(500).send({ success: 0, errMessage: 'Something went wrong!' });
        }
    }) ();
})


exports.app = functions.https.onRequest(app)
