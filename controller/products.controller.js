const url = "https://design.sofiagodinho.com/api/products"
const apiUrl = "http://localhost:3000/products/"
var key = require('../config/db.config').key
var convert = require('xml-js')
const axios = require('axios')

exports.getProducts = async (req,res) =>{
    try {
        let data = await axios.get(url+"?"+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        
        let productLinks = []

        data.prestashop.products.product.forEach(obj=>{
            productLinks.push(obj._attributes.id)
        })
        res.status(200).json(productLinks)
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}

exports.getProductById = async (req,res) =>{
    try {
        let data = await axios.get(url+`/${req.params.id}?`+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        data = data.prestashop.product

        let stocks = data.associations.stock_availables.stock_available
        let finalStock = []

        for(const obj of stocks){
            let link = obj._attributes["xlink:href"]
            let req = await axios.get(link+"?"+key)
            req = JSON.parse(convert.xml2json(req.data, {compact: true, ignoreComment: true, spaces: 4}))
            let stock = req.prestashop.stock_available.quantity._cdata
            finalStock.push(stock)
        }

        let images = []
        data.associations.images.image.forEach(obj=>{
            images.push(obj._attributes["xlink:href"])
        })

        let product = {
            "id": data.id._cdata,
            "name": data.name.language[0]._cdata,
            "category": data.id_category_default._cdata,
            "description":data.description_short.language[0]._cdata,
            "price":data.price._cdata,
            "stock":finalStock,  
            "imageLink":images
        }

        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}

exports.getProductsByCategory = async (req,res) =>{
    try {
        let data = await axios.get(url+`/?filter[id_category_default]=${req.params.id}&`+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))

        let productLinks = []

        console.log(data.prestashop.products.product)

        data.prestashop.products.product.forEach(obj=>{
            productLinks.push(apiUrl + obj._attributes.id)
        })

        res.status(200).json(productLinks);
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}

exports.getProductsByName = async (req,res) =>{
    try {
        let limit = req.body.limit ? req.body.limit : 10
        let offset = req.body.offset ? req.body.offset : 0
        let data = await axios.get(url+`/?filter[name]=%[${req.params.text}]%&limit=${offset},${limit}&`+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        data = data.prestashop.products.product

        let produtos = []

        try{
            for(const obj of data){
                let objUrl = obj._attributes["xlink:href"]
                let prod = await axios.get(objUrl+"?"+key)
                prod = JSON.parse(convert.xml2json(prod.data, {compact: true, ignoreComment: true, spaces: 4}))
                prod = prod.prestashop.product

                let inStock = false
                let stocks = prod.associations.stock_availables.stock_available
            
                try{
                    for(const obj of stocks){
                        let link = obj._attributes["xlink:href"]
                        let req = await axios.get(link+"?"+key)
                        req = JSON.parse(convert.xml2json(req.data, {compact: true, ignoreComment: true, spaces: 4}))
                        if(req.prestashop.stock_available.quantity._cdata != 0)
                        inStock=true
                        break
                    }
                }
                catch{
                    inStock = false
                }

                let image

                try{
                    image = prod.associations.images.image[0]._attributes["xlink:href"]
                }
                catch{
                    try{
                        image = prod.associations.images.image._attributes["xlink:href"]
                    }
                    catch{
                        image = ""
                    }
                }

                produtos.push({
                    "id":prod.id._cdata,
                    "name":prod.name.language[1]._cdata,
                    "price":prod.price._cdata,
                    "image":image,
                    "inStock":inStock
                })
            }
        }
        catch(err){
            produtos="Nenhum resultado encontrado"
        }
        res.status(200).json(produtos)
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }

}

exports.getCategories = async (req,res) =>{
    try {
        let data = await axios.get("https://design.sofiagodinho.com/api/categories?"+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        data = data.prestashop.categories.category

        let categories = []

        for(const obj of data){
            let link = obj._attributes["xlink:href"]
            let req = await axios.get(link+"?"+key)
            req = JSON.parse(convert.xml2json(req.data, {compact: true, ignoreComment: true, spaces: 4}))
            let category = {
                "id":req.prestashop.category.id._cdata,
                "name":req.prestashop.category.name.language[0]._cdata
            }
            categories.push(category)
        }

        res.status(200).json(categories);
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}