
import './App.css';
import MusicList from './components/MusicList';
import MusicPlayer from './components/MusicPlayer';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { setLoginPage, setLoginStatus, setRegisterPage } from './redux/slices/authSlice';

function App() {
  const colors = useSelector((state)=> state.musicData.colors);
  const auth = useSelector((state)=> state.auth);

  const dispatch = useDispatch();
  // localStorage.clear();
  if(localStorage.getItem("spotifyUser")){
    let obj = JSON.parse(localStorage.getItem("spotifyUser"));
    console.log("its stats: ", obj)
    if(obj.loginStatus){
      dispatch(setLoginStatus(true));
    }
  }

  const handleLogout = () =>{
    let obj = JSON.parse(localStorage.getItem("spotifyUser"));
    obj.loginStatus = false;
    localStorage.setItem("spotifyUser", JSON.stringify(obj));
    dispatch(setLoginStatus(false));
  }
  
  return (
    <div className="App" style={{ backgroundImage: `linear-gradient(to right, ${colors[2]} 20%, ${colors[2]}` }}>

      <div className='login-btn-container'>
       {auth.loginStatus ? <button onClick={handleLogout}>Sign Out</button> : <button onClick={()=> dispatch(setLoginPage(true))}>Sign In</button>}
      </div>
      { auth.showLoginPage && <div className='login-page-container'>
          <button style={{
            "position": "absolute",
            "right": "50px",
            "top": "50px",
            "fontSize": "25px",
            "padding": "5px 10px",
            "background": "transparent",
            "border": "1px solid blue",
            "cursor":"pointer"
          }} onClick={()=> dispatch(setLoginPage(false))}>x</button>
         <SignIn/>
         </div>}
      { auth.showRegisterPage && <div className='login-page-container'>
      <button style={{
            "position": "absolute",
            "right": "50px",
            "top": "50px",
            "fontSize": "25px",
            "padding": "5px 10px",
            "background": "transparent",
            "border": "1px solid blue",
            "cursor":"pointer"
          }} onClick={()=> dispatch(setRegisterPage(false))}>x</button>
         <SignUp/></div>}
      
      {true && <Navbar/>}
      {true && <div className='musicBody'>
      <MusicList/>
      <MusicPlayer/>
      </div>}
    </div>
  );
}

export default App;
