import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import { toPng } from 'html-to-image';

const Input = () => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [cardColor, setCardColor] = useState('#000000');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Monospace');
  const [isValidLink, setIsValidLink] = useState(true);
  const [embedLink, setEmbedLink] = useState('');
  const [albumDetails, setAlbumDetails] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [selectedOption, setSelectedOption] = useState('topTracks'); // Default option
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cardRef = useRef();

  const clientId = import.meta.env.VITE_clientId
  const redirectUri = 'https://echo-frame.vercel.app/';

  useEffect(() => {
    document.body.style.zoom = "90%";
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
  
    if (code) {
      const getAccessToken = async (authCode) => {
        try {
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
              grant_type: 'authorization_code',
              code: authCode,
              redirect_uri: redirectUri,
              client_id: clientId,
              client_secret: import.meta.env.VITE_clientSecret
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
  
          const { access_token } = response.data;
          localStorage.setItem('spotifyAccessToken', access_token);
  
          // Fetch user's profile information
          const profileResponse = await axios.get(
            'https://api.spotify.com/v1/me',
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setUsername(profileResponse.data.display_name || profileResponse.data.id);
          setIsLoggedIn(true);
  
          // Fetch user's top tracks of the current month
          const topTracksResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setTopTracks(topTracksResponse.data.items);
  
          // Fetch user's top artists of the current month
          const topArtistsResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term',
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setTopArtists(topArtistsResponse.data.items);
  
          // Remove the ?code= parameter from the URL
          history.replaceState(null, '', window.location.pathname);
  
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };
  
      getAccessToken(code);
    }
  }, [clientId, redirectUri]);
  

  const handleSpotifyLogin = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const scopes = ['user-top-read'];
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      '%20'
    )}&response_type=code`;

    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    setIsLoggedIn(false);
    setUsername('');
    setTopTracks([]);
    setTopArtists([]);
  };

  const handleChange = (e) => {
    const link = e.target.value;
    setSpotifyLink(link);
    setIsValidLink(true);
  };

  const generateEmbedLink = () => {
    const albumId = getAlbumIdFromLink(spotifyLink);
    if (!albumId) {
      setIsValidLink(false);
      return '';
    }
    return `https://open.spotify.com/embed/album/${albumId}`;
  };

  const getAlbumIdFromLink = (link) => {
    const pattern = /spotify\.com\/album\/([a-zA-Z0-9]+)/;
    const match = link.match(pattern);
    if (!match || match.length < 2) {
      return null;
    }
    return match[1];
  };

  const handleGenerateEmbed = async () => {
    setIsValidLink(true);
    const albumId = getAlbumIdFromLink(spotifyLink);
    if (!albumId) {
      setIsValidLink(false);
      setEmbedLink('');
      setAlbumDetails(null);
      return;
    }

    try {
      const accessToken = localStorage.getItem('spotifyAccessToken');
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAlbumDetails(response.data);
      const generatedLink = generateEmbedLink();
      setEmbedLink(generatedLink);
    } catch (error) {
      console.error('Error fetching album details:', error);
    }
  };

  const handleExport = () => {
    if (cardRef.current) {
      toPng(cardRef.current, {                
        pixelRatio: 1,  // Adjust pixelRatio for higher quality
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'echoframe.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error exporting image:', error);
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div className="col-span-1 md:col-span-3 p-4 bg-gray-800 rounded-lg shadow-lg text-white">
            {isLoggedIn ? (
              <div ref={cardRef}>
                <Card
                  cardColor={cardColor}
                  fontColor={fontColor}
                  fontFamily={fontFamily}
                  isValidLink={isValidLink}
                  embedLink={embedLink}
                  albumDetails={albumDetails}
                  topTracks={topTracks}
                  topArtists={topArtists}
                  selectedOption={selectedOption}
                  setUsername={setUsername} // Pass setUsername to Card
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-xl">Log in with Spotify to generate an EchoFrame</p>
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-1 p-4 bg-gray-800 rounded-lg shadow-lg">
            {isLoggedIn ? (
              <>
                <div className="text-white mb-4">
                  <p>Hello {username}</p>
                  <p className="text-gray-400">Help us keep EchoFrame awesome! Your donation will help keep EchoFrame free forever! Thanks for your support!</p>
                </div>
                <div className="relative">
                  <select
                    className="form-select daisyui-form-select w-full"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="topTracks">🎵Top Tracks</option>
                    <option value="topArtists">🧑‍🎨Top Artists</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="btn btn-secondary w-full mt-2"                  
                >
                  Share EchoFrame on Instagram
                </button>
                <a target="_blank" href="https://www.buymeacoffee.com/echoframe "> <button className="btn btn-danger w-full mt-2">☕Donate</button> </a>                                                                                                  
                <button
                  onClick={handleLogout}
                  className="btn btn-danger w-full mt-2"
                >
                  Logout
                </button>           
                
              </>
            ) : (
              <button
                onClick={handleSpotifyLogin}
                className="btn btn-primary w-full"
              >
                Log in with Spotify
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Input