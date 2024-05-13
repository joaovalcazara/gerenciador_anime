
import { useState } from 'react'
import './login.css' 
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/userService'   

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
 
    if(username !== '' && password !== ''){
        try {
          const response = await login(username, password);
          console.log(response)
          if(response.success) {
             localStorage.setItem('token', response.token);
             localStorage.setItem('idUser', response.idUser); 
             navigate('/home');
          } else {
            alert(response.message);
          }
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          alert("Erro ao fazer login. Por favor, tente novamente.");
        }
  
    }else{
      alert("Preencha todos os campos!")
    }


  }


  return(
    <div className="login-container">
      <h1>Animes</h1>
      <span>Gerencie sua lista de anime de forma fácil.</span> 
      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Digite seu username..."
          value={username}
          onChange={(e) => setUsername(e.target.value) }
        />

        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value) }
        />

        <button type="submit" >Acessar</button>
      </form>
 

    </div>
  )
}