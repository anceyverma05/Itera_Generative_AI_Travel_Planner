import json
import random
import time
from groq import Groq
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# 1. Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# 2. Variables for Randomization
continents = {
    "Europe": ["Prague", "Lisbon", "Edinburgh", "Tromso", "Florence", "Krakow", "Seville"],
    "Asia": ["Kyoto", "Hanoi", "Taipei", "Chiang Mai", "Seoul", "Jaipur", "Hokkaido"],
    "Americas": ["Cusco", "Banff", "Medellin", "Austin", "Quebec City", "Patagonia"],
    "Africa/ME": ["Marrakech", "Cape Town", "Petra", "Dubai", "Zanzibar"]
}
budgets = ["Backpacker ($)", "Moderate ($$)", "Luxury ($$$)", "Unlimited"]
durations = [2, 3, 4, 5, 7, 10]
travel_styles = ["Food & Culinary", "History & Architecture", "Adventure & Hiking", "Relaxation", "Hidden Gems"]
prompt_templates = [
    # The Formal Standard
    "Plan a {days}-day trip to {dest} on a {budget} budget. The user's primary interest is {style}.",
    
    # The Conversational User
    "I'm heading to {dest} for {days} days. I have a {budget} budget and really love {style}. What should I do?",
    
    # The Keyword Searcher
    "{dest} itinerary. {days} days. Budget: {budget}. Focus: {style}. Give me the breakdown.",
    
    # The Casual/Messy Typer
    "yo need a plan for {dest} for {days} days. keeping it {budget} and wanna do mostly {style} stuff.",
    
    # The Demanding User
    "Draft a highly detailed {days}-day travel routing for {dest}. Financial constraint is {budget}. Prioritize {style}."
]

# 3. The Strict JSON Schema Definition
schema_definition = """
You must respond ONLY with a valid JSON object matching this exact structure:
{
  "trip_metadata": {
    "destination": "City, Country", "duration_days": int, "budget_category": "string", "total_estimated_cost": int, "currency": "USD"
  },
  "itinerary": [
    {
      "day_number": int, "theme": "string",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening", "activity_name": "string", "description": "string", "cost_estimate": int, "location_keywords": ["string", "string"]
        }
      ]
    }
  ]
}
"""

import os # Add this to your imports at the very top!

def generate_synthetic_trip(prompt):
    print(f"Generating: {prompt}...")
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant", # Using the smaller model for higher daily limits
        messages=[
            {"role": "system", "content": f"You are a travel planning AI. {schema_definition}"},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return {
        "instruction": prompt,
        "response": response.choices[0].message.content
    }

# --- NEW BATCH LOGIC START ---

dataset_file = "data/travel_dataset.jsonl"
existing_prompts = set()

# 1. Load the "Memory" of what we've already done
if os.path.exists(dataset_file):
    with open(dataset_file, "r") as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                existing_prompts.add(data["instruction"])
            except:
                pass
print(f"Found {len(existing_prompts)} existing itineraries. Resuming batch...")

# 2. The Generation Loop
target_new_rows = 500 # How many NEW rows to add today
added_today = 0

while added_today < target_new_rows:
    # Generate random parameters
    region = random.choice(list(continents.keys()))
    dest = random.choice(continents[region])
    budget = random.choice(budgets)
    days = random.choice(durations)
    style = random.choice(travel_styles)
    
    template = random.choice(prompt_templates)
    
    # Fill in the blanks with our variables
    prompt = template.format(days=days, dest=dest, budget=budget, style=style)
    
    # 3. The Duplicate Check
    if prompt in existing_prompts:
        continue # We already have this one! Skip and roll the dice again.
        
    try:
        new_data_point = generate_synthetic_trip(prompt)
        
        # 4. Save immediately using "a" (Append) so we don't lose progress if it crashes
        with open(dataset_file, "a") as f:
            f.write(json.dumps(new_data_point) + "\n")
            
        existing_prompts.add(prompt)
        added_today += 1
        time.sleep(2) # Protect against rate limits
        
    except Exception as e:
        print(f"Failed to generate: {e}")
        time.sleep(10) # Pause if we hit the limit

print(f"\nBatch complete! Added {added_today} new itineraries today.")