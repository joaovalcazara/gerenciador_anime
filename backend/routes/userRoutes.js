 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const processadorController = require('../controllers/processadorController');

router.route('/verificaToken').post((req,res,next ) => {next()},userController.verificaToken.bind(userController));

router.route('/login').post((req,res,next ) => {next()},userController.login.bind(userController)); 

router.route('/logout').post((req,res,next ) => {next()},userController.logout.bind(userController)); 

router.route('/cadastrarUsuario').post((req,res,next ) => {next()},userController.cadastrarUsuario.bind(userController)); 

 
 
router.route('/getAllUsers').get(userController.getAllUsers); 
router.route('/getUserId/:idUser').get(userController.getUserId); 
router.route('/getTypes').get(userController.getTypes);
router.route('/getSources').get(userController.getSources);



 
module.exports = router;
