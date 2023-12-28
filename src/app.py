from flask import Flask, request, send_from_directory
from pydub import AudioSegment
import torch
import librosa
import soundfile as sf

app = Flask(__name__, static_folder='src/pages')

# Set the maximum file size to 50MB
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

# Load your PyTorch model
model = torch.load(open('models/model.pt', 'rb'))

def convert_audio_to_tensor(audio):
  audio_data, sr = librosa.load(audio, sr=None)
  return torch.from_numpy(audio_data)

def convert_description_to_tensor(description):
  return torch.tensor([0])

def convert_tensor_to_audio(generated_audio_tensor):
  return generated_audio_tensor.numpy()

def save_audio_to_file(generated_audio, filename):
  # Convert the audio data to an AudioSegment
  generated_audio_segment = AudioSegment(
    # raw audio data (bytes)
    data=generated_audio.tobytes(),
    
    # 2 byte (16 bit) samples
    sample_width=2,
    
    # 44100 frames per second
    frame_rate=44100,
    
    # stereo sound
    channels=2
  )
  
  # Check the file extension
  file_extension = filename.rsplit('.', 1)[-1]
  if file_extension.lower() == 'mp3':
    # Export as MP3 (require lame encoder to be installed)
    generated_audio_segment.export(filename, format='mp3')
  else:
    # Export as other formats
    generated_audio_segment.export(filename, format=file_extension)

@app.route('/', defaults = {'path': ''})

@app.route('/<path:path>')
def serve(path):
  if path != "" and os.path.exists(f'{app.static_folder}/{path}'):
    return send_from_directory(app.static_folder, path)
  else:
    return send_from_directory(app.static_folder, 'index.js')

@app.route('/generate', methods = ['POST'])
def generate():
  # Check if audio file is provided
  if 'audio' not in request.files:
    return {'error': 'The audio file has not been uploaded yet!'}, 400

  # Check if description is provided
  if 'description' not in request.form:
    return {'error': 'A description is required'}, 400
  
  audio = request.files['audio']
  description = request.form['description']
  
  # Extract the original filename
  original_filename, file_extension = os.path.splitext(audio.filename)
  
  try:
    # Convert your audio data and description into tensors
    audio_tensor = convert_audio_to_tensor(audio)
    description_tensor = convert_description_to_tensor(description)
    
    # Apply your model to the audio and description tensors
    generated_audio_tensor = model(audio_tensor, description_tensor)
    
    # Convert the generated audio tensor back into an audio file
    generated_audio = convert_tensor_to_audio(generated_audio_tensor)
    
    # Save the generated audio to a file and return its filename
    filename = f'{original_filename} (generated){file_extension}'
    save_audio_to_file(generated_audio, filename)
    
    return {'filename': filename}
  except Exception as e:
    # Return the error message if there's an error when applying the model
    return {'error': str(e)}, 500

if __name__ == '__main__':
  app.run()