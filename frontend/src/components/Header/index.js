import avatarImg from '../../assets/avatar.png';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import './header.css';
import { getUserId, logoutService } from '../../services/userService';

export default function Header() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUserId(localStorage.getItem('idUser'));
         if (response.success) {
          setUserData(response.user);
        } else {
          console.error('Erro ao obter dados do usuário:', response.message);
        }
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
      }
    }

    fetchUserData();
  }, []);

  const logout  = async () => { 
    const token = localStorage.getItem('token');
    if (token) {
      await logoutService(token);
      localStorage.removeItem('token');
      localStorage.removeItem('idUser');
      window.location.reload();
    }
  };

  return (
    <div className="sidebar">
      <div>
        <img src={avatarImg} alt="Foto do usuário" />
        <span style={{ color: '#FFF', textAlign: 'center', display: 'block', margin: '10px' }}>{userData && userData.username}</span>
      </div>

      <Link to="/home">
        <FiHome color="#FFF" size={24} />
        Home
      </Link>
      {userData && userData.role === 'Admin' && (
        <Link to="/clientes">
          <FiUser color="#FFF" size={24} />
          Clientes
        </Link>
      )}
      <Link onClick={logout} to="/">
        <FiLogOut color="#FFF" size={24} />
        Sair
      </Link>
    </div>
  );
}
