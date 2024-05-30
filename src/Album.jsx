import React from 'react';

const AlbumCover = () => {
  return (
    <div className="bg-gray-200 p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">KANYE WEST</h1>
        <div className="relative">
          <div className="w-40 h-40 bg-red-500 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-6xl">&#10084;</span>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-4">808s & Heartbreak</h2>
        <div className="flex mt-4">
          <div className="mr-4">
            <p className="text-gray-600 font-bold">INSTRU KERN</p>
            <p className="text-sm">SASHA SIREN</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">LAMIN</p>
            <p className="text-sm">VICTOR ROSEBIL</p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="mr-4">
            <p className="text-gray-600 font-bold">COLMST WINSTR</p>
            <p className="text-sm">ERHELINAMACHA</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">AMINOP</p>
            <p className="text-sm">STEVE L LORTS</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 font-bold">JON HAW BILLI</p>
          <p className="text-sm">MARSHALED</p>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 font-bold">ERIC LALA VINCE</p>
          <p className="text-sm">BLIND IN NUTSHAUSE</p>
        </div>
      </div>
    </div>
  );
};

export default AlbumCover;