const {Pool} = require('pg');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongsByPlaylistId(playlistId, owner) {
    const query = {
      text: `
      SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
      LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE (playlists.owner = $2 OR collaborations.user_id = $2)
      AND playlists.id = $1
      GROUP BY songs.id
        `,
      values: [playlistId, owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongService;
