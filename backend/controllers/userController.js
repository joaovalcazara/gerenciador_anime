const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secret = 'joaovalcazara';
const bcrypt = require("bcrypt");
const saltRounds = 10;



async function login(req, res) {
    const { username, password } = req.body;
      try { 
      const user = await userModel.login(username, password);
      console.log(user)
      if (user) {
        const token = jwt.sign({idUser: user.idUser}, secret, {expiresIn: 1000})
        const isInBlacklist = await userModel.isTokenInBlacklist(token);
        if (isInBlacklist) {
          return res.status(401).json({ success: false, message: "Token inválido. Faça login novamente." });
        }
        res.status(200).json({ success: true, message: "Login bem-sucedido!" , token, idUser: user.idUser});
      } else {
        res.status(401).json({ success: false, message: "Credenciais inválidas. Por favor, verifique seu username e senha." });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ success: false, message: 'Erro ao fazer login. Por favor, tente novamente.' });
    }
}

async function cadastrarUsuario(req, res) {
  const { username, password, role } = req.body; 
  try {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
    const user = await userModel.cadastrarUsuario(username, hashedPassword, role);
    if (user.success) {
       res.status(200).json({ code: 200, message: user.message });
    } else {
      let statusCode;
      switch (user.errorType) {
        case 'faltaDeInformacao':
          statusCode = 400;
          break;
        case 'UsuarioExistente':
          statusCode = 409;
          break;
        default:
          statusCode = 500;
      }

      res.status(200).json({ code: statusCode, message: user.message });
    }
  } catch (error) {
    console.error('Erro ao realizar cadastro:', error);
    res.status(500).json({ code: 500, message: 'Erro interno do servidor ao realizar o cadastro.' });
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários.' });
  }
}

async function getUserId(req, res) {
  try {
    const { idUser } = req.params;
    const user = await userModel.getUserId(idUser);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários.' });
  }
}
 


async function verificaToken(req, res, next) {
    const { token } = req.body;
    jwt.verify(token, secret, (err, decoded) => { //verifica se o tokne é valido
      if(err) {
        return res.status(401).json({ success: false, message: "Token inválido" });
      }
       res.idUser = decoded.idUser;
      return res.status(200).json({ success: true, message: "Token válido" });
    });
  }

  async function logout(req, res) {
    try {
      const { token } = req.body;  
      await userModel.addToBlacklist(token); 
      return res.status(200).json({ success: true, message: "Logout bem-sucedido!" });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return res.status(500).json({ success: false, message: 'Erro ao fazer logout. Por favor, tente novamente.' });
    }
  }


  async function getTypes(req, res) {
    try {
      const types = await userModel.getTypes();
      res.status(200).json({ success: true, types });
    } catch (error) {
      console.error('Erro ao buscar types:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar types.' });
    }
  }
  async function getSources(req, res) {
    try {
      const sources = await userModel.getSources();
      res.status(200).json({ success: true, sources });
    } catch (error) {
      console.error('Erro ao buscar sources:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar sources.' });
    }
  }

 
  
  
  
  module.exports = {
    login,
    cadastrarUsuario,
    getAllUsers,
    verificaToken,
    getUserId,
    logout,
    getTypes,
    getSources,
    
  };