Here are steps to run the project

I.  Create Datebase in firebase

    1.  Create Datebase
    2.  Start in test mode and then click to next and enable
    3.  Go to project setting on upper left border and select Service Account,
        Then generate private key and rename that file as 'serviceAccount.json' and put 'serviceAccount.json' in index.js file



II.  In terminal follow the steps as below

    1.  cd path/to/project
    2.  cd functions
    3.  npm install
    4.  firebase login
    5.  firebase init
        - Choose Functions and Hosting
        - Use existing project which is made in 1st step
        - Initialize
        - Select Javascript
        - Install npm dependencies
        - Rewrite all urls to index.html => No
        - Deploy with Github => No
    6.  firebase serve --only hosting, functions
    
    Follow the url like 'http://localhost:5001/<project-name>/us-central/app'

