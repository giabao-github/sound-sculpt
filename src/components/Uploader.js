import { React, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { BsFileEarmarkMusicFill, BsTrashFill, BsPlayCircleFill, BsPauseCircleFill, BsRepeat, BsRepeat1, BsCurrencyBitcoin } from "react-icons/bs";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import Image from 'next/image';
import uploadImage from '../../public/images/arts/upload.png';
import generateImage from '../../public/images/arts/generate.png';
import * as mm from 'music-metadata-browser';

function Uploader() {
  let progressMousedown, volumeMousedown = false;
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [fileName, setFileName] = useState("No files chosen");
  const [artwork, setArtwork] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState({ current: 0, remaining: duration });
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
          setProgress(0);
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

  const updateTime = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const remaining = audioRef.current.duration - current;
      setTime({ current, remaining });
      if (remaining == 0) {
        setIsPlaying(false);
      }
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        setIsPlaying(false);
      }
      else if (!audioRef.current.paused) {
        setIsPlaying(true);
      }
    }
  };

  // Input
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // useEffect
  useEffect(() => {
    if (audioRef.current) {
      updateTime();
      handleTimeUpdate();
      const handleMetadataLoad = () => {
        setDuration(audioRef.current.duration);
      };
      const handleAudioEnd = () => {
        setIsPlaying(false);
      };

      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoad);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleAudioEnd);

      const interval = setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          updateTime();
          handleTimeUpdate();
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      }, 500);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoad);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
          cancelAnimationFrame(animationFrameRef.current);
          clearInterval(interval)
        }
      };
    }
  }, [audio]);

  useEffect(() => {
    if (audio) {
      document.title = `SoundSculpt | ${fileName.split('.').slice(0, -1).join('.')}`;
    }
    else {
      document.title = 'SoundSculpt | Generate Music';
    }
  }, [audio, fileName]);

  useEffect(() => {
    if (audioRef.current) {
      setTime({ current: audioRef.current.currentTime, remaining: audioRef.current.duration - audioRef.current.currentTime })
    }
  }, [])

  return (
    <main className='w-full flex flex-col items-center justify-between'>
      <div className='w-full flex justify-center flex-wrap md:flex-col md:items-center'>
        <form 
          className={`relative mr-3 h-96 w-2/5 md:mr-0 lg:h-80 lg:w-[48%] 0.25lg:w-4/5 0.25lg:mr-0 xs:h-64 xs:w-full xxs:h-52 flex flex-col justify-center items-center border-4 ${audio ? 'border-solid' : 'border-dashed'} border-primary dark:border-primaryDark rounded-md mb-1 bg-yellow-100 dark:bg-green-900 md:self-center`}
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
                  className='w-60 h-60 lg:w-48 lg:h-48 xs:w-36 xs:h-36 xxs:w-32 xxs:h-32 rounded-md cursor-pointer' src={artwork} alt='artwork' 
                  onClick={() => document.querySelector('.input-field').click()} 
                /> :
                <img
                  title={fileName.split('.').slice(0, -1).join('.')}
                  className='w-60 h-60 rounded-md cursor-pointer' src='/images/arts/default-artwork.png' alt='artwork'
                  onClick={() => document.querySelector('.input-field').click()}
                />
              }
              <audio ref={audioRef} src={audio} crossOrigin="anonymous" />
              <div className='progress-bar-container mt-8 lg:mt-6 md:mt-4 w-4/5 h-1 xxs:h-[3px] bg-gray-300 dark:bg-gray-400 cursor-pointer rounded-md relative' onClick={handleProgressBarClick}>
                <div className='progress-bar h-1 xxs:h-[3px] bg-blue-500 dark:bg-blue-400 rounded-md absolute' style={{ width: `${progress}%` }}></div>
                <div 
                  className='h-3 w-3 xxs:h-2 xxs:w-2 bg-blue-500 dark:bg-blue-400 rounded-full absolute -top-1 left-0
                  xxs:-top-[3px] xxs:-left-1' 
                  style={{ left: `calc(${progress}% - 0.5rem)` }}
                  onMouseDown={handleProgressMouseDown}
                  onDragStart={(e) => e.preventDefault()}
                ></div>
              </div>
              <div className='w-full flex justify-between' draggable='false'>
                {
                  audio &&
                  <div className='w-1/5 lg:w-1/4 0.25lg:w-1/5 sm:w-1/4 absolute left-12 lg:left-7 0.25lg:left-10 sm:left-7 xs:left-6 xxs:left-4 bottom-5 md:bottom-4 xxs:bottom-2 flex items-center'>
                    <button
                      type='button'
                      title={`${isMuted ? 'Turn on sound' : 'Mute'}`}
                      className='text-xl sm:!text-base mr-3 lg:mr-2 0.25lg:mr-[12px] hover:text-primary dark:text-white dark:hover:text-primaryDark'
                      onClick={handleMute}
                      onDragStart={(e) => e.preventDefault()}
                    >{isMuted ? <FaVolumeXmark/> : <FaVolumeHigh/>}
                    </button>
                    <div 
                      className='volume-control-container w-full h-0.5 bg-gray-300 dark:bg-gray-400 cursor-pointer rounded-md relative xs:hidden' 
                      onClick={handleVolumeChange}>
                      <div 
                        className='volume-bar h-0.5 bg-blue-500 dark:bg-blue-400 rounded-md absolute' style={{ width: `${displayVolume * 100}%` }}
                      ></div>
                      <div 
                        className='h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full absolute -top-[3px] sm:-top-[4px] xs:-top-[4px] left-0' 
                        style={{ left: `calc(${displayVolume * 100}% - 0.4rem)` }}
                        onMouseDown={handleVolumeMouseDown}
                        onMouseUp={handleVolumeMouseUp}
                        onDragStart={(e) => e.preventDefault()}
                      ></div>
                    </div>
                  </div>
                }
                <span 
                  className='w-9 h-5 ml-12 lg:ml-7 0.25lg:ml-10 sm:ml-7 xs:ml-6 xxs:ml-4 text-sm xs:!text-xs xxs:!text-[0.65rem] mt-1 xxs:mt-[2px] flex justify-start select-none dark:text-white' 
                  onDragStart={(e) => e.preventDefault()}
                >
                { audioRef.current ? formatTime(time.current) : '0:00' }
                </span>
                {
                  audio && 
                  <button
                    type='button'
                    title={`${isPlaying ? 'Pause' : 'Play'}`}
                    className='text-5xl lg:!text-4xl xs:!text-3xl xxs:!text-2xl mt-3 hover:text-primary dark:text-white dark:hover:text-primaryDark'
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handlePlayPause(); 
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >{isPlaying ? <BsPauseCircleFill/> : <BsPlayCircleFill/>}
                  </button>
                }
                <span 
                  className='w-9 h-5 mr-12 lg:mr-7 0.25lg:mr-10 sm:mr-7 xs:mr-6 xxs:mr-4 text-sm xs:!text-xs xxs:!text-[0.65rem] mt-1 xxs:mt-[2px] flex justify-end select-none dark:text-white'
                  onDragStart={(e) => e.preventDefault()}
                >
                { audioRef.current ? `-${formatTime(time.remaining)}` : '0:00' }
                </span>
                
                <audio ref={audioRef} src={audio} crossOrigin="anonymous" loop={isLooping} />
                <button 
                  type='button'
                  title={`${isLooping ? 'Loop: Enabled' : 'Loop: Disabled'}`}
                  className={`text-xl sm:!text-base xxs:!text-sm mr-3 lg:-mr-1 0.25lg:mr-2 sm:-mr-2 xs:-mr-3 xxs:-mr-5 hover:text-primary dark:hover:text-primaryDark ${isLooping ? 'text-primary dark:text-primaryDark' : 'dark:text-white'} absolute right-9 bottom-5 md:bottom-4 xxs:bottom-2 flex items-center`}
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
                <Image className='mb-3 pb-2 dark:filter dark:invert w-32 h-32 md:w-24 md:h-24' src={uploadImage} alt='' />
                <p 
                  className='font-medium 1.25xl:text-[0.95rem] 0.75xl:text-[0.9rem] 0.5xl:text-[0.85rem] 0.25xl:text-[0.8rem] lg:text-[0.75rem] 
                  0.25lg:text-[0.9rem] sm:text-[0.8rem] xs:hidden'
                >Browse or drag an audio file to upload</p>
              </span>
            </>
          }
        </form>
        <form
          className='relative h-96 w-2/5 lg:h-80 lg:w-[48%] 0.25lg:w-4/5 xs:h-64 xs:w-full xxs:h-52 flex flex-col justify-center items-center border-4 
          border-dashed border-primary dark:border-primaryDark rounded-md mb-1 bg-yellow-100 dark:bg-green-900 ml-2 0.25lg:ml-0 0.25lg:mt-2 
          md:self-center'
        >
          <span 
            title='Generated Music'
            className='flex flex-col justify-center items-center cursor-pointer dark:text-white' 
          >
            <Image className='dark:filter dark:invert w-36 h-36 md:w-28 md:h-28' src={generateImage} alt='' />
            <p 
              className='font-medium mt-1 1.25xl:text-[0.95rem] 0.75xl:text-[0.9rem] 0.5xl:text-[0.85rem] 0.25xl:text-[0.8rem] lg:text-[0.75rem] 
              0.25lg:text-[0.9rem] sm:text-[0.8rem] xs:hidden'
            >Generated Music</p>
          </span>
        </form>
      </div>
      <div className='w-full flex justify-center flex-wrap my-3 md:flex-col md:items-center'>
        <section className='relative w-2/5 h-2/5 mr-5 lg:w-[48%] 0.25lg:w-4/5 xs:w-full 0.25lg:mr-0 0.25lg:mb-3 py-3 px-3 xs:py-2 flex justify-between items-center rounded-md bg-slate-200 dark:bg-slate-700 dark:text-white md:self-center'>
          <span className='flex items-center'>
            <BsFileEarmarkMusicFill 
              title={`${audio ? 'Change media' : 'Browse an audio file'}`}
              className='cursor-pointer text-[#1475cf] dark:text-[#3399ff] xl:text-xs'
              onClick={() => document.querySelector('.input-field').click()}
            />
            <div className='w-2 xs:w-1'></div>
            <p title={fileName} className='text-sm xl:text-xs xs:text-[13px] overflow-ellipsis line-clamp-1'>{fileName}</p>
          </span>
          <BsTrashFill
            title={`${audio ? 'Delete media' : 'No media to delete'}`}
            className='cursor-pointer text-[#b22222] dark:text-[#d32f2f] xl:text-xs'
            onClick={() => {
              setFileName("No files chosen");
              setAudio(false);
              setArtwork(null);
              document.querySelector('.input-field').value = null;
            }}
          />
        </section>  
        <div 
          className='relative w-2/5 lg:w-[48%] 0.25lg:w-4/5 xs:w-full border-[3px] border-gray-300 rounded-md bg-white dark:bg-[#242424] focus-within:border-primary dark:focus-within:border-primaryDark'>
          <textarea
            title='Describe your music'
            className='w-full pt-2 px-4 xxs:px-3 rounded-md border-none resize-none outline-none font-medium dark:bg-[#242424] dark:text-white dark:placeholder:text-gray-500 1.5xl:!text-sm xs:!text-xs xxs:!text-[0.65rem]'
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
          <div className='my-1'>
            <button 
              onClick={() => setInput(document.querySelector('textarea').placeholder)}
              className='block absolute left-4 xxs:left-3 bottom-0 mr-[14px] my-2 px-2 py-[1px] rounded-[4px] bg-white dark:bg-[#242424] text-dark/75 border border-solid dark:text-light/75 border-gray-400 dark:border-light/75 text-[0.65rem] xs:!text-[0.55rem] xxs:!text-[0.5rem]'
            >
              Tab
            </button>
            <p 
              className='w-full px-4 xxs:px-3 pb-1 flex justify-end bg-white dark:bg-[#242424] text-sm 1.5xl:text-xs xxs:!text-[0.65rem] text-dark/75 dark:text-light/75'
            >{`${input.length}/1000`}</p>
          </div>
        </div>
      </div>
      <button 
        className='flex items-center bg-dark text-light p-2.5 px-6 mt-3 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark 
        border-2 border-solid border-transparent hover:border-dark dark:bg-light dark:text-dark hover:dark:bg-dark 
      hover:dark:text-light hover:dark:border-light 0.75xl:text-base md:text-sm'
      >Generate</button>
    </main>
  );
}

export default Uploader;