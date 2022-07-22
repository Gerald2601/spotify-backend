const express = require("express");
const Playlist = require("../mongo/Schema/Playlist/playlist");
const playlistRouter = express.Router();

const getPlaylistMiddleware = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(404).send();
  }

  const playlist = await Playlist.findById(id);

  if (!playlist) {
    return res.status(404).send();
  }

  //compruebo que el USER de la Playlist (el que la ha creado) coincida con el user que esta haciendo la peticion ahora.
  if (playlist.user !== req.auth.id || req.auth.role === "USER") {
    return res.status(401).send();
  }

  req.playlist = playlist;
  next();
};

playlistRouter.get("/playlist", async (req, res) => {
  const userId = req.auth.id;

  let playlists = [];

  if (req.auth.role === "ADMIN") {
    playlists = await Playlist.find().populate({
      path: "song",
      select: "title",
    });
  } else {
    playlists = await Playlist.find({ user: userId }).populate({
      path: "song",
      select: "title",
    });
  }
  res.json(playlists);
});

playlistRouter.get("/playlist/:id", getPlaylistMiddleware, async (req, res) => {
  return res.status(200).json(req.playlist);
});

playlistRouter.get("/playlist/search", async (req, res) => {
  const playlist = await Playlist.find(req.body);
  res.json(playlist);
});

playlistRouter.post("/playlist", async (req, res) => {
  const body = req.body;

  const data = {
    name: body.name,
    songs: body.songs,
    photo: body.photo,
    description: body.description,
    user: body.user,
  };

  const playList = new Playlist(data);
  const newPlaylist = await playList.save();
  res.status(201).json(newPlaylist);
});

playlistRouter.patch(
  "/playlist/:id",
  getPlaylistMiddleware,
  async (req, res) => {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(playlist);
  }
);

playlistRouter.delete(
  "/playlist/:id",
  getPlaylistMiddleware,
  async (req, res) => {
    const playlist = await Playlist.findByIdAndRemove(req.params.id, {
      returnOriginal: true,
    });
    return res.status(204).send();
  }
);

module.exports = playlistRouter;
