import { GameBoard } from './components/Play/GameBoard/GameBoard';
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
import { Register } from './components/Modal/Register';
// import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { GameModal } from './components/Modal/Modal';
import { LogInForm } from './components/Modal/LogInForm';

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
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={<GameModal />} />
          <Route path='/play' element={<GameBoard />} />
          <Route
            path='/side-art'
            element={<ProtectedRoute child={<SideArt />} />}
          />
          <Route path='/log-in' element={<LogInForm />} />
          {/* <Route path='/logout' element={<Logout />} /> */}
          <Route path='/about' element={<Info />} />
          <Route path='/register' element={<Register />} />
          {/* <Route path='*' element={<NotFound />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
