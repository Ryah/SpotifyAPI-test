var SpotifyWebApi = require('spotify-web-api-node');
const resetBtn = document.getElementById('reset');
const callBtn = document.getElementById('apiCallBtn');
// #region Init Spotify Web API
var spotifyApi = new SpotifyWebApi({
    clientId: 'PutClientIDHere',
    clientSecret: 'PutClientSecretHere',
    redirectUri: 'http://www.example.com/callback'
});

var clientId = 'PutClientIDHere',
    clientSecret = 'PutClientSecretHere';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

    },
    function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);
// #endregion

function apiCall() {
    searchSong();
};

function searchSong() {
    callBtn.disabled = true;
    var artists;
    var releaseDate;
    var datePrec;
    var albumArt;
    var songName;
    var song = document.getElementById("song").value;
    var searchQuery = doSearchQuery()
    spotifyApi.searchTracks(searchQuery)
        .then(function (data) {
            console.log('Search by ' + song, data.body);
            artists = data.body.tracks.items[0].artists;
            releaseDate = data.body.tracks.items[0].album.release_date
            datePrec = data.body.tracks.items[0].album.release_date_precision
            albumArt = data.body.tracks.items[0].album.images[0]
            songName = data.body.tracks.items[0].name
            parseResponse(songName, artists, releaseDate, datePrec, albumArt);
        }, function (err) {
            console.error(err);
        });
}

function doSearchQuery() {
    var song = null;
    var artist = null;
    var song = document.getElementById("song").value;
    var artist = document.getElementById("artist").value;
    // alert(song + " | " + artist)
    if (artist == "Artist" || artist == '') {
        return "track:" + song;
    } else {
        return "track:" + song + " artist:" + artist;
    }
}

function parseResponse(songName, artists, releaseDate, datePrec, albumArt) {
    var artistFormat = stringArtist(artists);
    var albumArt = stringArt(albumArt);
    var relYear = stringDate(releaseDate, datePrec);
    document.getElementById('song').value = songName;
    document.getElementById('artist').value = artistFormat;
    document.getElementById('imgid').src = albumArt;
    document.getElementById('albumArt').value = albumArt;
    document.getElementById('year').value = relYear;
    resetBtn.disabled = false;
}

function stringArtist(objStr) {
    if (typeof objStr === 'object' && objStr !== null) {
        var str = '';
        for (let i = 0; i < objStr.length; i++) {
            str += objStr[i].name + ", ";
            console.log(str + str.length);
        }
        strFor = str.substring(0, str.length-2)
        return strFor;
    }
    return objStr;
}

function stringArt(artObj) {
    if (typeof objStr === 'object' && objStr !== null) {
        console.log(artObj);
        return artObj.url;
    }
    console.log(artObj);
    return artObj.url;
}

function stringDate(releaseDate, datePrec) {
    if (datePrec == "day") {
        datePrecFormat = releaseDate.substring(0, 4);
    }
    return datePrecFormat
}

function resetAll() {
    document.getElementById('song').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('imgid').src = '';
    document.getElementById('albumArt').value = '';
    document.getElementById('year').value = '';
    resetBtn.disabled = true;
    callBtn.disabled = false;
}
