const productDb=require('../model/product_model')
const wishlistDb=require('../model/wishlistModel')
const userDb=require('../model/user_model')
const cartDb=require('../model/cart_model')

const wishlistLoad=async(req,res)=>{
    try{
        const user=req.session.userId
        const wishlist=await wishlistDb.findOne({userId:user}).populate('products.productsId')
        wishlist.products.forEach( (items) => {
            console.log(items)
        })

        res.render('wishlist',{wishlist,user})
    }catch(error){
        console.log(error.message)
    }
}
const addWishlist=async(req,res)=>{
    try{
        const product=req.body.proId
        console.log(product)
        const {userId}=req.session
        const wishlist =await wishlistDb.findOne({userId:userId})
        if(wishlist){
          
            const already=await wishlistDb.findOne({userId:userId,'products.productsId':product})
            if(already){
                console.log("already")
                res.json({success:false,message:"already exist"})
            }else{
                console.log("no already")
               
                const hello= await wishlistDb.findOneAndUpdate(
                    { userId: userId },
                    { $push: { products: { productsId: product } } }
                  );
                  console.log(hello)
            
                res.json({success:true})
            }
            
        }else{
            const newOne=new wishlistDb({
                userId:userId,
                products:[{
                    productsId:product
                }]
            })
            console.log('newHelo')

        
        const newWishlist=await newOne.save()
        console.log(newWishlist,"newWishlist")
        if(newWishlist){
            res.json({success:true})
        }
        res.json({sucess:false,messag:'something went wrong'})
    }

    }catch(error){
        console.log(error)
    }
}
const deleteWishlist=async(req,res)=>{
    try{
        console.log('delte')
        const {productId}=req.body;
        console.log(productId)
        const {userId}=req.session
        const wishlist = await wishlistDb.findOneAndUpdate(
            { userId: userId },
            { $pull: { products:{ productsId: productId} }}
        );
            console.log(wishlist)
            res.json({success:true})

    }catch(error){
        console.log(error.message)
    }
}
const add_tocart=async(req,res)=>{
    try{
        console.log("add to cartDb")
        const {productId}=req.body;
        const cart = await cartDb.findOne({ userId :req.session.userId })
        console.log(cart)
        const product=await productDb.findById({ _id : productId})
    
        if(cart) {
            const exist = cart.product.find((item) => item.productId.toString() === productId)
            if(exist) {
               
                console.log("enter")

                res.json({ success: false, message: 'Product is already in cart' })
            }else{
                const total=1*product.price
              const count =  await cartDb.findOneAndUpdate({  userId : req.session.userId } , {
                    $push : { product : { 
                        productId : productId,
                        price:product.price,
                        total:total
                     }}
                })
                res.json({success : true})
            }
        }else{
            const total = 1 * product.price 
            const cart = new cartDb({
                userId : req.session.userId,
                product : [{
                    productId : productId,
                    price : product.price,
                    total : total
                }]
            })
            const cartData = await cart.save()
            res.json({ success : true})
        }
    }catch(error){
        console.log(error.message);
    }
}

module.exports={
    wishlistLoad,
    addWishlist,
    deleteWishlist,
    add_tocart

}

