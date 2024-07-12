const ShortUniqueId = require('short-unique-id')
const urlValidator = require('../validation.js/validateURL')
const URL = require('../models/url.model')
const { StatusCodes } = require('http-status-codes')

const urlShortner = async (req, res) => {

    const origUrl = req.body.originalUrl
    if (urlValidator(origUrl)) {
        const urlObj = {}
        const uid = new ShortUniqueId({ length: process.env.ROUNDS })


        const urlid = uid.rnd()
        urlObj.urlId = urlid
        urlObj.origUrl = origUrl
        urlObj.shortUrl = `${process.env.BASE_URL}/${urlid}`

        try {
            const response = await URL.create(urlObj)
            res.status(StatusCodes.CREATED).json({ response })
        } catch (e) {
            res.status(500).json({ msg: 'internal server problem' })
        }

    }
    else {
        res.status(404).json({ msg: 'enter valid url' })
    }

}

const getFromShortUrl = async (req, res) => {
    try {
        const response = await URL.findOne({ urlId: req.params.uid })
        if (!response) {
            return res.status(404).json({ msg: "Bad request" })
        }
        const clicks = response.clicks + 1

        await URL.findOneAndUpdate({ _id: response._id }, { clicks })
        res.redirect(response.origUrl)
    } catch (e) {
        res.status(500).json({ msg: 'internal server problem' })
    }


}

module.exports = {
    urlShortner,
    getFromShortUrl
}