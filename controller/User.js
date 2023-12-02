import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
      const users = await Users.findAll({
        attributes: ['id', 'nama', 'email']
      });
      
    } catch (error) {
        console.log(error);
        
    }
}

export const Register = async (req, res) =>{
    const {nama, email, password, confpassword} = req.body;
    if(password !== confpassword)return res.status(400).json({msg: "password dan confirm password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            nama: nama,
            email: email,
            password: hashPassword
        });
        res.json({msg:"Register berhasil"});
    } catch (error) {
        console.log(error);
        
    }
}

export const Login = async(req, res) =>{
    try {
        const user = await Users.findAll({
            where:{
            email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg:"Password Salah"});
        const userId = user[0].id;
        const nama = user[0].nama;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, nama, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '30s'
        });
        const refreshToken = jwt.sign({userId, nama, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id:userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true
        });
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({msg:"email tidak ditemukan"});
    }   
}