const url = "https://design.sofiagodinho.com/api/products"
const stockUrl = "https://design.sofiagodinho.com/api/stock_availables/"
const tagUrl = "https://design.sofiagodinho.com/api/tags/"
var key = require('../config/db.config').key
var convert = require('xml-js')
const axios = require('axios')
const async = require('async')

class Product {
    constructor(id,name,category,description,price,tag,stock,imageLink){
        this.id=id,
        this.name=name,
        this.category=category,
        this.description=description,
        this.price=price,
        this.tag=tag,
        this.stock=stock,
        this.imageLink=imageLink
    }
}

exports.getProducts = async (req,res) =>{
    try {
        let data = await axios.get(url+"?"+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        
        let productLinks = []

        data.prestashop.products.product.forEach(obj=>{
            productLinks.push(obj._attributes["xlink:href"])
        })
        res.status(200).json(data)
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


        let tags = data.associations.tags.tag
        let nameTags = []

        for(const obj of tags){
            let link = obj._attributes["xlink:href"]
            let req = await axios.get(link+"?"+key)
            req = JSON.parse(convert.xml2json(req.data, {compact: true, ignoreComment: true, spaces: 4}))
            let tag = req.prestashop.tag.name._cdata
            nameTags.push(tag)
        }


        let product = new Product(
            data.id._cdata,
            data.name.language[0]._cdata,
            data.id_category_default._cdata,
            data.description_short.language[0]._cdata,
            data.price._cdata,
            nameTags,
            finalStock,  
            images
        )
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

        data.prestashop.products.product.forEach(obj=>{
            productLinks.push(obj._attributes["xlink:href"])
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
        let limit = req.body.limit
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
        catch{
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