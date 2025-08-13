import { GameBoard } from './components/GameBoard/GameBoard';
import { Header } from './components/Header/Header';
import { SideArt } from './components/SideArt/SideArt';
import { GameModal } from './components/Modal/Modal';
import { ThemeProvider } from '@itwin/itwinui-react';
import '@itwin/itwinui-react/styles.css';

/*
 
Give this some routing
- game
- about
- welcome?
- leader board?
modals for user log in ?
oauth?
makign a back end to track data of users and allow

 */
function App() {
  return (
    <ThemeProvider>
      <div className='App'>
        <Header />
        {/* <SideArt /> */}
        <GameBoard />
      </div>
    </ThemeProvider>
  );
}

export default App;
