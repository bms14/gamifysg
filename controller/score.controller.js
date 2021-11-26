const Model = require('../model/model')
const Score = Model.Score;

exports.getUserScore= async (req,res) =>{
    try {
        let data = await Score.findOne({where:{id_user:req.params.id}})
        if(!data)
        {
            res.status(404).json({
                message: "User does not exist."
            });
        }
        else{
                res.status(200).json(data.points);
        }
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
}

exports.updateUserScore = async (req,res) =>{
    try {
        let data = await Score.findOne({where:{id_user:req.params.id}})
        if(!data)
        {
            res.status(404).json({
                message: "User does not exist."
            });
        }
        else{
            Score.update({points: data.points + req.body.points},{where:{id_user:req.params.id}})
            .then(res.status(201).json({ message: "User score updated", location: "/score/" + req.params.id }))
        }
    }
    catch (err) {
        res.status(500).json({
            message:err.message || "Some Error Occurred"
        });
    }
}