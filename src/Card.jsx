import React from 'react';
import QRCode from 'qrcode.react';

const Card = ({ cardColor, fontColor, fontFamily, isValidLink, embedLink, albumDetails }) => {
  const tracks = albumDetails ? albumDetails.tracks.items : [];

  // Function to convert milliseconds to hours and minutes
  const msToHMS = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes, seconds };
  };

  // Calculate total duration of the album
  const totalDuration = tracks.reduce((total, track) => total + track.duration_ms, 0);
  const { hours, minutes } = msToHMS(totalDuration);

  // Format total duration
  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration = `${hours} hour${hours === 1 ? '' : 's'} ${minutes} minute${minutes === 1 ? '' : 's'}`;
  } else {
    formattedDuration = `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  // Generate QR code for Spotify playlist or album link
  const qrCodeUrl = isValidLink ? embedLink : '';

  // Helper function to remove features from track name
  const removeFeatures = (name) => {
    // Remove text within parentheses and trim surrounding whitespace
    return name.replace(/\([^()]*\)/g, '').trim();
  };

  // Helper function to chunk the tracks into rows of 4
  const chunkArray = (arr, size) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArray.push(arr.slice(i, i + size));
    }
    return chunkedArray;
  };

  const chunkedTracks = chunkArray(tracks, 4);

  return (
    <div
      className="rounded-lg shadow-lg p-4 relative"
      style={{ backgroundColor: cardColor, color: fontColor, fontFamily }}
    >
      {isValidLink ? (
        albumDetails ? (
          <div>
            <div className="flex flex-col items-center md:flex-row md:items-start mb-4">
              <img
                src={albumDetails.images[0]?.url}
                alt={albumDetails.name}
                className="w-48 h-48 md:w-64 md:h-64 object-cover mb-4 md:mb-0 md:mr-4"
              />
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{albumDetails.name}</h2>
                <p className="text-base md:text-lg mb-2">{albumDetails.artists.map(artist => artist.name).join(', ')}</p>
                <p className="text-base md:text-lg mb-2">{new Date(albumDetails.release_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                <p className="text-base md:text-lg">{albumDetails.genres.length > 0 ? `Genres: ${albumDetails.genres.join(', ')}` : ''}</p>
                <p className="text-base md:text-lg">{formattedDuration}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {chunkedTracks.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((track, colIndex) => (
                        <td key={colIndex} className="px-2 md:px-4 py-1 md:py-2">
                          <p className="text-base md:text-xs">{removeFeatures(track.name)}</p>
                        </td>
                      ))}
                      {/* Fill empty cells if the row doesn't have enough tracks */}
                      {row.length < 4 && (
                        <React.Fragment>
                          {[...Array(4 - row.length)].map((_, index) => (
                            <td key={`empty-${index}`} className="px-2 md:px-4 py-1 md:py-2"></td>
                          ))}
                        </React.Fragment>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* QR Code */}
            <div className="absolute top-4 right-4">
              <QRCode value={qrCodeUrl} size={128} />
            </div>
          </div>
        ) : (
          <p className="text-lg text-center">Enter a Spotify album link</p>
        )
      ) : (
        <p className="text-lg text-red-500 text-center">Not a valid Spotify album link.</p>
      )}
    </div>
  );
};

export default Card;
