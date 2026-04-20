# import whisper
# model= whisper.load_model("base")
# def speech_to_text(path):
#     result = model.transcribe(path)
#     return result["text"]

# def speech_to_text(audio_path):
#     return "dummy response"

import whisper

model = whisper.load_model("base")

def speech_to_text(file_path: str):
    result = model.transcribe(file_path)
    return result["text"]