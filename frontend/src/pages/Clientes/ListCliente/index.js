import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import ValidaToken from '../../../components/ValidaToken';
import Title from '../../../components/Title';
import { FiPlus, FiUsers, FiPlay, FiStopCircle, FiBookOpen } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers, getUserId, getTypes, getSources } from '../../../services/userService';
 
import { useSocket } from '../../../SocketContext';

import './listcliente.css';

export default function ListCliente() {
  const socket = useSocket();
  const [clientes, setClientes] = useState([]);
  const [types, setTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedTypeDesc, setSelectedTypeDesc] = useState({});
  const [selectedSourceDesc, setSelectedSourceDesc] = useState({});
  const [row, setRow] = useState(0);
  const [processing, setProcessing] = useState(false); // Estado para controlar se o processamento está ativo
  const [selectedUser, setSelectedUser] = useState(null); // Estado para controlar o user selecionado
  const [finishedProcessing, setFinishedProcessing] = useState(false); // Estado para controlar se o processamento foi finalizado
  const navigate = useNavigate();
 
  useEffect(() => {
    async function fetchData() {
      try {
        const responseUsers = await getAllUsers();
        const responseTypes = await getTypes();
        const responseSources = await getSources();

        if (responseUsers.success && responseTypes.success && responseSources.success) {
          setClientes(responseUsers.users);
          setTypes(responseTypes.types);
          setSources(responseSources.sources);
        } else {
          console.error('Erro ao buscar dados:', responseUsers.message, responseTypes.message, responseSources.message);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
    checkAdminRole();

    function checkAdminRole() {
      const idUser = localStorage.getItem('idUser');
      getUserId(idUser)
        .then(response => {
          if (response.success) {
            const userData = response.user;
            if (userData.role !== 'Admin') {
              navigate('/home');
            }
          }
        })
        .catch(error => {
          console.error('Erro ao verificar papel do usuário:', error);
        });
    };



  }, [navigate]);

  const handleTypeChange = (event, userId) => {
    setSelectedTypeDesc({
      ...selectedTypeDesc,
      [userId]: event.target.value,
    });
  };

  const handleSourceChange = (event, userId) => {
    setSelectedSourceDesc({
      ...selectedSourceDesc,
      [userId]: event.target.value,
    });
  };

  const openModal = (userId) => {
    setSelectedUser(userId);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setFinishedProcessing(false); // Reseta o estado de finalização do processamento ao fechar o modal
  };

  const Play = async () => {
    if (processing) return;  
    const selectedType = selectedTypeDesc[selectedUser];
    const selectedSource = selectedSourceDesc[selectedUser];
 
     socket.emit('startProcessing', { idUser: selectedUser, TypeDesc: selectedType, SourceDesc: selectedSource }); 
 
    socket.on('processing', ({ totalRows }) => {
      console.log(totalRows)
      setRow(totalRows);
    });

    socket.on('finishedProcessing', () => {
      setFinishedProcessing(true);
      setProcessing(false); // Define o processamento como finalizado
      closeModal(); // Fecha o modal ao finalizar o processamento
      setRow(0);
    });

  
    setProcessing(true);
  }

  const Stop = () => {
     if (processing && !finishedProcessing) { 
      // Verifica se socket está definido e se o processamento está ativo
       socket.emit('stopProcessing'); 
      setProcessing(false);
      setRow(0);

      closeModal();
      
    }
    

  }
  

  return (
    <div>
      <ValidaToken />
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUsers size={25} />
        </Title> 
        <>
         
          <Link to="/novocliente" className="new">
            <FiPlus color="#FFF" size={25} />
            Novo cliente
          </Link>
      
        
         <table>
         <thead>
           <tr>
             <th scope="col">Username</th>
             <th scope="col">Type</th>
             <th scope="col">Source</th>
             <th scope="col">Processar planilha</th>
           </tr>
         </thead>
         <tbody>
           {clientes && clientes.map(cliente => (
             <tr key={cliente.idUser}>
               <td data-label="Cliente">{cliente.username}</td>
               <td data-label="Type">
                 <select className="select-box" value={selectedTypeDesc[cliente.idUser] || ''} onChange={(e) => handleTypeChange(e, cliente.idUser)}>
                   <option value="">Selecione um tipo</option>
                   {types && types.map(type => (
                     <option key={type.idType} value={type.Descricao}>{type.Descricao}</option>
                   ))} 
                 </select>
               </td>
               <td data-label="Source">
                 <select className="select-box" value={selectedSourceDesc[cliente.idUser] || ''} onChange={(e) => handleSourceChange(e, cliente.idUser)}>
                   <option value="">Selecione uma fonte</option>
                   {sources && sources.map(source => (
                     <option key={source.idSource} value={source.Descricao}>{source.Descricao}</option>
                   ))} 
                 </select>
               </td>
               <td data-label="#">
                 <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => openModal(cliente.idUser)} disabled={processing}>
                   <FiBookOpen color="#FFF" size={17} />
                 </button> 
               </td>
             </tr>
           ))}
         </tbody>
       </table>
       
         
        </>
        {selectedUser !== null && (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2 className="modal-title">Processar Planilha Excel</h2>
        <h3>Username: {clientes.find(cliente => cliente.idUser === selectedUser)?.username}</h3>
        {!processing && !finishedProcessing && (
          <button className="action play-button" onClick={Play}>
            <FiPlay color="#FFF" size={17} />
            Iniciar Processamento
          </button>
        )}
        {processing && (
          <button className="action stop-button" onClick={Stop}>
            <FiStopCircle color="#FFF" size={17} />
            Parar Processamento
          </button>
        )}
        <p>Número de itens processados: {row}</p>
        {finishedProcessing && (
          <p>Processamento finalizado</p>
        )}
      </div>
    </div>
  )}
 
      </div>
    </div>
  );
}
