const Model = require('../model/model')
const Prizes = Model.Prizes;
const UserPrizes = Model.Prizes;
const Score = Model.Score;

exports.getPrize = async (req,res) =>{
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

exports.buyPrize = async (req,res) =>{
    try {
        let prize = await Prizes.findOne({where:{id_prize:req.params.id}})
        if(!prize)
        {
            res.status(404).json({
                message: "This prize does not exist."
            });
        }
        else{

            let userScore = await Score.findOne({where:{id_user:req.params.userid}})
            if (!userScore){
                res.status(404).json({
                    message: "This user does not exist."
                });
            }
            else{
                
                if(userScore <= prize.points){
                    res.status(401).json({
                        message: "This user does not have enough points."
                    });
                }
                else{
                    UserPrizes.create({
                        id_user: req.params.userid,
                        id_prize: req.params.id
                    })
                    res.status(200).json({message:"Prize bought successfully."});
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}