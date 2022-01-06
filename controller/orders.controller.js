const url = "https://design.sofiagodinho.com/api/orders"
const urlImg = "https://design.sofiagodinho.com/api/images/products/"
const apiUrl = "http://localhost:3000/orders/"
var key = require('../config/db.config').key
var convert = require('xml-js')
const axios = require('axios')

exports.getOrderById = async (req,res) =>{
    try{
        let data = await axios.get(url+`/${req.params.id}?`+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))
        data = data.prestashop.order

        let state = await axios.get(data.current_state._attributes["xlink:href"]+"?"+key)
        state = JSON.parse(convert.xml2json(state.data, {compact: true, ignoreComment: true, spaces: 4}))
        state = state.prestashop.order_state.shipped._cdata != 0 ? "Expedida" : "Em processamento"

        let products = data.associations.order_rows.order_row
        let productList = []

        try{
            for (const obj of products){
                
            console.log(data)

                let id = obj.product_id._cdata
                let image
                try{
                    image = await axios.get(urlImg+id+"?"+key)
                    image = JSON.parse(convert.xml2json(image.data, {compact: true, ignoreComment: true, spaces: 4}))
                    image = image.prestashop.image.declination[0]._attributes["xlink:href"]
                }
                catch{
                    image = "No picture found."
                }

                productList.push({
                    "id":id,
                    "name":obj.product_name._cdata,
                    "price":obj.product_price._cdata,
                    "image":image
                })
            }
        }
        catch{
            let id = products.product_id._cdata

            let image

            try{
                image = await axios.get(urlImg+id+"?"+key)
                image = JSON.parse(convert.xml2json(image.data, {compact: true, ignoreComment: true, spaces: 4}))
                image = image.prestashop.image.declination[0]._attributes["xlink:href"]
            }
            catch{
                image = "No picture found."
            }

            productList = {
                "id":id,
                "name":products.product_name._cdata,
                "price":products.product_price._cdata,
                "image":image
            }
        }


        let order = {
            "id":data.id._cdata,
            "state":state,
            "payment method":data.payment._cdata,
            "total_paid":data.total_paid._cdata,
            "total_paid_tax_excluded":data.total_paid_tax_excl._cdata,
            "products":productList
        }
        res.status(200).json(order);
        
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

exports.getOrderByUserId = async (req,res) =>{
    try{
        let data = await axios.get(url+`/?filter[id_customer]=${req.params.id}&`+key)
        data = JSON.parse(convert.xml2json(data.data, {compact: true, ignoreComment: true, spaces: 4}))

        let orderLinks = []

        data.prestashop.orders.order.forEach(obj=>{
            orderLinks.push(apiUrl + obj._attributes.id)
        })

        res.status(200).json(orderLinks)
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}