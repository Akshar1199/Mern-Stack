const express = require('express');
const router = express.Router();
const Playlist = require('../models/PlaylistModel');

router.post('/new', async (req, res) => {
  try {
    const { username, title, description, songs, playlistId } = req.body;
    console.log(username, title, description, songs, playlistId);
    // Check if the user already exists
    const existingPlaylist = await Playlist.findOne({ title });
    if (existingPlaylist) {
      return res.status(400).json({ message: 'Playlist already exists' });
    }
    const newPlaylist = new Playlist({
        playlistId,
        title,
        description,
        username,
        songs,
    });

    await newPlaylist.save();
    return res.status(201).json({ message: 'Playlist added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { newsong, playlistId } = req.body;
    console.log( newsong, playlistId);
    // Check if the user already exists
    const existingPlaylist = await Playlist.findOne({ playlistId });
    if (!existingPlaylist) {
      return res.status(400).json({ message: 'Playlist does not exists' });
    }

    existingPlaylist.songs.push(newsong);
    await existingPlaylist.save();
    return res.status(201).json({ message: 'Playlist updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router.post('/delete', async (req, res) => {
//   try {
//     const { playlistId } = req.body;
//     // const username= "priyanshi", title="test", description="test playlist";
//     console.log(playlistId);
//     // Check if the user already exists
//     const existingPlaylist = await Playlist.findOne({ playlistId });
//     if (!existingPlaylist) {
//       return res.status(400).json({ message: 'Playlist does not exist' });
//     }
    
//     existingPlaylist.delete();

//     return res.status(201).json({ message: 'Playlist deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;
