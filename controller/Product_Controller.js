const User = require('../model/userModel');
const catdb = require('../model/categoryModel')
const productdb = require('../model/productModel')


const productlist = async (req, res) => {
    try {
        const data = await productdb.find()
        res.render('product', { data })

    } catch (error) {
        console.log(error.message);
    }
}

const add_product = async (req, res) => {
    try {
        const isCategory = await catdb.find({ is_block: false })
        res.render('add_product', { Catdata: isCategory })

    } catch (error) {
        console.log(error.message);
    }
};
const  insertproduct = async (req, res) => {
    try {
        const arrimage = []
        if (req.files && req.files.length) {
            for (let i = 0; i < req.files.length; i++) {
                arrimage.push(req.files[i].filename);
            }
        }
 
        const data = new productdb({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            discription: req.body.description,
            image: arrimage,
            blocked: false

        });
        const products = await data.save();

        if (products) {
            res.redirect('/admin/product')
        } else {
            res.render('add_products', { message: error })
        }



    } catch (error) {
        console.log(error.message)
    }
}
const editproduct = async (req, res) => {
    try {

        const editdata = await productdb.findOne({ _id: req.query.id });
        const catedata = await catdb.find()
        res.render('edit_product', { dataedit: editdata, Catdata: catedata })
    } catch (error) {
        console.log(error.message);
    }
}
const posteditproduct = async (req, res) => {
    try {
        const editimage = []
        const name = req.body.name;
        if (name.trim().length == 0) {
            res.redirect('/admin/editproduct')

        } else {

            if (req.files.length != 0) {
                const id = req.query.id
                for(let i=0;i<req.files.length;i++){
                  editimage.push(req.files[i].filename)
                }
                await productdb.findByIdAndUpdate(id, {
                    $set: {
                        name: req.body.name,
                        price: req.body.price,
                        discription: req.body.discription,
                        category: req.body.category,
                        image:editimage,
                        stock: req.body.stock
                    }
                }); 
                res.redirect('/admin/product')
              }else{
                const id=req.query.id
                await productdb.findByIdAndUpdate(id, {
                    $set:{
                        name:req.body.name,
                        price:req.body.price,
                        discription:req.body.discription,
                        category:req.body.category,
                        
                        stock:req.body.stock
                    }
                });
                res.redirect('/admin/product')

              }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const productBlock = async (req, res) => {
    try {
        let id = req.query.id
        const data = await productdb.findById({ _id: id })
        if (data.is_block == false) {
            await productdb.updateOne({ _id: id }, { $set: { is_block: true } })
            res.redirect('/admin/product');
        } else {
            await productdb.updateOne({ _id: id }, { $set: { is_block: false } })
            res.redirect('/admin/product')
        }

    } catch (error) {
        console.log(error.message)
    }
}
const productDetails = async (req, res) => {
    try {
        const id = req.query.id
        const user = req.session.userId
        const productData = await productdb.findById({ _id:id})
       

        res.render('singleproduct', { proData:productData, user })

    } catch (error) {
        console.log(error.message);
    }
}
const productload = async (req, res) => {
    try {
        let category=req.query.category||"All"

        let categoryData=await catdb.find({is_block:false},{name:1,_id:0})
        let catData=[]
        for( i=0;i<categoryData.length;i++){
            catData[i]=categoryData[i].name
        }
         
        
        category=="All"?category=[...catData]:category=req.query.category.split(',')
    const user = req.session.userId;
      var search = '';
      if (req.query.search) {
        search = req.query.search;
      }
      var page = 1;
      if (req.query.page ) {
        page = req.query.page;
      }
      const limit=6
      
  
      const productData = await productdb.find({
        is_block: false,
        $or: [{ name: { $regex: new RegExp(search, 'i') },category:{$in:category} }]
      }).limit(limit *1)
      .skip((page-1)*limit)
     .exec();

     
      const count = await productdb.find({
        is_block: false,
        $or: [{ name: { $regex: new RegExp(search, 'i') } }]
      }).countDocuments()
      


      res.render('product', { productData, user ,category:categoryData,totalpage:Math.ceil(count/limit)});
    } catch (error) {
      console.log(error.message);
    }
  };


module.exports = {
    add_product,
    insertproduct,
    editproduct,
    productlist,
    productDetails,
    productload,
    posteditproduct,
    productBlock,

}
