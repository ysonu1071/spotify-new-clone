import React, { useEffect, useRef, useState } from "react";
import "../styles/musicPlayer.css";
import { ColorExtractor } from "react-color-extractor";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setColors, setCurrentSong } from "../redux/slices/musicDataSlice";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volumeValue, setVolumeValue] = useState(50);
  const [myProgressBar, setMyProgressBar] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [allFavoriteSong, setAllFevoriteSong] = useState([]);


  let currentSong = useSelector((state) => state.musicData.currentSong);
  let allSong = useSelector((state) => state.musicData.allMusic);

  const dispatch = useDispatch();

  let audioElRef = useRef();

  const handleRecentlyPlayed = (currentSong) => {
    if(localStorage.getItem("recentlyPlayed")){
      let arr = JSON.parse(localStorage.getItem("recentlyPlayed"));
      console.log("player: ", arr);
      arr.push(currentSong);
      localStorage.setItem("recentlyPlayed", JSON.stringify(arr));
    }else{
      let arr = [currentSong];
      localStorage.setItem("recentlyPlayed", JSON.stringify(arr));
    }
  }

  const addToFavorite = () => {
    if(localStorage.getItem("favoriteSong")){
      let favoriteSong = JSON.parse(localStorage.getItem("favoriteSong"));
      let obj = currentSong;
      favoriteSong.push(obj);
      localStorage.setItem("favoriteSong", JSON.stringify(favoriteSong));
    }else{
      let obj= currentSong;
      let favoriteSong = [];
      favoriteSong.push(obj);
      localStorage.setItem("favoriteSong", JSON.stringify(favoriteSong));
    }

    if(localStorage.getItem("favoriteSong")){
      let arr = JSON.parse(localStorage.getItem("favoriteSong"));
      setAllFevoriteSong(arr);
    }

    handleFavoriteStatus();

  }

  const deleteFromFavorite = () => {
    let id = currentSong._id;
    let arr = allFavoriteSong.filter((song)=> song._id !== id);
    setAllFevoriteSong(arr);
    setIsFavorite(false);

    let allData = JSON.parse(localStorage.getItem("favoriteSong"));
    arr = allData.filter((song)=> song._id !== id);
    localStorage.setItem("favoriteSong", JSON.stringify(arr));
  }
  const updateProgressBar = () => {
    audioElRef.current.addEventListener("timeupdate", () => {
      let progress = parseInt(
        (audioElRef.current.currentTime / audioElRef.current.duration) * 100
      );
      setMyProgressBar(progress);
      if (audioElRef.current.currentTime === audioElRef.current.duration) {
        setIsPlaying(false);
      }
    });
  };

  const handleProgressBar = (e) => {
    audioElRef.current.currentTime =
      (e.target.value * audioElRef.current.duration) / 100;
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      audioElRef.current.play();
      console.log(audioElRef.current.currentTime);
      updateProgressBar();
      handleRecentlyPlayed(currentSong);
    } else {
      audioElRef.current.pause();
      console.log(audioElRef.current.currentTime);
    }

    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    for (let i = 0; i < allSong.length; i++) {
      if (allSong[i]._id === currentSong._id) {
        if (i < allSong.length - 1) {
          dispatch(setCurrentSong(allSong[i + 1]));
        } else {
          dispatch(setCurrentSong(allSong[0]));
        }
      }
    }
  };

  const handlePrevious = () => {
    for (let i = 0; i < allSong.length; i++) {
      if (allSong[i]._id === currentSong._id) {
        if (i > 0) {
          dispatch(setCurrentSong(allSong[i - 1]));
        } else {
          dispatch(setCurrentSong(allSong[allSong.length - 1]));
        }
      }
    }
  };

  const handleVolume = (e) => {
    let value = Number(e.target.value / 100).toFixed(1);
    audioElRef.current.volume = value;
    console.log(value);
    setVolumeValue(e.target.value);
  };

  const getColors = (colors) => {
    dispatch(setColors(colors));
  };

  const handleFavoriteStatus = () => {
    console.log("its working..")
    let id = currentSong._id;
    let flag = false;
    for(let song of allFavoriteSong){
      if(song._id === id){
        flag = true;
      }
    }

    if(flag){
      setIsFavorite(true);
    }else{
      setIsFavorite(false);
    }
  }
  useEffect(() => {
    if (currentSong) {
      audioElRef.current.pause();
      setMyProgressBar(0);
      audioElRef.current.src = currentSong.url;
      if (isPlaying) {
        audioElRef.current.play();
        updateProgressBar();
        handleRecentlyPlayed(currentSong);
      }
    }

    if(localStorage.getItem("favoriteSong")){
      let arr = JSON.parse(localStorage.getItem("favoriteSong"));
      setAllFevoriteSong(arr);
    }
    console.log("all fev song is: ", allFavoriteSong);
    handleFavoriteStatus();

  }, [currentSong]);

  return (
    <div className="musicPlayer">
      <audio ref={audioElRef} src={currentSong.url} />
      <p className="musicName">{currentSong.title}</p>
      <p className="subtitle">{currentSong.artist}</p>
      <ColorExtractor getColors={getColors}>
        <img src={currentSong.photo} alt={currentSong.title} />
      </ColorExtractor>
      <br />
      <input
        type="range"
        min="0"
        max="100"
        value={myProgressBar}
        onChange={handleProgressBar}
      />
      <div className="musicController">
        {!isFavorite ? <div className="favoriteIcon">
          <p className="favoriteIconText">Add to Favorite</p>
          <StarBorderIcon onClick={addToFavorite}/>
        </div>:
        <div className="favoriteIcon">
          <p className="favoriteIconText">Remove from Favorite</p>
          <StarIcon onClick={deleteFromFavorite}/>
        </div>}
        <div className="mainController">
          <FontAwesomeIcon
            icon={faBackward}
            onClick={handlePrevious}
            style={{ cursor: "pointer" }}
          />
          <div className="playandpause" onClick={handlePlayPause}>
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </div>
          <FontAwesomeIcon
            icon={faForward}
            onClick={handleNext}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="moreIcon" onClick={() => setShowVolume(!showVolume)}>
          {showVolume && (
            <div className="volume-container">
              <input
                type="range"
                className="volume"
                value={volumeValue}
                min={0}
                max={100}
                onClick={(e) => e.stopPropagation()}
                onChange={handleVolume}
              />
            </div>
          )}
          <VolumeUpIcon />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
