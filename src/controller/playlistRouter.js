const express = require("express");
const Playlist = require("../mongo/Schema/Playlist/playlist");
const playlistRouter = express.Router();

const getPlaylistMiddleware = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  if (!id) {
    return res.status(404).send();
  }

  const playlist = await Playlist.findById(id);
  console.log(playlist);
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
  const { query: queryParams } = req;
  let query = {};
  if (queryParams.search) {
    query = {
      $or: [
        { name: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ],
    };
  }
  const userId = req.auth.id;

  let playlists = [];

  if (req.auth.role === "ADMIN" || req.auth.role === "USER") {
    playlists = await Playlist.find(query)
      .populate({
        path: "song",
        select: "title",
      })
      .populate({ path: "user", select: "name" });
  } else {
    playlists = await Playlist.find({ user: userId })
      .populate({
        path: "song",
        select: "title",
      })
      .populate({ path: "user", select: "name" });
  }
  res.json(playlists);
});

// playlistRouter.get("/playlist/:id", async (req, res) => {
// return res.status(200).json(req.playlist);
// });
playlistRouter.get("/playlist/:id", async (req, res) => {
  const { id } = req.params;
  if (id !== undefined) {
    const playlist = await Playlist.findById(id).populate({
      path: "song",
    });
    if (!playlist) {
      return res.status(404).send();
    }
    res.json(playlist);
  }
  return res.status(404).send();
});

playlistRouter.get("/playlist/search", async (req, res) => {
  const playlist = await Playlist.find(req.body);
  res.json(playlist);
});

playlistRouter.post("/playlist", async (req, res) => {
  const body = req.body;

  const data = {
    name: body.name,
    song: body.song,
    photo: body.photo,
    description: body.description,
    user: body.user,
  };

  const playList = new Playlist(data);
  const newPlaylist = await playList.save();
  res.status(201).json(newPlaylist);
});

playlistRouter.patch(
  "/playlist/:id/add-song",
  // getPlaylistMiddleware,
  async (req, res) => {
    const { songId } = req.body;

    console.log("paso por aqui");
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { song: [songId] } }
    );
    return res.status(200).json(playlist);
  }
);

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
