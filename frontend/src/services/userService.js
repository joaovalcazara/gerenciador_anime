import axios from 'axios';

export async function login(username, password) {
  try {
    const response = await axios.post('http://localhost:3001/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: "Erro ao fazer login. Por favor, tente novamente." };
  }
}

export async function cadastrarUsuario(username, password, role) {
  try {
    const response = await axios.post('http://localhost:3001/cadastrarUsuario', { username, password, role }); 
    switch (response.status) {
      case 200:
        return response.data;
      case 400:
        return { success: false, message: "Todos os atributos (username, password e role) são obrigatórios." };
      case 409:
        return { success: false, message: "Já existe um usuário com esse nome de usuário." };
      default:
        return { success: false, message: "Erro ao fazer cadastro. Por favor, tente novamente." };
    }
  } catch (error) {
     return { success: false, message: "Erro ao fazer cadastro. Por favor, tente novamente." };
  }
}



export async function verificaToken(token) {
  try {
    const response = await axios.post('http://localhost:3001/verificaToken', { token });
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return { success: false, message: "Erro ao verificar token. Por favor, tente novamente." };
  }
}

export async function getAllUsers() {
  try {
    const response = await axios.get('http://localhost:3001/getAllUsers');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    return { success: false, message: "Erro ao buscar usuarios. Por favor, tente novamente." };
  }
}

export async function getUserId(idUser) {
  try {
    const response = await axios.get(`http://localhost:3001/getUserId/${idUser}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return { success: false, message: "Erro ao buscar usuários. Por favor, tente novamente." };
  }
}

export async function logoutService(token) {
  try {
    const response = await axios.post('http://localhost:3001/logout', { token } );
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: "Erro ao fazer login. Por favor, tente novamente." };
  }
}


export async function getTypes() {
  try {
    const response = await axios.get('http://localhost:3001/getTypes' );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar types:', error);
    return { success: false, message: "Erro ao buscar types. Por favor, tente novamente." };
  }
}

export async function getSources() {
  try {
    const response = await axios.get('http://localhost:3001/getSources' );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sources:', error);
    return { success: false, message: "Erro ao buscar sources. Por favor, tente novamente." };
  }
}


 


