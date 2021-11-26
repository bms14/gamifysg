const Model = require('../model/model')
const Prizes = Model.Prizes;
const UserPrizes = Model.Prizes;
const Score = Model.Score;

exports.getPrize= async (req,res) =>{
    try {
        let data = await Prizes.findOne({where:{id_prize:req.params.id}})
        if(!data)
        {
            res.status(404).json({
                message: "This prize does not exist."
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