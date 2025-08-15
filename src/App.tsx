import { GameBoard } from './components/GameBoard/GameBoard';
import { Header } from './components/Header/Header';
import { SideArt } from './components/SideArt/SideArt';
import Info from './components/Info/Info';
import '@itwin/itwinui-react/styles.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Home from './pages/Home';
// import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { GameModal } from './components/Modal/Modal';

function Logout() {
  localStorage.clear();
  return <Navigate to='/login' />;
}

function RegisterAndLogout() {
  localStorage.clear();
  // return <Register />;
}

function App() {
  return (
    <div className='App'>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GameModal />} />
          <Route path='/play' element={<GameBoard />} />
          <Route
            path='/side-art'
            element={<ProtectedRoute child={<SideArt />} />}
          />
          {/* <Route path='/logout' element={<Logout />} /> */}
          <Route path='/info' element={<Info />} />
          {/* <Route path='*' element={<NotFound />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
