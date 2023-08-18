const coupondb = require('../model/coupon_model')
const userdb=require('../model/user_model')
const cartDb=require('../model/cart_model')

const couponLoad = async (req, res) => {
    try {
        const coupon = await coupondb.find()
       
        res.render('coupon', { coupon })

    } catch (error) {
        console.log(error.message)
    }
}
const addCoupon = async (req, res) => {
    try {
        
        const code = req.body.code
        const already = await coupondb.findOne({ code: {$regex : code , $options : 'i'}})
        if (already) {
            res.render('coupon', { message: 'Coupon code in already exist' })
        } else {
            const newCoupon = new coupondb({
                code: req.body.code,
                dicountType: req.body.DiscountAmount,
                minCartAmt: req.body.MinCartAmount,
                startDate: req.body.startDate,
                expiredDate: req.body.expiryDate,
                description: req.body.description



            })
            await newCoupon.save()

            res.redirect('/admin/loadCoupon')
        }

    } catch (error) {
        console.log(error.message)
    }
}
const listCoupon=async(req,res)=>{
    try{
        const coupons=await coupondb.find({})
       
        res.render('listcoupon',{coupons})

    }catch(error){
        console.log(error.message)
    }
}
// user
const applycoupon = async (req, res) => {
    try {
        
        const code = req.body.code;
       
        let amount = req.body.total;
        const user = req.session.userId;
       
        const userData = await userdb.findOne({ _id: user });
            const coupondata = await coupondb.findOne({ code: code });
            if (coupondata) {
                if (coupondata.minCartAmt <= amount) {
                    const discountTotal = (amount / 100) * coupondata.dicountType;
                    amount=amount-discountTotal
                    const {userId}=req.session
                    const cart =await cartDb.updateOne({ userId:userId},{
                        $set:{
                            coupon:true
                        }
                    })
                    res.json({success: true,amount,cart})
                }
            }else{
                console.log("this coupon is not valid")
            }
            
        }catch (error) {
        console.log(error.message)
    
    }
}
const editCoupon=async(req,res)=>{
    try{
       const {id}=req.query
        const coupondata = await coupondb.findOne({ _id:id });
        res.render('editCoupon',{coupon:coupondata})

    }catch(error){
        console.log(error.message)
    }
}
const postEditCoupon=async(req,res)=>{
    try{
       
        const {code,dicountType,minCartAmt,startDate,expiredDate,description,id}=req.body
        
        await coupondb.updateOne({_id:id},{$set:
            {
                code:code,
                dicountType:dicountType,
                minCartAmt:minCartAmt,
                startDate:startDate,
                expiredDate:expiredDate,
                description:description
                
                
            }
        })
        res.redirect('/admin/loadCoupon')

    }catch(error){
        console.log(error.message)
      
    }
}
const couponDelete=async(req,res)=>{
    try{
        
        const {id}=req.query
        const data=await coupondb.findOne({_id:id})
        if(data.status==false){
       await coupondb.findOneAndUpdate({_id:id},{$set:{
            status:true
        }
     })
     res.redirect('/admin/listcoupon')
     }else{
        await coupondb.findOneAndUpdate({_id:id},{$set:{
            status:false
        }
     })
     res.redirect('/admin/listcoupon')

     }
    }catch(error){
        console.log(error.message)
    }
}
        

 
module.exports = {
    couponLoad,
    addCoupon,
    listCoupon,
    applycoupon,
    editCoupon,
    postEditCoupon,
    couponDelete


}