const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "<enter clientId here>",
  clientSecret = "<enter clientSecret here>";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/artists", (req, res) => {
  const q = req.query.q;
  spotifyApi
    .searchArtists(q)
    .then(data => {
      console.log("Data received from the API: Artists");
      const artistList = data.body.artists.items;
      res.render("artists", { artistList });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(`${artistId}`)
    .then(data => {
      console.log("Data received from the API: Albums");
      const albumList = data.body.items;
      res.render("albums", { albumList });
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(`${albumId}`)
    .then(data => {
      console.log("Data received from the API: Tracks");
      const trackList = data.body.items;
      console.log(trackList[0]);
      res.render("tracks", { trackList });
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    });
});
