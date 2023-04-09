
import './App.css';
import MusicList from './components/MusicList';
import MusicPlayer from './components/MusicPlayer';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';


function App() {
  const colors = useSelector((state)=> state.musicData.colors);

  return (
    <div className="App" style={{ backgroundImage: `linear-gradient(to right, ${colors[2]} 20%, ${colors[2]}` }}>
      <Navbar/>
      <div className='musicBody'>
      <MusicList/>
      <MusicPlayer/>
      </div>
    </div>
  );
}

export default App;
