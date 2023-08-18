const bannerModel = require('../model/banner_model')

const banner_per_page = 5;

const bannerLoad = async (req, res) => {
    try {
        const banner = await bannerModel.find()
        res.render('banner', { banner })

    } catch (error) {
        console.log(error.message)
    }
}
const addBanner = async (req, res) => {
    try {
        res.render("addBanner")

    } catch (error) {
        console.log(error.message)
    }
}
const addBannerPost = async (req, res) => {
    try {
        const { description, title } = req.body
        let imagearr = []
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                imagearr.push(req.files[i].filename)
            }
        }

        const banner = new bannerModel({
            title: title,
            description: description,
            images: imagearr
        });
        await banner.save()
        res.redirect('/admin/bannerLoad')
    } catch (error) {
        console.log(error.message)
    }
}
const deleteBanner = async (req, res) => {
    try {
        console.log("enter");
        const { id } = req.query
        const data = await bannerModel.findById({ _id: id })
        if (data.unlist === false) {
            await bannerModel.updateOne({ _id: id }, { $set: { unlist: true } })
            res.redirect('/admin/bannerLoad')
        }
        else {
            await bannerModel.updateOne({ _id: id }, { $set: { unlist: false } })

            res.redirect('/admin/bannerLoad')
        }

    } catch (error) {
        console.log(error.message)
    }
}
const editBannerload = async (req, res) => {
    try {
        const { id } = req.query
        

        const banner = await bannerModel.findById({ _id: id })

        res.render('editBanner', { banner })

    } catch (error) {
        console.log(error.message)
    }
}
const editBanner = async (req, res) => {
    try {
        const { title, description,id} = req.body
        
       
        
        const existingbanner = await bannerModel.findById({ _id: id })
        let imagearr = []
        if (existingbanner && existingbanner.images && existingbanner.images.length > 0) {
            imagearr = existingbanner.images
        }
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                imagearr.push(req.files[i].filename)
            }
        }
        await bannerModel.updateOne({ _id: id }, {
            $set: {
                title: title,
                description: description,
                images: imagearr
            }
        })
        res.redirect('/admin/bannerLoad')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    bannerLoad,
    addBanner,
    addBannerPost,
    deleteBanner,
    editBannerload,
    editBanner

}