const { Sequelize, Model, DataTypes } = require('sequelize'); 
const config = require('../config/db.config')
const sequelize = new Sequelize.Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST, 
    dialect: 'mysql'
})

// MODEL PONTUACAO

class Score extends Model {}

Score.init({
    id_user: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, unique:true},
    points: {type: DataTypes.FLOAT, allowNull: false}
}, { sequelize, modelName: 'Score'})

class Prizes extends Model {}

Prizes.init({
    id_prize: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, unique:true},
    description: {type: DataTypes.STRING, allowNull: false},
    points: {type:DataTypes.FLOAT, allowNull: false}
}, { sequelize, modelName: 'Prize'})

class UserPrizes extends Model {}

UserPrizes.init({
    id_prize: {type: DataTypes.INTEGER, allowNull: false},
    id_user: {type: DataTypes.INTEGER, allowNull: false},
}, { sequelize, modelName: 'UserPrize'})

class Medals extends Model {}

Medals.init({
    id_medal: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, unique:true},
    description: {type: DataTypes.STRING, allowNull: false},
    points: {type:DataTypes.FLOAT, allowNull: false}
}, { sequelize, modelName: 'Medal'})

class UserMedals extends Model {}

UserMedals.init({
    id_medal: {type: DataTypes.INTEGER, allowNull: false},
    id_user: {type: DataTypes.INTEGER, allowNull: false},
}, { sequelize, modelName: 'UserMedal'})


sequelize.sync().then().catch(error => {
    console.log(error); 
})

exports.Score = Score;
exports.Prizes = Prizes;
exports.UserPrizes = UserPrizes;
exports.Medals = Medals;
exports.UserMedals = UserMedals;
