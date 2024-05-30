import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import { toPng } from 'html-to-image';

const Input = () => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [cardColor, setCardColor] = useState('#000000');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [fontFamily, setFontFamily] = useState('Monospace');
  const [isValidLink, setIsValidLink] = useState(true);
  const [embedLink, setEmbedLink] = useState('');
  const [albumDetails, setAlbumDetails] = useState(null);
  const cardRef = useRef();

  const clientId = process.env.clientId
  const clientSecret = process.env.clientSecret
  console.log('hello there')
  console.log(clientId)
  console.log(clientSecret)

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const authResponse = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
          }
        );
        const accessToken = authResponse.data.access_token;
        localStorage.setItem('spotifyAccessToken', accessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    getAccessToken();
  }, [clientId, clientSecret]);

  const handleChange = (e) => {
    const link = e.target.value;
    setSpotifyLink(link);
    setIsValidLink(true);
  };

  const setThemeColors = (theme) => {
    setSelectedTheme(theme);
    if (theme === 'light') {
      setCardColor('#f9f6ec');
      setFontColor('#000000');
    } else {
      setCardColor('#000000');
      setFontColor('#ffffff');
    }
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
      toPng(cardRef.current, { pixelRatio: 5 })  // Adjust pixelRatio for higher quality
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'card.png';
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
            <div ref={cardRef}>
              <Card
                cardColor={cardColor}
                fontColor={fontColor}
                fontFamily={fontFamily}
                isValidLink={isValidLink}
                embedLink={embedLink}
                albumDetails={albumDetails}
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 p-4 bg-gray-800 rounded-lg shadow-lg">
            <input
              type="text"
              value={spotifyLink}
              onChange={handleChange}
              placeholder="Enter Spotify album link"
              className={`input input-bordered w-full mb-2 text-white ${isValidLink ? '' : 'text-red-500'}`}
            />
            <div className="flex items-center mb-2">
              <select
                className="select select-bordered bg-gray-700 text-white w-full mr-2"
                onChange={(e) => setThemeColors(e.target.value)}
                value={selectedTheme}
              >
                <option value="dark">Dark Theme🌙</option>
                <option value="light">Light Theme☀️</option>
              </select>
            </div>
            <button
              onClick={handleGenerateEmbed}
              className="btn btn-primary w-full mb-2"
            >
              Generate EchoFrame
            </button>
            <button
              onClick={handleExport}
              className="btn btn-secondary w-full"
              disabled={!embedLink && !albumDetails}
            >
              Export EchoFrame
            </button>
            {albumDetails && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
                <h2 className="text-xl mb-2">So you like {albumDetails.artists[0].name}?</h2>
                <p>We too like {albumDetails.artists[0].name}, Infact we like everything music related! Please donating </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
