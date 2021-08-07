const {Pool} = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT p.id, p.name, username 
        FROM playlists p
        RIGHT JOIN users ON users.id = owner
        LEFT JOIN collaborations ON collaborations.playlist_id = p.id
        WHERE owner = $1 OR collaborations.user_id = $1
        GROUP BY p.id, p.name, users.username
      `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
