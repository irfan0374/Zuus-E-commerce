const User=require('../model/user_model')
const cartdb=require('../model/cart_model')
const productdb = require('../model/product_model')
const addressDb=require('../model/address_model')
const coupondb=require('../model/coupon_model')

const cartload=async (req,res)=>{
    try{
        const user=req.session.userId  
        let cartdata=await cartdb.findOne({userId:req.session.userId}).populate("product.productId")
        let total=0
        if(cartdata){
            cartdata.product.forEach((product)=>{
                total=total+product.price*product.quantity
            })
                res.render('cart',{user,cart:cartdata,total:total})
           
        }else{
            res.render('cart',{user,cart:[],total:total})
        }
       
    }catch(error){
        console.log(error.message)
    }
}
const add_tocart=async(req,res)=>{
    try{
        const {userId}=req.session
        const productId=req.body.prId
        const quantity = req.body.qty
        const cart = await cartdb.findOne({ userId :req.session.userId })
        const product=await productdb.findById({ _id : productId})
    
    console.log("hhhh");
        if(userId){
            console.log("if")
            if(cart) {
                const exist = cart.product.find((item) => item.productId.toString() === productId)
                if(exist) {
                    const total = product.price * quantity
                    const count = await cartdb.findOneAndUpdate({ userId : req.session.userId , 'product.productId' : productId } , 
                    {
                        'product.$.quantity' : quantity,
                        'product.$.price' : product.price,
                        'product.$.total' : total
                    },{new:true})
                    const length = count.product.length;
    
                    res.json({success : true,cartCount:length})
                }else{
                    const total=quantity*product.price
                  const count =  await cartdb.findOneAndUpdate({  userId : req.session.userId } , {
                        $push : { product : { 
                            productId : productId,
                            quantity:quantity,
                            price:product.price,
                            total:total
                         }}
                    },{new:true})
                    const length = count.product.length;
                    console.log(length)
    
                    res.json({success : true,cartCount:length})
                }
            }else{
                console.log("else");
                const total = product.price * quantity
                const cart = new cartdb({
                    userId : req.session.userId,
                    product : [{
                        productId : productId,
                        quantity : quantity,
                        price : product.price,
                        total : total
                    }]
                })
    
                const cartData = await cart.save()
                const length = cartData.product.length;
                console.log(length)
               
                res.json({ success : true, cartCount:length})
            }
        }else{
            console.log("helolo");
            res.json({login:true})
        }

    }catch(error){
        console.log(error.message);
    }
}
const checkoutload=async (req,res)=>{
    try{
        const user=req.session.userId
        const addressData=await addressDb.findOne({user_id:user})
        let cartdata=await cartdb.findOne({userId:user}).populate('product.productId')
        const coupon=await coupondb.find({status:false})
        console.log(coupon,"coupon")
      
        let total=0
        if(cartdata){
            cartdata.product.forEach((product)=>{
                total=total+product.price*product.quantity
            })
            res.render('checkout',{user,cart:cartdata,total:total,addressData,coupon})
        }else{
            res.render('checkout',{user,cart:[],totoal:total,coupon})
        }
    }catch(error){
        console.log(error.message)
    }
}
const incrementqnty=async(req,res)=>{
    try{
        const count=req.body.count
       
        const productId=req.body.productId
        const cart=await cartdb.findOne({userId:req.session.userId})
        const product=await productdb.findOne({_id:productId})
         const cartproduct = cart.product.find((product)=> product.productId.toString()==productId)
            if(count== 1){
                if(cartproduct.quantity<product.stock){
                    const hhh = await cartdb.findOneAndUpdate({
                        userId:req.session.userId,'product.productId':productId
                    },{ $inc:{
                        'product.$.quantity':1,
                        'product.$.total':product.price
                    }
                })
                res.json({success:true})
                }else{
                   res.json({success:false,message:'product is out of stock'})

                }
            }else if(count==-1){
                if(cartproduct.quantity>1){
                    await cartdb.findOneAndUpdate   ({
                        userId:req.session.userId,'product.productId':productId
                    }, {
                    $inc:{
                       'product.$.quantity':-1,
                       'product.$.total':-product.price
                    }
                    })
              
                res.json({success:true})
            }
            else{
                res.json({success:false,message:'connot decrement'})
            }
        }
    }catch(error){
        console.log(error.message)
    }
}
const  deleteCart=async(req,res)=>{
    try{
        const id=req.body.id
        const cart=await cartdb.findOneAndUpdate({"product.productId":id},{$pull:{product:{productId:id}}
    });
    if(cart){
        res.json({success:true})
    }

    }catch(error){
        res.redirect('/error')
        console.log(error.message)
    }
}
module.exports={
    cartload,
    checkoutload,
    add_tocart,
    incrementqnty,
    deleteCart
    
}