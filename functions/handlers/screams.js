const admin = require('firebase-admin');

exports.getAllScreams = (req,res) =>{
    admin.firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data =>{
        let screams = [];
        data.forEach(doc=>{
            screams.push({
                screamId:doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage
            });
        });
        return res.json(screams);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
 }

 exports.postOneScream = (req, res) => {
    if( req.body.body.trim() === ''){
        return res.status(400).json({body: 'body must not be empty'});
    }


   const newScream = {
       body: req.body.body,
       userHandle: req.user.handle,
       userImage: req.user.imageUrl,
       createdAt: new Date().toISOString(),
       likeCount:0,
       commentCount:0
   };



   admin.firestore()
   .collection('screams')
   .add(newScream)
   .then(doc => {
       const resScream = newScream;
       resScream.screamId = doc.id;
       res.json(resScream);
   })
   .catch(err=>{
       res.status(500).json({error:'something went wrong'});
       console.error(err);
   })
}

//fetch 1 scream
exports.getScream = (req,res) =>{
    let screamData = {};
    admin.firestore().doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists){
            return res.status(404).json({error: 'scream not found'});
        }
        screamData = doc.data();
        screamData.screamId = doc.id;
        return admin.firestore()
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screamId', '==',req.params.screamId)
        .get()
    })
    .then(data=>{
        screamData.comments = [];
        data.forEach(doc=>{
            screamData.comments.push(doc.data())
        })
        return res.json(screamData);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error:err.code})
    })
}

//comment on scream

exports.commentOnScream = (req, res ) => {
    if(req.body.body.trim() === '') return res.status(400).json({comment: 'must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle:req.user.handle, 
        userImage : req.user.imageUrl
    };
    admin.firestore().doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists){
            return res.status(404).json({error:'scream not found'})
        }
        return doc.ref.update({commentCount: doc.data().commentCount+1}); 
    })
    .then(()=>{
        return admin.firestore().collection('comments').add(newComment);
    })
    .then(()=>{
        res.json(newComment);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error: "error shi yona"});
    })
}


//like a scream
exports.likeScream = (req, res) =>{
    const likeDocument = admin.firestore().collection('likes').where('userHandle','==',req.user.handle)
    .where('screamId', '==',req.params.screamId).limit(1);

    const screamDocument = admin.firestore().doc(`/screams/${req.params.screamId}`);
    let screamData ;

    screamDocument.get()
    .then(doc=>{
        if(doc.exists){
            screamData = doc.data();
            screamData.screamId = doc.id;
            return likeDocument.get()
        }else{
            return res.status(404).json({errror:"scream not found"})
        }
    })
    .then(data=>{
        if(data.empty){
            return admin.firestore().collection('likes').add({
                screamId: req.params.screamId,
                userHandle:req.user.handle
            })
            .then(()=>{
                screamData.likeCount++;
                return screamDocument.update({likeCount: screamData.likeCount});
            })
            .then(()=>{
                return res.json(screamData)
            })
        }else{
            return res.status(400).json({error:"scream already liked"})
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({error: err.code});

    })
}


//unlike a scream
exports.unlikeScream = (req, res) =>{
    const likeDocument = admin.firestore().collection('likes').where('userHandle','==',req.user.handle)
    .where('screamId', '==',req.params.screamId).limit(1);

    const screamDocument = admin.firestore().doc(`/screams/${req.params.screamId}`);

    let screamData ;

    screamDocument.get()
    .then(doc=>{
        if(doc.exists){
            screamData = doc.data();
            screamData.screamId = doc.id;
            return likeDocument.get()
        }else{
            return res.status(404).json({errror:"scream not found"})
        }
    })
    .then(data=>{
        if(data.empty){
            return res.status(400).json({error:"scream not liked"})
           
        }else{
            return admin.firestore().doc(`/likes/${data.docs[0].id}`).delete()
            .then(()=>{
                screamData.likeCount--;
                return screamDocument.update({likeCount:screamData.likeCount});

            })
            .then(()=>{
                return res.json({screamData});
            })
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({error: err.code});

    })
}

//delete a scream 
exports.deleteScream = (req,res) =>{
    const document = admin.firestore().doc(`/screams/${req.params.screamId}`);
    document.get()
    .then(doc=>{
        if(!doc.exists){
            return res.status(404).json({error:"not found"})
        }
        if(doc.data().userHandle !== req.user.handle){
            return res.status(403).json({error:"unauthorised"})
        }else{
            return document.delete();
        }
    })
    .then(()=>{
        res.json({message: "message deleted successfully"})
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({error: err.code});
    })
}

