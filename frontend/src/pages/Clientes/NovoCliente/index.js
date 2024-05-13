import { useState } from 'react';
import Header from '../../../components/Header';
import ValidaToken from '../../../components/ValidaToken';
import Title from '../../../components/Title';  
import { FiPlusCircle } from 'react-icons/fi';
import './novocliente.css';
import { cadastrarUsuario, verificaToken } from '../../../services/userService'


export default function NovoCliente() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Basic');

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRoleChange(e) {
    setRole(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      const res = await verificaToken(token);
      if (res.success) {
        if (username !== '' && password !== '') {
          const response = await cadastrarUsuario(username, password, role); 
          alert(response.message);
           
        } else {
          alert("Preencha todos os campos!")
        }
      } else {
        alert("Logue novamente para conseguir fazer o cadastro") 
        localStorage.removeItem('token');
        localStorage.removeItem('idUser');
      }
    } 
  }

  return (
    <div>
      <ValidaToken/> 
      <Header />
      <div className="content">
        <Title name="Novo cliente">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={handleRoleChange}>
              <option value="Basic">Basic</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
