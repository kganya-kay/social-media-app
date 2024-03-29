const {admin} = require('../util/admin')

const config = require('../util/config')

const firebase = require('firebase');

firebase.initializeApp(config)

const { validateSignupData, validateLoginData, reduceUserDetails} = require('../util/validators');

//sign up user

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid, errors} = validateSignupData(newUser);
    
    if(!valid) return res.status(400).json(errors);

    const noImg = 'images (1).jpeg'

    let token, userId;
    admin.firestore()
    .doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({handle: 'this handle is taken'});

        }else{
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data =>{
        userId= data.user.uid;
        return data.user.getIdToken();
    })
    .then( idToken =>{
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        };
        return admin.firestore()
        .doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({token});
    })
    .catch( err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({ email: 'email is already in use'});
        } else {
            return res.status(500).json({general:'something went wrong, please try again'});
        }
        
    })
 }

 //login user

 exports.login = (req,res) =>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors} = validateLoginData(user);
    
    if(!valid) return res.status(400).json(errors);
        
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data =>{
        return data.user.getIdToken()
        .then(token=>{
            return res.json({token});
        })
        
        })
        .catch(err =>{
           console.error(err);
           return res.status(403).json({general: 'wrong credentils. please try again.'})
    })
    
}


//add user details

exports.addUserDetails = (req, res) =>{
    let userDetails = reduceUserDetails(req.body);

    admin.firestore().doc(`/users/${req.user.handle}`).update(userDetails)
    .then(()=>{
        return res.json({message: 'details added successfully'})
    })
    .catch( err=>{
        console.error(err);
        return res.status(500).json({error: err.code});
    })
}
//get any user details

exports.getUserDetails = (req, res)=>{
    let userData = {};
    admin.firestore().doc(`/users/${req.params.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            userData.user=doc.data();
            return admin.firestore().collection('screams').where('userHandle','==',req.params.handle)
            .orderBy('createdAt','desc')
            .get()
        }else{
            return res.status(404).json({error:'user not found'});
        }
    })
    .then(data=>{
        userData.screams=[];
        data.forEach(doc=>{
            userData.screams.push({
                body:doc.data().body,
                createdAt:doc.data().createdAt,
                userHandle:doc.data().userHandle,
                userImage:doc.data().userImage,
                likeCount:doc.data().likeCount,
                commentCount:doc.data().commentCount,
                screamId:doc.id
            })
        });
        return res.json(userData)
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error:err.code});
    })
}

//get own user details
exports.getAuthenticatedUser = (req, res) =>{
    let userData = {};
    admin.firestore().doc(`/users/${req.user.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            userData.credentials = doc.data();
            return admin.firestore().collection('likes').where('userHandle', '==', req.user.handle).get();
        }
    })
    .then(data=>{
        userData.likes = []
        data.forEach(doc=>{
            userData.likes.push(doc.data());
        });
        return admin.firestore().collection('notifications').where('recipient','==',req.user.handle)
        .orderBy('createdAt','desc').limit(10).get();
    })
    .then(data=>{
        userData.notifications= [];
        data.forEach(doc=>{
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                createdAt: doc.data().createdAt,
                screamId: doc.data().screamId,
                type: doc.data().type,
                read: doc.data().read,
                notificationId:doc.id
            })
        })
        return res.json(userData);
    })
    .catch( err =>{
        console.error(err);
        return res.status(500).json({error: err.code})
    })
}


//upload a profile image
exports.uploadImage = (req, res) =>{
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers: req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file',(fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/jpg' && mimetype !== 'image/png'){
            return res.status(400).json({error: 'wrong file type submitted.'});
        }
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);
        //my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        //53524567827625.png
        imageFileName = `${math.round(math.random()*10000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath,mimetype };
        file.pipe(fs.createWriteStream(filepath));

    });
    busboy.on('finish', () =>{
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable:false,
            metadata : {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(()=>{
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return admin.firestore().doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(() => {
            return res.json({message: 'image uploaded successfully'});
        })
        .catch( (err) =>{
            console.error(err);
            return res.status(500).json({error: err.code});
        });
    });
    busboy.end(req.rawBody);
};

//
exports.markNotificationsRead = (req,res)=>{
    let batch = admin.firestore().batch();
    req.body.forEach(notificationId=>{
        const notification = admin.firestore().doc(`/notifications/${notificationId}`);
        batch.update(notification,{read:true});
    });
    batch.commit()
    .then(()=>{
        return res.json({message:'notifications marked as read'});
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error:err.code});
    })
}

