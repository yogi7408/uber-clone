const express=require("express");
const router=express.Router();
const {body}=require("express-validator")
const userController=require('../controllers/user.controller')
const authMiddlewares=require('../middlewares/auth.middleware')

router.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({min:3}).withMessage('First letter atleat 2 character long'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 character long')
],
userController.registerUser
)
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength().withMessage('Invaid Password')

],
userController.loginUser
)
router.get('/profile',authMiddlewares.authUser,userController.getUserProfile)
router.get('/logout',authMiddlewares.authUser,userController.logoutUser);
module.exports=router