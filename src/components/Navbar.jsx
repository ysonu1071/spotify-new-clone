import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logoImg from "../images/pngegg.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  setMenu,
  setPlaylist,
  setPlaylistId,
} from "../redux/slices/musicDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { getPlaylist } from "../gql/Query";
import { setLoginPage } from "../redux/slices/authSlice";

function Navbar() {
  const [screeWidth, setScreeWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeList, setActiveList] = useState(1);
  const { data } = useQuery(getPlaylist);
  const colors = useSelector((state) => state.musicData.colors);
  const auth = useSelector((state)=> state.auth);

  const dispatch = useDispatch();

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    dispatch(setMenu(!menuOpen));
  };

  const handlePlaylist = (e) => {
    let id = e.target.id;
    if(id === "3" || id === "4"){
      if(auth.loginStatus){
        dispatch(setPlaylistId(id));
        setActiveList(id);
      }else{
        dispatch(setLoginPage(true));
      }
    }else{
      dispatch(setPlaylistId(id));
      setActiveList(id);
    }
    
  };

  window.addEventListener("resize", () => {
    setScreeWidth(window.innerWidth);
    console.log("inner  width is ", screeWidth);
  });

  useEffect(() => {
    if (data) {
      dispatch(setPlaylist(data.getPlaylists));
    }
    // eslint-disable-next-line
  }, [data]);
  
  return (
    <div className="navbar">
      <div className="logoContainer">
        <img src={logoImg} alt="spotify logo" />
      </div>
      {menuOpen || (!menuOpen && screeWidth > 1130) ? (
        <div
          className="navContainer"
          style={{ backgroundColor: `${colors[2]}` }}
        >
          <ul>
            {/* {data?.getPlaylists.map((list) => (
              <li
                key={list.id}
                id={list.id}
                onClick={handlePlaylist}
                style={{ color: list.id === Number(activeList) && "whitesmoke" }}
              >
                {list.title}
              </li>
            ))} */}
            <li id="1" onClick={handlePlaylist} key="1" style={{ color: 1 === Number(activeList) && "whitesmoke" }}>For you</li>
            <li id="2" onClick={handlePlaylist} key="2" style={{ color: 2 === Number(activeList) && "whitesmoke" }}>Top tracks</li>
            <li id="3" onClick={handlePlaylist} key="3" style={{ color: 3 === Number(activeList) && "whitesmoke" }}>Favorites</li>
            <li id="4" onClick={handlePlaylist} key="4" style={{ color: 4 === Number(activeList) && "whitesmoke" }}>Recently played </li>
          </ul>
        </div>
      ) : null}
      <div className="menuContainer" onClick={handleMenu}>
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </div>
    </div>
  );
}

export default Navbar;
