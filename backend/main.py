from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from typing import List

app = FastAPI()

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model = torch.jit.load("MobileNet_SmileModel.pt", map_location=torch.device('cpu'))
model.eval()

# Class names
class_names = ["consonant", "not available", "reverse- non consonant", "straight- non consonant"]

# Define transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

@app.get("/")
def read_root():
    return {"message": "Welcome to Smile Classification API"}

@app.get("/classes")
def get_classes() -> List[str]:
    return class_names

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and convert the file to PIL Image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Preprocess image
        input_tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            output = model(input_tensor)
            _, predicted = torch.max(output, 1)
            predicted_class = class_names[predicted.item()]
            
            # Get probabilities
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            confidence = float(probabilities[predicted].item())
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "all_probabilities": {
                class_name: float(prob)
                for class_name, prob in zip(class_names, probabilities.tolist())
            }
        }
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return {"error": str(e)} 