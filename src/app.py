from flask import Flask, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
from datetime import datetime
import torchaudio
import os
import soundfile as sf

app = Flask(__name__, static_folder='src/pages')

# Set the maximum file size to 50MB
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

# Load your PyTorch model
model = MusicGen.get_pretrained('facebook/musicgen-melody')
model.set_generation_params(duration=30)

# Define a secure path for storing temporary files
temp_dir = 'temp'

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
    return jsonify({'error': 'The audio file has not been uploaded yet!'}), 400

  # Check if description is provided
  if 'description' not in request.form:
    return jsonify({'error': 'A description is required'}), 400

  audio = request.files['audio']
  description = request.form['description']

  # Get the file extension of the uploaded file
  file_extension = os.path.splitext(audio.filename)[1]

  # Generate a unique filename using a timestamp and save in the temporary directory
  filename = secure_filename(f'{datetime.now().strftime("%Y%m%d%H%M%S")}{file_extension}')
  temp_filepath = os.path.join(temp_dir, filename)
  audio.save(temp_filepath)

  try:
    # Validate the audio file
    audio_data, audio_sample_rate = sf.read(temp_filepath)
    if audio_data.ndim != 1:
      raise ValueError("Uploaded audio must be mono (single-channel).")

    # Load the audio file
    melody, sample_rate = torchaudio.load(temp_filepath)

    # Generate music using the model
    output = model.generate_with_chroma(description, melody[None].expand(3, -1, -1), sample_rate)

    generated_music = []
    for idx, one_audio in enumerate(output):
      # Save the generated music under {idx}{file_extension}, with loudness normalization at -14 db LUFS.
      generated_filename = f'{idx}{file_extension}'
      generated_filepath = os.path.join(temp_dir, generated_filename)
      audio_write(generated_filepath, one_audio.cpu(), model.sample_rate, strategy="loudness")
      generated_music.append(generated_filename)

    try:
      # Delete the audio file
      os.remove(temp_filepath)
    except Exception as e:
      # Log the error without returning it to the user
      print(f"Error deleting temporary audio file: {str(e)}")

    # Return the generated music
    return jsonify({'generated_music': generated_music})
  except Exception as e:
    # Delete the temporary audio file if an error occurs
    os.remove(temp_filepath)
    return jsonify({'error': 'An error occurred during music generation.', 'details': str(e)}), 500

if __name__ == '__main__':
  # Ensure the temporary directory exists
  os.makedirs(temp_dir, exist_ok=True)
  app.run()