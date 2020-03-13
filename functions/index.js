const functions = require('firebase-functions');

const admin = require('firebase-admin');

config = {
    apiKey: "AIzaSyA7aWA4TJKomLttdx95AhN5Rb9iExY5CNY",
    authDomain: "socialape2-eb209.firebaseapp.com",
    databaseURL: "https://socialape2-eb209.firebaseio.com",
    projectId: "socialape2-eb209",
    storageBucket: "socialape2-eb209.appspot.com",
    messagingSenderId: "235436950990",
    appId: "1:235436950990:web:a4efa824f8d901955f979f",
    measurementId: "G-TBFPEM8K7J"
  };

admin.initializeApp({"type": "service_account",
"project_id": "socialape2-eb209",
"private_key_id": "e37ecee9bf5de874d10cc1eb312a79906f75481a",
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkzS0U3Gbaihm0\nszJQJdZfbnSBbX1Cn0YhEuRQ37KWOI4+aEotwK8lYu53oq4QZaUHkqyXXk3WnPEQ\nXWT/KAratXpoe9c3cwAnLoYlrBGYLRWSM1IiusNyC+nPN0AJlaeuXob680PlbpaP\nZYKYdczmP+xweT5oPSOeGN7wfrrAaXil7vfkXU4qWLRkxC3SYqzU3RiGIPiVHhbh\nj/tuPPqRoTpprT5OuNo76UZJox5UZiXkMMfvUc5SHDMJqNcLwc8zAEwUH2YUy/U1\n5TwVmXTl4Xl2VN7F+nrDiGIj3hugBthxsm0xX4DlsUR5T0pJyVM+3jwiAbbm9esF\nMLLLKNyFAgMBAAECggEAE5OP3F+GFEW9Yfq7akvkWDe9vTYtYAGdigY9euHny/Jx\n6zXmQeMWqyFCZJG9jZMVdH3W5LA+HNVNyXzep3SxPWO7Y7f6S8rsZLshEk6LVIFe\ng5x3EEsRNnX10zij8b+GSK9P53WIRjPJzMTpK4UqztsfEglFAYrptTkNGpJjSsHL\npz+QZuGkVcQ3lQNQmPPguSG+4OFyAYNcMnSzdSdGcsgLn8qjVL5dsTgYRM+wGX5K\n2MV1152kq6SkY4MpNtdci7lt80VSmizkNhuDXGEkrgr78xiDW000qjEEZKSNOvq9\n4/eYbpacbNRgQp/7eLIqPqvISqDBbLA0rCJTDAPZjQKBgQDgStAwr031dIxxS+Ow\nSMvAqrxbraivB/h8iAMrIYFijKb/b/99t4fScdP9ZVBg2eCdzW5O9xzmzOeXw0VR\nIlBjXnSr8Fgv0uTFvUr6FxuxaCyYN+rPAgKHmRW5iFGEKclq7FTv4LByfGE6chrV\nWeRA876x2oXmczyU+0+hTVRSVwKBgQC8GWDi0KGsDplH5ADT8nkbjLsX+o9G2zNs\nczxRLQqo0ji6oqjhqLqAyEgS9zMst+cWJQVnV2OfbgMdjifp8bX4mk8hUSYV8v+r\nzfpUJkOXH+7jFSmxdgP8hk17EyYyISusxBdmr2M51hlAe81+nZDbrc5zNtfJ0+vN\nADYh9ILWgwKBgQCRaO9AIObx0vWaHhEnIIq4BfjHlvZdQ1WdprAnLjmronRB9mI1\nJt8vWAyPozdREu/EXoK9PwfFueILSdWOnChxw7LwJYmGt7sJV4dcS87wXRFMPjRE\nsJDjSCQFfJMck9q5Ly6BtbGvB2QheAhdeUG5ukxPEdTtaphEHgmqEXAxUQKBgGqS\nxn48Tx25N8evu3hazZt6ZRb08/DliYFM2UP1DTERyuqT9rPEccc9svhr7ybLG7dE\nSod+0AcowcMhJCQ8uymb5HGwFLAi+hFRpx++flVF1of7GaBeiWuufH/bHa0Rdjlw\n8QFRJhtC3xPWEVxH0idllq9Yx3KnC9ce44zhiLAZAoGASIL7jsodNbKz8Mn2yVj1\n4RKdDBR1gMi8wmyEVp/X1ff4l0CdbAbi08sLglVtwgbCh/5VF5+QtIclBphcvRg2\nHPo5rgg8zDMzhFA+a5hxQZ7baHtXlwPR9npPylt+TaPCOk8amaPf7Dlon2XOjS/i\ndwYbo3YS+ZmhGe8BYr9x8HQ=\n-----END PRIVATE KEY-----\n",
"client_email": "firebase-adminsdk-w1cp7@socialape2-eb209.iam.gserviceaccount.com",
"client_id": "100324170673147871684",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-w1cp7%40socialape2-eb209.iam.gserviceaccount.com"});

const app = require('express')();

const FBAuth = require('./util/fbAuth')

const {getAllScreams, postOneScream, getScream,commentOnScream, likeScream, unlikeScream, deleteScream} = require('./handlers/screams');
const {signup , login, uploadImage, addUserDetails, getAuthenticatedUser,getUserDetails,markNotificationsRead} = require('./handlers/users');


//sceam routes
 app.get('/screams', getAllScreams );
 app.post('/scream', FBAuth, postOneScream);
 app.get('/scream/:screamId', getScream);
 app.delete('/scream/:screamId', FBAuth, deleteScream)
 app. get('/scream/:screamId/like', FBAuth, likeScream)
 app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
 app.post('/scream/:screamId/comment', FBAuth, commentOnScream)

 //users routes
 app.post('/signup',signup);
 app.post('/login', login);
 app.post('/user/image',FBAuth , uploadImage);
 app.post('/user', FBAuth, addUserDetails);
 app.get('/user', FBAuth, getAuthenticatedUser);
 app.get('/user/:handle',getUserDetails);
 app.post('/notifications',FBAuth, markNotificationsRead);

 
 exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike= functions.firestore.document('likes/{id}')
.onCreate((snapshot)=>{
  return admin.firestore().doc(`/screams/${snapshot.data().screamId}`).get()
  .then(doc=>{
    if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
      return admin.firestore().doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        read: false,
        screamId: doc.id,
        type: 'like'
      });
    }
  })
  .catch(err=> {
    console.error(err);
  });
})

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot)=>{
  return admin.firestore().doc(`/notifications/${snapshot.id}`)
  .delete()
  .catch(err=>{
    console.error(err);
    return;
  })
})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
.onCreate((snapshot)=>{
 return admin.firestore().doc(`/screams/${snapshot.data().screamId}`).get()
  .then(doc=>{
    if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
      return admin.firestore().doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        read: false,
        screamId: doc.id,
        type: 'comment'
      });
    }
  })
  .catch(err=> {
    console.error(err);
    return;
  });
})

exports.onUserImageChange = functions.firestore.document('/users/{userId}').onUpdate((change)=>{
  console.log(change.before.data());
  console.log(change.after.data());

 if(change.before.data().imageUrl !== change.after.data().imageUrl){
   console.log('image has changed');
  const batch = admin.firestore().batch(); 

  return admin.firestore().collection('screams').where('userHandle','==',change.before.data().handle).get()
  .then(data=>{
    data.forEach(doc=>{
      const scream = admin.firestore().doc(`/screams/${doc.id}`);
      batch.update(scream, {userImage:change.after.data().imageUrl})
    })
    return batch.commit();
  })
 }else return true;
})


exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')
.onDelete((snapshot,context)=>{
  const screamId = context.params.screamId;
  const batch = admin.firestore().batch(); 
  return admin.firestore().collection('comments').where('screamId','==',screamId).get()
  .then(data=>{
    data.forEach(doc=>{
      batch.delete(admin.firestore().doc(`/comments/${doc.id}`));
    })
    return admin.firestore().collection('likes').where('screamId','==',screamId).get();
  })
  .then(data=>{
    data.forEach(doc=>{
      batch.delete(admin.firestore().doc(`/likes/${doc.id}`));
    })
    return admin.firestore().collection('notifications').where('screamId','==',screamId).get();
  })
  .then(data=>{
    data.forEach(doc=>{
      batch.delete(admin.firestore().doc(`/likes/${doc.id}`));
    })
    return batch.commit();
  })
  .catch(err=>{
    console.error(err)
  })
})