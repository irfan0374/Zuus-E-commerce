const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/admin_asset/imgs'),function(err,success){
            if(err){
                throw err
            }
        })
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name,function(err,success){
            if(error){
                throw error
            }
        })
    }
});
const upload=multer({storage:storage});

module.exports={
    upload
}