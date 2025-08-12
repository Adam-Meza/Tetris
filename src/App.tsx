import { GameBoard } from './components/GameBoard/GameBoard';
import { Header } from './components/Header/Header';

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
      <GameBoard />
    </div>
  );
}

export default App;
