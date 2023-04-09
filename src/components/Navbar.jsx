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

function Navbar() {
  const [screeWidth, setScreeWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeList, setActiveList] = useState(1);
  const { loading, error, data } = useQuery(getPlaylist);
  const colors = useSelector((state) => state.musicData.colors);

  const dispatch = useDispatch();

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    dispatch(setMenu(!menuOpen));
  };

  const handlePlaylist = (e) => {
    let id = e.target.id;
    dispatch(setPlaylistId(id));
    alert(activeList);
    setActiveList(id);
  };

  window.addEventListener("resize", () => {
    setScreeWidth(window.innerWidth);
    console.log("inner  width is ", screeWidth);
  });

  useEffect(() => {
    if (data) {
      dispatch(setPlaylist(data.getPlaylists));
      console.log(data);
    }
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
            {data?.getPlaylists.map((list) => (
              <li
                key={list.id}
                id={list.id}
                onClick={handlePlaylist}
                style={{ color: list.id === activeList && "whitesmoke" }}
              >
                {list.title}
              </li>
            ))}
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
