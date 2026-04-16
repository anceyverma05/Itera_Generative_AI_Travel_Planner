from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch
import json

app = FastAPI(title="Itera AI Backend")

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODEL LOADING ---
print("Loading base model and custom adapters into RTX 4060 VRAM...")

# 1. Load the text formatting rules from your custom repo
tokenizer = AutoTokenizer.from_pretrained("RaghavVerma01/itera-output-model")

# 2. Load the 4-bit Unsloth base model (Works perfectly in standard transformers)
base_model = AutoModelForCausalLM.from_pretrained(
    "unsloth/llama-3-8b-Instruct-bnb-4bit",
    device_map="auto",
    torch_dtype=torch.float16,
)

# 3. The Magic: Snap your custom Kaggle-trained weights directly onto the base brain!
model = PeftModel.from_pretrained(base_model, "RaghavVerma01/itera-output-model",autocast_adapter_dtype=False)

print("Model loaded and ready for API requests!")

# --- DATA SCHEMAS ---
class TravelRequest(BaseModel):
    destination: str
    budget: str
    days: int
    interests: str

inference_template = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful travel assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>
{}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

# --- API ENDPOINT ---
@app.post("/api/itinerary")
async def generate_itinerary(req: TravelRequest):
    user_prompt = f"Plan a {req.days}-day trip to {req.destination} on a {req.budget} budget. The user's primary interest is {req.interests}."
    formatted_prompt = inference_template.format(user_prompt)
    
    inputs = tokenizer([formatted_prompt], return_tensors="pt").to("cuda")
    input_length = inputs['input_ids'].shape[1]
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=1500, 
        use_cache=True,
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id
    )
    
    response_text = tokenizer.decode(outputs[0][input_length:], skip_special_tokens=True)
    
    try:
        json_data = json.loads(response_text)
        return json_data
    except json.JSONDecodeError:
        return {"error": "Invalid JSON generated", "raw_text": response_text}