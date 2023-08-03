import React, { useEffect, useState } from "react";
import "../styles/musicList.css";
import SearchIcon from "@mui/icons-material/Search";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { getSonglist } from "../gql/Query";
import { setAllMusic, setCurrentSong } from "../redux/slices/musicDataSlice";

function MusicList() {
  const [screeWidth, setScreeWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState("");
  const [allMusicData, setAllMusicData] = useState([]);
  const activeMusic = useSelector((state) => state.musicData.currentSong._id);
  const isMenuOpen = useSelector((state) => state.musicData.isMenuOpen);
  const playlistId = useSelector((state) => state.musicData.playlistId);
  const playlist = useSelector((state) => state.musicData.playlist);
  const colors = useSelector((state) => state.musicData.colors);

  const dispatch = useDispatch();

  const skeletonArr = new Array(7);
  skeletonArr.fill(0);

  const { loading, data, refetch } = useQuery(getSonglist, {
    variables: { playlistId },
  });

  if (data) {
    dispatch(setAllMusic(data.getSongs));
  }

  const handleMusic = (song) => {
    dispatch(setCurrentSong(song));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    let text = searchText.toLowerCase();
    if (!data) {
      alert("Song could not found!, Refresh the page to get previous song.");
      return;
    }

    if (text === "") {
      setAllMusicData(data.getSongs);
      return;
    }

    let temp = [];
    for (const obj of data.getSongs) {
      if (
        obj.title.toLowerCase().includes(text) ||
        obj.artist.toLowerCase().includes(text)
      ) {
        temp.push(obj);
      }
    }

    setAllMusicData(temp);
  };

  useEffect(() => {
    setAllMusicData(data?.getSongs);
  }, [data]);


  useEffect(() => {
    if(playlistId == "3"){
      if(localStorage.getItem("favoriteSong")){
        let tempAllMusic = JSON.parse(localStorage.getItem("favoriteSong"));
        dispatch(setAllMusic(tempAllMusic));
        setAllMusicData(tempAllMusic);
      }
    
    }else if(playlistId == "4"){
      if(localStorage.getItem("recentlyPlayed")){
        let tempAllMusic = JSON.parse(localStorage.getItem("recentlyPlayed"));
        dispatch(setAllMusic(tempAllMusic));
        setAllMusicData(tempAllMusic);
      }
    }else{
      refetch({ playlistId: Number(playlistId) });
    }
    // eslint-disable-next-line
  }, [playlistId]);

  window.addEventListener("resize", () => {
    setScreeWidth(window.innerWidth);
  });

  return (
    <>
      {(isMenuOpen && screeWidth <= 800) || screeWidth > 800
        ? !loading && (
            <div
              className="musicList"
              style={{
                zIndex: screeWidth < 800 ? 6 : 2,
                backgroundColor: `${colors[2]}`,
              }}
            >
              <p id="musicList-title">{playlist[playlistId - 1]?.title}</p>
              <div className="searchContainer">
                <input
                  type="text"
                  placeholder="Search Song, Artist"
                  value={searchText}
                  onChange={handleSearch}
                />
                <SearchIcon />
              </div>
              <div className="musicList-container">
                {allMusicData?.map((song) => (
                  <div
                    key={song._id}
                    className="music"
                    onClick={() => handleMusic(song)}
                    style={{
                      backgroundColor: song._id === activeMusic && "#2d2d4188",
                    }}
                  >
                    <div className="musicProfile-container">
                      <img src={song.photo} alt={song.title} />
                      <div>
                        <p className="musicName">{song.title}</p>
                        <p className="musicSubtitle">{song.artist}</p>
                      </div>
                    </div>
                    <div className="musicDuration">
                      {(song.duration / 60).toFixed(2).split(".")[0] +
                        ":" +
                        (song.duration / 60).toFixed(2).split(".")[1]}
                    </div>
                  </div>
                ))}

                {!loading && (allMusicData?.length == 0) && (
                  <div className="notfound-message">
                    Music not found!, Refresh the page to get previous music.
                  </div>
                )}
              </div>
            </div>
          )
        : null}

      {loading && (
        <div className="musiclist-skeleton">
          <Skeleton
            variant="rounded"
            animation="wave"
            width={310}
            height={40}
          />

          {skeletonArr.map((item) => (
            <div className="musicProfile-skeleton">
              <Skeleton
                variant="circular"
                animation="wave"
                width={50}
                height={50}
              />
              <div>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={250}
                  height={20}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={250}
                  height={20}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MusicList;
