from flask import Flask, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from transformers import AutoTokenizer, AutoModel
import os
import soundfile as sf

app = Flask(__name__, static_folder='src/pages')

# Set the maximum file size to 50MB
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

# Load your PyTorch model
tokenizer = AutoTokenizer.from_pretrained("facebook/musicgen")
model = AutoModel.from_pretrained("facebook/musicgen")

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
  
  filename = secure_filename(audio.filename)
  audio.save(filename)
  
  try:
    # Load the audio file
    audio, sampling_rate = sf.read(filename)
    
    # Use the tokenizer to prepare the prompt and audio for the model
    inputs = tokenizer(description, audio=audio, sampling_rate=sampling_rate, return_tensors='pt')
    
    # Generate music using the model
    outputs = model.generate(inputs.input_ids)
    
    # Decode the outputs into a format that can be returned to the user
    generated_music = tokenizer.decode(outputs[0])
    
    # Delete the audio file
    os.remove(filename)
    
    # Return the generated music
    return jsonify({'generated_music': generated_music})
  except Exception as e:
    # Return the error message if there's an error when applying the model
    return {'error': str(e)}, 500

if __name__ == '__main__':
  app.run()