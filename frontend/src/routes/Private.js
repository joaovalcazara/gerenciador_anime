import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { verificaToken } from '../services/userService'  

export default function Private({ children }){
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function checkLogin(){ 
      const token = localStorage.getItem('token');
      if(token) {
        const res = await verificaToken(token);
        if (res.success) {
          setSigned(true);
        } else {
           localStorage.removeItem('token');
           localStorage.removeItem('idUser');
        }
      }
      setLoading(false);
    }

    checkLogin();
  }, [])

  if(loading){
    return null;  
  }

  if(!signed){
    return <Navigate to="/"/>; // Redirecionar para a página de login se o usuário não estiver autenticado
  }

  return children; // Se o usuário estiver autenticado, renderiza os componentes filhos
}
