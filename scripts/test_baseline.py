import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import os

# 1. Hugging Face Setup
HF_TOKEN = os.getenv("HF_TOKEN")
hf_token = HF_TOKEN  # Paste your token here
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"

# 2. Configure 4-bit Quantization (The VRAM Saver)
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

print("Downloading and loading the model into VRAM... (This will take a few minutes)")

# 3. Load the Tokenizer and Model
tokenizer = AutoTokenizer.from_pretrained(model_id, token=hf_token)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=quantization_config,
    device_map={"": 0},  # <-- THE FIX: Forces everything onto GPU 0
    token=hf_token
)

# 4. Create the Test Prompt
prompt = "Plan a 3-day trip to Tokyo on a Moderate budget. The user's primary interest is Food. Output strict JSON."

messages = [
    {"role": "system", "content": "You are a helpful travel assistant."},
    {"role": "user", "content": prompt},
]

# Format the prompt for Llama 3
prompt_text = tokenizer.apply_chat_template(
    messages,
    tokenize=False, # Tell it to keep it as text for now
    add_generation_prompt=True
)

# NOW convert it into the dictionary of tensors the model expects
inputs = tokenizer(prompt_text, return_tensors="pt").to(model.device)

print("\nGenerating baseline response...")

# Generate the response (Notice the **inputs to unpack the dictionary)
outputs = model.generate(
    **inputs,
    max_new_tokens=500,
    temperature=0.7,
    do_sample=True,
    pad_token_id=tokenizer.eos_token_id # Prevents a warning message
)

# Print the result (skipping the prompt text)
input_length = inputs['input_ids'].shape[1]
response = tokenizer.decode(outputs[0][input_length:], skip_special_tokens=True)

print("\n--- BASELINE MODEL RESPONSE ---")
print(response)
print("-------------------------------")