import React from 'react';

const Card = ({
  cardColor,
  fontColor,
  fontFamily,
  isValidLink,
  embedLink,
  albumDetails,
  topTracks,
  topArtists,
  selectedOption,
}) => {
  return (
    <div
      style={{
        backgroundColor: cardColor,
        color: fontColor,
        fontFamily: fontFamily,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="rounded-lg shadow-lg p-4"
    >
      {isValidLink ? (
        <>
          {albumDetails && (
            <div className="mb-4">
              <iframe
                src={embedLink}
                width="300"
                height="380"
                frameBorder="0"
                allowTransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">Top {selectedOption === 'topTracks' ? 'Tracks' : 'Artists'}</h2>
          <ul>
            {(selectedOption === 'topTracks' ? topTracks : topArtists).map((item, index) => (
              <li key={index} className="mb-2">
                {item.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Invalid Spotify Link</p>
      )}
    </div>
  );
};

export default Card;
