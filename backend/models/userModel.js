const db = require("../config/database");
const bcrypt = require("bcrypt");

async function login(username, password) {
  try {
      const result = await new Promise((resolve, reject) => {
          db.query("SELECT * FROM usuarios WHERE username = ?", [username], (err, result) => {
              if (err) {
                  console.error('Erro ao buscar usuário pelo username:', err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return null;  
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
          return user;  
      } else {
          return null;  
      }
  } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
  }
}




 async function cadastrarUsuario(username, password, role) {
  try {
     if (!username || !password || !role) {
      return { success: false, code: 400, message: "Todos os atributos (username, password e role) são obrigatórios." };
    }

     const existeUsuario = await verificaUsuarioExistente(username);
    if (existeUsuario) {
      return { success: false, code: 409, message: "Já existe um usuário com esse nome de usuário." };
    }

     const result = await inserirUsuario(username, password, role);
    if (result.success) {
      return { success: true, code: 200, message: "Usuário cadastrado com sucesso." };
    } else {
      return { success: false, code: 500, message: "Erro ao realizar o cadastro." };
    }
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error);
    return { success: false, code: 500, message: "Erro interno do servidor ao realizar o cadastro." };
  }
}

 async function inserirUsuario(username, password, role) {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query("INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)", [username, password, role], (err, result) => {
        if (err) {
          console.error('Erro ao fazer cadastro:', err);
          reject(err);
        } else {
          if (result.affectedRows > 0) {
            resolve({ success: true });
          } else {
            resolve({ success: false });
          }
        }
      });
    });
    return result;
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error);
    throw error;
  }
}



async function verificaUsuarioExistente(username) {
  try {
    const user = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM usuarios WHERE username = ?", [username], (err, result) => {
        if (err) {
          console.error('Erro ao verificar usuário existente:', err);
          reject(err);
        } else {
          resolve(result.length > 0);  
        }
      });
    });
    return user;
  } catch (error) {
    console.error('Erro ao verificar usuário existente:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const query = "SELECT * FROM usuarios WHERE role != 'admin'";
    const users = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

async function getUserId(idUser) {
  try {
    const user = await new Promise((resolve, reject) => {
      db.query("SELECT username, role FROM usuarios WHERE idUser = ?", [idUser], (err, result) => {
        if (err) {
          console.error('Erro ao verificar usuário existente:', err);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);  
          } else {
            resolve(null);  
          }
        }
      });
    });
    return user;
  } catch (error) {
    console.error('Erro ao verificar usuário existente:', error);
    throw error;
  }
}

async function addToBlacklist(token) {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query("INSERT INTO blacklist_tokens (token) VALUES (?)", [token], (err, result) => {
        if (err) {
          console.error('Erro ao adicionar token à blacklist:', err);
          reject(err);
        } else {
          if (result.affectedRows > 0) {
            resolve({ success: true });
          } else {
            resolve({ success: false });
          }
        }
      });
    });
    return result;
  } catch (error) {
    console.error('Erro ao adicionar token à blacklist:', error);
    throw error;
  }
}

async function isTokenInBlacklist(token) {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM blacklist_tokens WHERE token = ?", [token], (err, rows) => {
        if (err) {
          console.error('Erro ao verificar token na lista negra:', err);
          reject(err);
        } else {
          resolve(rows[0].count > 0);
        }
      });
    });
    return result;
  } catch (error) {
    console.error('Erro ao verificar token na lista negra:', error);
    throw error;
  }
}



async function getTypes() {
  try {
    const query = "SELECT * FROM type";
    const users = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return users;
  } catch (error) {
    console.error('Erro ao buscar types:', error);
    throw error;
  }
}

async function getSources() {
  try {
    const query = "SELECT * FROM source";
    const users = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return users;
  } catch (error) {
    console.error('Erro ao buscar sources:', error);
    throw error;
  }
}

async function insertAnime(gender, title, type, source, idUser) {
  try {
      // Verificar se já existe um registro com o mesmo valor de title
      const existingAnime = await animeExists(idUser,title);

      // Se não existir um registro correspondente, inserir um novo registro
      if (!existingAnime) {
          const sql = "INSERT INTO anime_list (gender, title, type, source, idUser) VALUES (?, ?, ?, ?, ?)";
          const values = [gender, title, type, source, idUser];
          await new Promise((resolve, reject) => {
              db.query(sql, values, (err, result) => {
                  if (err) {
                      console.error('Erro ao inserir novo anime:', err);
                      reject(err);
                  } else {
                      console.log('Novo anime inserido com sucesso!');
                      resolve();
                  }
              });
          });
          return true;
      } else {
          return false;
      }
      
  } catch (error) {
      console.error('Erro ao inserir anime:', error);
      throw error;
  }
}

async function animeExists(idUser, title) {
  try {
      const result = await new Promise((resolve, reject) => {
          db.query("SELECT * FROM anime_list WHERE idUser = ? AND title = ?  ", [idUser, title], (err, result) => {
              if (err) {
                  console.error('Erro ao buscar anime existente:', err);
                  reject(err);
              } else {
                  resolve(result.length > 0); // Retorna verdadeiro se existir um registro correspondente
              }
          });
      });
      return result;
  } catch (error) {
      console.error('Erro ao verificar se anime existe:', error);
      throw error;
  }
}

async function countAnimeByUserId(idUser) {
  try {
      const result = await new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) AS count FROM anime_list WHERE idUser = ?", [idUser], (err, result) => {
              if (err) {
                  console.error('Erro ao contar animes por idUser:', err);
                  reject(err);
              } else {
                  resolve(result[0].count); // Retorna a contagem de registros para o idUser especificado
              }
          });
      });
      return result;
  } catch (error) {
      console.error('Erro ao contar animes por idUser:', error);
      throw error;
  }
}

async function AnimeByUserId(idUser) {
  try {
    const animes = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM anime_list WHERE idUser = ?", [idUser], (err, result) => {
        if (err) {
          console.error('Erro ao verificar anime_list:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return animes;
  } catch (error) {
    console.error('Erro ao verificar animes existente:', error);
    throw error;
  }
}

 
 





module.exports = {
  login,
  cadastrarUsuario,
  getAllUsers,
  getUserId,
  addToBlacklist,
  isTokenInBlacklist,
  getTypes,
  getSources,
  insertAnime,
  countAnimeByUserId,
  AnimeByUserId
};
