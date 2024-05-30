import React from 'react';
import { format } from 'date-fns';

const Card = ({ cardColor, fontColor, fontFamily, isValidLink, embedLink, topTracks, topArtists, selectedOption }) => {
  const currentMonth = format(new Date(), 'MMMM');  

  const renderTracksOrArtists = () => {
    if (selectedOption === 'topTracks') {
      return (
        <>
          {topTracks.length > 0 && (            
            <div className="max-w-md mx-auto bg-black rounded-lg overflow-hidden shadow-lg mt-4">
              <div className="px-4">
                <h6 className="text-white text-base font-bold mb-2">Top Tracks | {currentMonth}</h6>
                <p className="text-sm text-green-300 mb-4">Made with https://echo-frame.vercel.app/</p>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-white">
                    <tbody>
                      {topTracks.map((track, index) => (
                        <tr key={track.id} className="border-b border-gray-600">
                          <td className="px-2 py-2 text-center text-gray-400">{index + 1}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <div className="w-12 h-12 mr-4 overflow-hidden">
                                <img className="w-full h-full object-cover rounded" src={track.album.images[0].url} alt={track.album.name} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{track.name}</p>
                                <p className="text-xs text-gray-400">{track.artists.map(artist => artist.name).join(', ')}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (selectedOption === 'topArtists') {
      return (
        <>
          {topArtists.length > 0 && (
            <div className="max-w-md mx-auto bg-black rounded-lg overflow-hidden shadow-lg mt-4">
              <div className="px-4 py-2">
              <h6 className="text-white text-base font-bold mb-2">Top Artists | {currentMonth}</h6>
                <p className="text-xs text-green-300 mb-4">Made with https://echo-frame.vercel.app/</p>                
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-white">
                    <tbody>
                      {topArtists.map((artist, index) => (
                        <tr key={artist.id} className="border-b border-gray-600">
                          <td className="px-2 py-2 text-center text-gray-400">{index + 1}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <div className="w-12 h-12 mr-4 overflow-hidden">
                                <img className="w-full h-full object-cover rounded" src={artist.images[0].url} alt={artist.name} />
                              </div>e 
                              <p className="text-xs font-medium">{artist.name}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-black text-white rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: cardColor, color: fontColor, fontFamily }}>      
      {renderTracksOrArtists()}
    </div>    
  );
};

export default Card;