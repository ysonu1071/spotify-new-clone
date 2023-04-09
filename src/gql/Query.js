import { gql } from "@apollo/client";

export const getPlaylist = gql`
  query {
    getPlaylists {
      id
      title
    }
  }
`;

export const getSonglist = gql`
  query ($playlistId: Int!) {
    getSongs(playlistId: $playlistId) {
      _id
      title
      photo
      url
      duration
      artist
    }
  }
`;
