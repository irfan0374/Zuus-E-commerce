const cartdb = require('../model/cart_model')

const cartcount = async (req, res, next) => {
    try {
        if (req.session.userId) {
            const { userId } = req.session;

            const cartCount = await cartdb.findOne({ userId: userId })
            if (cartCount) {
                let cartLength = cartCount.product.length
                res.locals.count = cartLength
                const { count } = res.locals
                next()
            } else {
                res.locals.count = 0;
                const { count } = res.locals
                next()
    
            }



        } else {
            res.locals.count = 0;
            const { count } = res.locals
            next()

        }

    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    cartcount
}