import React, { useState, useEffect } from 'react';
import { useSocket } from '../../SocketContext';  
import ValidaToken from '../../components/ValidaToken';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './home.css';

export default function Home() {
  const [totalRows, setTotalRows] = useState(0);
  const [animes, setAnimes] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [animesPerPage] = useState(10); // Quantidade de animes por pag
  const socket = useSocket();
  const idUser = localStorage.getItem('idUser');

  useEffect(() => {
    // Acione o evento startPlanProcess assim que a pag for carregada
    socket.emit('startPlanProcess', { idUser: idUser }); 

    socket.on('animesData', (data) => {
      // att o estado dos animes com os dados recebidos do socket
      setAnimes(data.animes);
      setTotalRows(data.animes.length);
    });

     return () => {
      socket.off('animesData');
    };
  }, [socket, idUser]);  

  useEffect(() => {
    // Defina um ouvinte para o evento que recebe as atualizações do bd
    socket.on('updateBanco', (data) => {
      // Verifique se a atualização é para o user atual
      if (data.idUserUp === idUser) {
        // Se for, acione o evento para buscar os animes atualizados
        socket.emit('startPlanProcess', { idUser: idUser });
      }
    });

     return () => {
      socket.off('updateBanco');
    };
  }, [socket, idUser]);

  // logica da paginacao
  const indexOfLastAnime = currentPage * animesPerPage;
  const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
  const currentAnimes = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  // func para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <ValidaToken />
      <Header />
      <div className="content">
        <Title name={`Animes Processados: ${totalRows}`}>
          <FiUser size={25} />
        </Title>
        <table>
          <thead>
            <tr>
              <th scope="col">Gender</th>
              <th scope="col">Title</th>
              <th scope="col">Type</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {currentAnimes.map((anime, index) => (
              <tr key={index}>
                <td>{anime.gender}</td>
                <td>{anime.title}</td>
                <td>{anime.type}</td>
                <td>{anime.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {animes.length > 0 && 
         <div className="pagination">
         <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
           <FiChevronLeft />
         </button>
         <div className="page-info">
           Página {currentPage} de {Math.ceil(totalRows / animesPerPage)}
         </div>
         <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(totalRows / animesPerPage)}>
           <FiChevronRight />
         </button>
       </div>
        
        }
       
      </div>
    </div>
  );
}
