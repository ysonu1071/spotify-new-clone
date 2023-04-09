import React, { useEffect, useRef, useState } from "react";
import "../styles/musicPlayer.css";
import { ColorExtractor } from "react-color-extractor";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
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

  let currentSong = useSelector((state) => state.musicData.currentSong);
  let allSong = useSelector((state) => state.musicData.allMusic);

  const dispatch = useDispatch();

  let audioElRef = useRef();

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

  useEffect(() => {
    if (currentSong) {
      audioElRef.current.pause();
      setMyProgressBar(0);
      audioElRef.current.src = currentSong.url;
      if (isPlaying) {
        audioElRef.current.play();
        updateProgressBar();
      }
    }
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
        <div className="moreIcon">
          <MoreHorizIcon />
        </div>
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
