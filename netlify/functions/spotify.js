const querystring = require("querystring");

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = process.env;

const basicAuth = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");

const getAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await response.json();
  return data.access_token;
};

const getNowPlaying = async (accessToken) => {
  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.handler = async () => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Spotify environment variables." }),
    };
  }

  try {
    const accessToken = await getAccessToken();
    const response = await getNowPlaying(accessToken);

    if (response.status === 204 || response.status === 202) {
      return {
        statusCode: 200,
        headers: {
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ isPlaying: false }),
      };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ isPlaying: false }),
      };
    }

    const data = await response.json();
    const song = data.item;

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        isPlaying: data.is_playing,
        track: song?.name || "Unknown",
        artist: song?.artists?.map((artist) => artist.name).join(", ") || "Unknown",
        albumArt: song?.album?.images?.[0]?.url || "/assets/images/og.png",
        songUrl: song?.external_urls?.spotify || "https://open.spotify.com/",
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ isPlaying: false }),
    };
  }
};
