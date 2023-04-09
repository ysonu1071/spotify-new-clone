import { createSlice } from "@reduxjs/toolkit";

const musicDataSlice = createSlice({
  name: "musicData",
  initialState: {
    isMenuOpen: false,
    playlistId: 1,
    currentSong: {
      _id: "61b6f14dc2f7cafd968c31f4",
      title: "Adventure of a Lifetime",
      url: "https://storage.googleapis.com/similar_sentences/Imagine%20Dragons%20-%20West%20Coast%20(Pendona.com).mp3",
      photo: "https://i.scdn.co/image/ab67616d0000b273f864bcdcc245f06831d17ae0",
      artist: "Coldplay",
    },
    allMusic: [],
    playlist: [],
    colors: ["#3b82c3", "#c3d4e4", "#142c42", "#65768a", "#a8b4cc", "#24344c"],
  },
  reducers: {
    setMenu: (state, action) => {
      state.isMenuOpen = action.payload;
    },

    setPlaylistId: (state, action) => {
      state.playlistId = action.payload;
    },

    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },

    setAllMusic: (state, action) => {
      state.allMusic = [...action.payload];
    },

    setPlaylist: (state, action) => {
      state.playlist = [...action.payload];
    },

    setColors: (state, action) => {
      state.colors = [...action.payload];
    },
  },
});

export const {
  setMenu,
  setPlaylistId,
  setCurrentSong,
  setAllMusic,
  setPlaylist,
  setColors,
} = musicDataSlice.actions;
export default musicDataSlice.reducer;
