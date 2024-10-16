import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {username, email, password} = req.body;
  const newUser = new User({
    username,
    email,
    password: bcryptjs.hashSync(password, 10)
  })

  try {
    await newUser.save();
    const {password: pass, ...rest} = newUser._doc;
    res.status(201).json(rest);
  } catch (err){
    next(err);
  }
}

export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    if (!validUser) {
      return next(errorHandler(404, 'User Not Found'));
    }
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid Password'));
    }
    const {password: pass, ...rest} = validUser._doc;
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
  } catch(err){
    next(err);
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);

    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({ 
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
        email: req.body.email, 
        password: hashedPassword, 
        avatar: req.body.photo 
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    }
  } catch (error) {
    next(error)
  }
} 

export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Signout successful' });
  } catch(err){
    next(err);
  }
}