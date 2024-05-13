import { verificaToken } from '../../services/userService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ValidaToken() {
    const navigate = useNavigate();

    useEffect(() => {
        // Função para verificar o token 
        async function checkTokenValidity() {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await verificaToken(token);
                if (!res.success) {
                    alert("Sessão exipirada, Por favor logue novamente");
                    localStorage.removeItem('token');
                    localStorage.removeItem('idUser');
                    navigate('/');
                }
            }
        }

        checkTokenValidity();

        // seta um intervalo p chamar a funcao (5 min)
        const intervalId = setInterval(checkTokenValidity, 300000);

        // Retorna uma func de limpeza para limpar o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, [navigate]);  
}
