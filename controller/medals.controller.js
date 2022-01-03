const Model = require('../model/model')
const Medals = Model.Medals;
const UserMedals = Model.UserMedals;
const Score = Model.Score;

exports.getMedal = async (req,res) =>{
    try {
        let data = await Medals.findOne({where:{id_medal:req.params.id}})
        if(!data)
        {
            res.status(404).json({
                message: "This medal does not exist."
            });
        }
        else{
                res.status(200).json(data);
        }
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}