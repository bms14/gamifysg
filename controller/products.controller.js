const url = "https://design.sofiagodinho.com/api/products"
const key = "ws_key=HBB9L9KT31WYFG7E1LPPMEJ6Y7RAGVL9"
var convert = require('xml-js')
const axios = require('axios')

exports.getProducts = async (req,res) =>{
    try {
        if(!req.body.category){
            let data = await axios.get(url+"?"+key)
            data = convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4})
            res.status(200).json(data);
        }
        else{
            let data = await axios.get(url+`/?filter[id_category_default]=${req.body.category}&`+key)
            data = convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4})
            res.status(200).json(data);
        }
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
        data = convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4})
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}

exports.getProductByCategory = async (req,res) =>{
    try {

    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}