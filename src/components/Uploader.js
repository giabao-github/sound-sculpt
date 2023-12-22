import { React, useRef, useState, useEffect } from 'react';
import { BsFileEarmarkMusicFill, BsTrashFill, BsPlayCircleFill, BsPauseCircleFill, BsRepeat, BsRepeat1 } from "react-icons/bs";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import Image from 'next/image';
import uploadImage from '../../public/images/arts/upload.png';
import generateImage from '../../public/images/arts/generate.png';
import * as mm from 'music-metadata-browser';

function Uploader() {
  let progressMousedown, volumeMousedown = false;
  const audioRef = useRef();
  const [audio, setAudio] = useState(null);
  const [fileName, setFileName] = useState("No files chosen");
  const [artwork, setArtwork] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [continuePlaying, setContinuePlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [displayVolume, setDisplayVolume] = useState(1);
  const [input, setInput] = useState('');

  // Upload files and set artworks
  const handleFileChange = async ({ target: { files } }) => {
    if (files[0]) {
      setFileName(files[0].name);
      const audioUrl = URL.createObjectURL(files[0]);
      setAudio(audioUrl);
      setProgress(0);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }

      setArtwork('/images/arts/default-artwork.png');
      const metadata = await mm.parseBlob(files[0]);
      if (metadata.common.picture && metadata.common.picture[0]) {
        const { data, format } = metadata.common.picture[0];
        const blob = new Blob([data], { type: `image/${format}` });
        setArtwork(URL.createObjectURL(blob));
      }
    }
  };

  // Drop files
  const handleDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    if (audioFiles.length > 0) {
      handleFileChange({ target: { files: audioFiles } });
    }
    setIsPlaying(false);
  };

  // Handle play/pause state
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        if (audioRef.current.currentTime >= audioRef.current.duration) {
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Progress bar
  const handleProgressBarClick = (e) => {
    const progressBar = document.querySelector('.progress-bar-container');
    if (!progressBar) {
      return;
    }
    const clickPositionInProgressBar = e.pageX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPositionInProgressBar / progressBar.offsetWidth) * 100;
    setProgress(newProgress);
    if (audioRef.current && isFinite(audioRef.current.duration) && isFinite(newProgress)) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.onseeked = () => {
        if (audioRef.current.currentTime >= audioRef.current.duration) {
          setIsPlaying(false);
        } else if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      };
    }
  };

  const handleProgressMouseMove = (e) => {
    if (!progressMousedown) {
      return;
    }
    const progressBar = document.querySelector('.progress-bar-container');
    const rect = progressBar.getBoundingClientRect();
    let x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) {
      return;
    }
    x = Math.max(x, 0)
    x = Math.min(x, rect.width);
    const newProgress = (x / rect.width) * 100;
    setProgress(newProgress);
    if (audioRef.current) {
      if (audioRef.current.currentTime < audioRef.current.duration && audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      if (audioRef.current && isFinite(audioRef.current.duration) && isFinite(newProgress)) {
        audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      }
      if (continuePlaying && audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleProgressMouseDown = (e) => {
    e.stopPropagation();
    setContinuePlaying(isPlaying);
    progressMousedown = true;
    window.addEventListener('mousemove', handleProgressMouseMove);
    window.addEventListener('mouseup', handleProgressMouseUp);
    window.addEventListener('mouseleave', handleProgressMouseUp);
  };

  const handleProgressMouseUp = () => {
    progressMousedown = false;
    window.removeEventListener('mousemove', handleProgressMouseMove);
    window.removeEventListener('mouseup', handleProgressMouseUp);
    window.removeEventListener('mouseleave', handleProgressMouseUp);
  };

  // Volume bar
  const handleVolumeMouseMove = (e) => {
    if (!volumeMousedown) {
      return;
    }
    const volumeBar = document.querySelector('.volume-control-container');
    const rect = volumeBar.getBoundingClientRect();
    let x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) {
      return;
    }
    x = Math.max(x, 0)
    x = Math.min(x, rect.width);
    const newVolume = x / rect.width;
    setVolume(newVolume);
    setDisplayVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleVolumeMouseDown = (e) => {
    e.stopPropagation();
    volumeMousedown = true;
    window.addEventListener('mousemove', handleVolumeMouseMove);
    window.addEventListener('mouseup', handleVolumeMouseUp);
    window.addEventListener('mouseleave', handleVolumeMouseUp);
  };

  const handleVolumeMouseUp = () => {
    volumeMousedown = false;
    window.removeEventListener('mousemove', handleVolumeMouseMove);
    window.removeEventListener('mouseup', handleVolumeMouseUp);
    window.removeEventListener('mouseleave', handleVolumeMouseUp);
  };

  const handleVolumeChange = (e) => {
    const volumeBar = document.querySelector('.volume-control-container');
    const rect = volumeBar.getBoundingClientRect();
    let x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) {
      return;
    }
    x = Math.max(x, 0)
    x = Math.min(x, rect.width);
    const newVolume = x / rect.width;
    setVolume(newVolume);
    setDisplayVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        // If currently muted, unmute and restore the volume
        audioRef.current.muted = false;
        audioRef.current.volume = volume;
        setDisplayVolume(volume);
      } else {
        // If not currently muted, mute and set the volume to 0
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
        setDisplayVolume(0);
      }
    }
  };

  // Time
  const formatTime = function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // Input
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // useEffect
  useEffect(() => {
    if (audioRef.current) {
      const handleMetadataLoad = () => {
        setDuration(audioRef.current.duration);
      };
      const handleAudioEnd = () => {
        setIsPlaying(false);
      };
      const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.currentTime >= audioRef.current.duration) {
          setIsPlaying(false);
        }
        else if (audioRef.current && !audioRef.current.paused) {
          setIsPlaying(true);
        }
      };
      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoad);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoad);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [audio]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !isNaN(audioRef.current.duration)) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [audio]);

  useEffect(() => {
    if (audio) {
      document.title = `SoundSculpt | ${fileName.split('.').slice(0, -1).join('.')}`;
    }
    else {
      document.title = 'SoundSculpt | Generate Music';
    }
  }, [audio, fileName]);
  

  return (
    <main className='w-full flex flex-col items-center justify-between'>
      <div className='w-full flex justify-center flex-wrap'>
        <form 
          className={`relative mr-3 h-96 w-2/5 flex flex-col justify-center items-center border-4 ${audio ? 'border-solid' : 'border-dashed'} border-primary dark:border-primaryDark rounded-md mb-1 bg-yellow-100 dark:bg-green-900`}
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
                  title={fileName.split('.').slice(0, -1).join('.')}
                  className='w-60 h-60 rounded-md cursor-pointer' src={artwork} alt='artwork' 
                  onClick={() => document.querySelector('.input-field').click()} 
                /> :
                <img
                  title={fileName.split('.').slice(0, -1).join('.')}
                  className='w-60 h-60 rounded-md cursor-pointer' src='/images/arts/default-artwork.png' alt='artwork'
                  onClick={() => document.querySelector('.input-field').click()}
                />
              }
              <audio ref={audioRef} src={audio} crossOrigin="anonymous" />
              <div className='progress-bar-container mt-8 w-4/5 h-1 bg-gray-300 dark:bg-gray-400 cursor-pointer rounded-md relative' onClick={handleProgressBarClick}>
                <div className='progress-bar h-1 bg-blue-500 dark:bg-blue-400 rounded-md absolute' style={{ width: `${progress}%` }}></div>
                <div 
                  className='h-3 w-3 bg-blue-500 dark:bg-blue-400 rounded-full absolute -top-1 left-0' 
                  style={{ left: `calc(${progress}% - 0.5rem)` }}
                  onMouseDown={handleProgressMouseDown}
                  onDragStart={(e) => e.preventDefault()}
                ></div>
              </div>
              <div className='w-full flex justify-between' draggable='false'>
                {
                  audio &&
                  <div className='w-1/5 absolute left-12 bottom-5 flex items-center'>
                    <button
                      type='button'
                      title={`${isMuted ? 'Turn on sound' : 'Mute'}`}
                      className='text-xl mr-3 hover:text-primary dark:text-white dark:hover:text-primaryDark'
                      onClick={handleMute}
                      onDragStart={(e) => e.preventDefault()}
                    >{isMuted ? <FaVolumeXmark/> : <FaVolumeHigh/>}
                    </button>
                    <div className='volume-control-container w-full h-0.5 bg-gray-300 dark:bg-gray-400 cursor-pointer rounded-md relative' onClick={handleVolumeChange}>
                      <div className='volume-bar h-0.5 bg-blue-500 dark:bg-blue-400 rounded-md absolute' style={{ width: `${displayVolume * 100}%` }}></div>
                      <div 
                        className='h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full absolute -top-[3px] left-0' 
                        style={{ left: `calc(${displayVolume * 100}% - 0.4rem)` }}
                        onMouseDown={handleVolumeMouseDown}
                        onMouseUp={handleVolumeMouseUp}
                        onDragStart={(e) => e.preventDefault()}
                      ></div>
                    </div>
                  </div>
                }
                <span 
                  className='w-9 h-5 ml-[3rem] text-sm mt-1 flex justify-start select-none dark:text-white' 
                  onDragStart={(e) => e.preventDefault()}
                >{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                {
                  audio && 
                  <button
                    type='button'
                    title={`${isPlaying ? 'Pause' : 'Play'}`}
                    className='text-5xl mt-3 hover:text-primary dark:text-white dark:hover:text-primaryDark'
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handlePlayPause(); 
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >{isPlaying ? <BsPauseCircleFill/> : <BsPlayCircleFill/>}
                  </button>
                }
                <span 
                  className='w-9 h-5 mr-[3rem] text-sm mt-1 flex justify-end select-none dark:text-white'
                  onDragStart={(e) => e.preventDefault()}
                >{audioRef.current ? `-${formatTime(duration - audioRef.current.currentTime)}` : '0:00'}</span>
                
                <audio ref={audioRef} src={audio} crossOrigin="anonymous" loop={isLooping} />
                <button 
                  type='button'
                  title={`${isLooping ? 'Loop: Enabled' : 'Loop: Disabled'}`}
                  className={`text-xl mr-3 hover:text-primary dark:hover:text-primaryDark ${isLooping ? 'text-primary dark:text-primaryDark' : 'dark:text-white'} absolute right-9 bottom-5 flex items-center`}
                  onClick={() => setIsLooping(!isLooping)}
                >{isLooping ? <BsRepeat1/> : <BsRepeat/>}
                </button>
              </div>
            </> : 
            <>
              <span 
                title='Click to browse an audio file'
                className='flex flex-col justify-center items-center cursor-pointer dark:text-white' 
                onClick={() => document.querySelector('.input-field').click()}
              >
                <Image className='mb-3 pb-2 dark:filter dark:invert' src={uploadImage} alt='' width={160} height={160} />
                <p className='font-medium'>Browse or drag an audio file to upload</p>
              </span>
            </>
          }
        </form>
        <form
          className='relative h-96 w-2/5 flex flex-col justify-center items-center border-4 border-dashed 
          border-primary dark:border-primaryDark rounded-md mb-1 bg-yellow-100 dark:bg-green-900 ml-2'
        >
          <span 
            title='Generated Music'
            className='flex flex-col justify-center items-center cursor-pointer dark:text-white' 
          >
            <Image className='dark:filter dark:invert' src={generateImage} alt='' width={180} height={180} />
            <p className='font-medium mt-1'>Generated Music</p>
          </span>
        </form>
      </div>
      <div className='w-full flex justify-center flex-wrap my-3'>
        <section className='relative w-2/5 h-2/5 mr-5 py-3 px-4 flex justify-between items-center rounded-md bg-slate-200 dark:bg-slate-700 dark:text-white'>
          <span className='flex items-center'>
            <BsFileEarmarkMusicFill 
              title={`${audio ? 'Change media' : 'Browse an audio file'}`}
              className='cursor-pointer text-[#1475cf] dark:text-[#3399ff]'
              onClick={() => document.querySelector('.input-field').click()}
            />
            <div className='w-2'></div>
            <p className='text-sm'>{fileName}</p>
          </span>
          <BsTrashFill
            title={`${audio ? 'Delete media' : 'No media to delete'}`}
            className='cursor-pointer text-[#b22222] dark:text-[#d32f2f]'
            onClick={() => {
              setFileName("No files chosen");
              setAudio(false);
              setArtwork(null);
              document.querySelector('.input-field').value = null;
            }}
          />
        </section>  
        <div 
          className='relative w-2/5 border-[3px] border-gray-300 rounded-md 
          bg-white dark:bg-[#242424] focus-within:border-primary dark:focus-within:border-primaryDark'>
          <textarea
            title='Describe your music'
            className='w-full pt-2 px-4 rounded-md border-none resize-none outline-none font-medium dark:bg-[#242424] dark:text-white dark:placeholder:text-gray-500'
            placeholder='A light and cheery EDM track, with syncopated drums, airy pads, and strong emotions, at 130 bpm'
            maxLength={1000}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                setInput(e.target.placeholder);
              }
            }}
          />
          <p 
            className='w-full px-4 pb-1 rounded-es-md rounded-ee-md flex justify-end 
            bg-white dark:bg-[#242424] text-sm text-dark/75 dark:text-light/75'
          >{`${input.length}/1000`}</p>
        </div>
      </div>
      <button 
        className='flex items-center bg-dark text-light p-2.5 px-6 mt-3 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark 
        border-2 border-solid border-transparent hover:border-dark dark:bg-light dark:text-dark hover:dark:bg-dark 
      hover:dark:text-light hover:dark:border-light'
      >Generate</button>
    </main>
  );
}

export default Uploader;