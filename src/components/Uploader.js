import { React, useRef, useState, useEffect } from 'react';
import { BsFileEarmarkMusicFill, BsTrashFill, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import Image from 'next/image';
import uploadImage from '../../public/images/arts/upload.png';
import * as mm from 'music-metadata-browser';

function Uploader() {
  const audioRef = useRef();
  const [audio, setAudio] = useState(null);
  const [fileName, setFileName] = useState("No files chosen");
  const [artwork, setArtwork] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileChange = async ({ target: { files } }) => {
    if (files[0]) {
      setFileName(files[0].name);
      const audioUrl = URL.createObjectURL(files[0]);
      setAudio(audioUrl);

      const metadata = await mm.parseBlob(files[0]);
      if (metadata.common.picture && metadata.common.picture[0]) {
        const { data, format } = metadata.common.picture[0];
        const blob = new Blob([data], { type: `image/${format}` });
        setArtwork(URL.createObjectURL(blob));
      }

      setIsPlaying(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    if (audioFiles.length > 0) {
      handleFileChange({ target: { files: audioFiles } });
    }
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
      return;
    }
    
    const clickPositionInProgressBar = e.pageX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPositionInProgressBar / progressBar.offsetWidth) * 100;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const formatTime = function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !isNaN(audioRef.current.duration)) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        setDuration(audioRef.current.duration);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [audio]);

  return (
    <main className='w-full flex flex-col items-center justify-between'>
      <form 
        className='h-96 w-2/4 flex flex-col justify-center items-center border-4 border-dashed border-blue-600 rounded-md mb-1'
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input type='file' accept='audio/*' className='input-field' hidden onChange={handleFileChange} />
        {
          audio ?  
          <>
            {
              artwork ? 
              <img 
                className='w-60 h-60 rounded-md cursor-pointer' src={artwork} alt='artwork' 
                onClick={() => document.querySelector('.input-field').click()} 
              /> :
              <img 
                className='w-60 h-60 rounded-md cursor-pointer' src='/images/arts/default-artwork.png' alt='artwork'
                onClick={() => document.querySelector('.input-field').click()}
              />
            }
            <audio ref={audioRef} src={audio} crossOrigin="anonymous" />
            <div className='mt-8 w-4/5 h-1 bg-gray-300 cursor-pointer rounded-md' onClick={handleProgressBarClick}>
              <div className='progress-bar' style={{ width: `${progress}%`, height: '5px', backgroundColor: 'blue', borderRadius: '0.375rem' }}></div>
            </div>
            <div className='w-full flex justify-between'>
              <span className='w-9 ml-[3.8rem] text-sm mt-1 flex justify-start'>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
              {
                audio && 
                <button
                  type='button'
                  className='text-5xl mt-3'
                  onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                >{isPlaying ? <BsPauseCircleFill/> : <BsPlayCircleFill/>}
                </button>
              }
              <span className='w-9 mr-[3.8rem] text-sm mt-1 flex justify-end'>{audioRef.current ? `-${formatTime(duration - audioRef.current.currentTime)}` : '0:00'}</span>
            </div>
          </> : 
          <>
            <span 
              className='flex flex-col justify-center items-center cursor-pointer' 
              onClick={() => document.querySelector('.input-field').click()}
            >
              <Image className='mb-3' src={uploadImage} alt='' width={160} height={160} />
              <p className='font-medium'>Browse audio files to upload</p>
            </span>
          </>
        }
      </form>
      <section className='w-2/4 my-3 mx-0 py-4 px-5 flex justify-between items-center rounded-md bg-slate-200'>
        <span className='flex items-center'>
          <BsFileEarmarkMusicFill 
            color='#1475cf' className='cursor-pointer'
            onClick={() => document.querySelector('.input-field').click()}
          />
          <div className='w-2'></div>
          <p className='text-sm'>{fileName}</p>
        </span>
        <BsTrashFill
            className='cursor-pointer'
            color='#b22222'
            onClick={() => {
              setFileName("No files chosen");
              setAudio(false);
              setArtwork(null);
              document.querySelector('.input-field').value = null;
            }}
          />
      </section>
    </main>
  );
}

export default Uploader;