import { Routes, Route} from 'react-router-dom'

import Login from '../pages/Login';
import Home from '../pages/Home';
import Clientes from '../pages/Clientes/ListCliente';
import NovoClientes from '../pages/Clientes/NovoCliente';

import Private from './Private'

function RoutesApp(){
  return(
    <Routes>
      <Route path='/' element={ <Login/> } />
      <Route path='/home' element={ <Private> <Home/> </Private> } />
      <Route path='/clientes' element={ <Private> <Clientes/> </Private> } />
      <Route path='/novocliente' element={ <Private> <NovoClientes/> </Private> } />

     </Routes>
  )
}

export default RoutesApp;