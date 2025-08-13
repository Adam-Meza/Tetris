import { GameBoard } from './components/GameBoard/GameBoard';
import { Header } from './components/Header/Header';
import { SideArt } from './components/SideArt/SideArt';

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
    <div className='App'>
      <Header />
      {/* <SideArt /> */}
      <GameBoard />
    </div>
  );
}

export default App;
