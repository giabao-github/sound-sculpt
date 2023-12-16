import { React, useState } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillAudio } from 'react-icons/ai';
import Image from 'next/image';

function Uploader() {
  const [audio, setAudio] = useState(null);
  const [fileName, setFileName] = useState("No selected file");

  return (
    <main>
      <form 
        className='h-96 w-3/4 flex flex-col justify-center items-center border-4 border-dashed border-blue-600 cursor-pointer rounded-md'
        onClick={() => document.querySelector('.input-field').click()}>
        <input 
          type='file' accept='audio/*' className='input-field' hidden 
          onChange={({ target: {files} }) => {
            files[0] && setFileName(files[0].name)
            if (files) {
              setAudio(URL.createObjectURL(files[0]));
            }
          }} />
        {
          audio ?  
          <Image src={audio} className='w-40 h-40' alt={fileName} /> : 
          <>
            <MdCloudUpload color='#1475cf' size={60} />
            <p>Browse files to upload</p>
          </>
        }
      </form>

      <section className='my-3 mx-0 py-4 px-5 flex justify-between items-center rounded-md bg-slate-200'>
        <AiFillAudio color='#1475cf' />
        <span>
          {fileName}
          <MdDelete
            onClick={() => {
              setFileName("No selected file");
              setAudio(null);
            }}
          />
        </span>
      </section>

    </main>
  );
}

export default Uploader;