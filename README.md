**Itera – AI-Powered Travel Planner**
Itera is an intelligent travel planning web application that leverages Generative AI to automatically create personalized travel itineraries based on user preferences such as destination, duration, budget, and interests.

**Problem Statement**
Planning a trip can be time-consuming and overwhelming. Travelers often need to:
Browse multiple websites for destinations, hotels, and activities
Compare options manually
Organize everything into a structured itinerary
This fragmented process makes travel planning inefficient, especially for first-time travelers.

**Solution**
Itera solves this problem by using Generative AI to:
Analyze user inputs
Generate structured day-by-day itineraries
Provide personalized travel recommendations
The system consolidates all travel-related information into a single, easy-to-understand output.

**Key Features**
AI-generated personalized itineraries
Day-wise travel planning
Budget-aware recommendations
Activity suggestions based on user interests
Location-based recommendations
Fast and automated planning

**AI & Technical Approach**
The project is built using modern AI and deep learning techniques:
Transformer-based Models (LLaMA / Mistral)
Fine-tuning using QLoRA (efficient training)
Synthetic dataset generation for training
Structured JSON output generation
The AI model is trained on instruction-response pairs where:
Input → User travel preferences
Output → Structured itinerary

**Tech Stack**
**AI / Backend**
Python
PyTorch
Hugging Face Transformers
PEFT & bitsandbytes
FastAPI
**AI / Backend******
Next.js (React)
Tailwind CSS
**Data**
JSON-based datasets
Synthetic data generation

**System Architecture**
User Input (Frontend)
        ↓
FastAPI Backend
        ↓
Fine-tuned LLM (LLaMA)
        ↓
Structured JSON Itinerary
        ↓
Rendered UI (Next.js)

**Sample Output**
{
  "trip_metadata": {
    "destination": "India",
    "duration_days": 3,
    "budget_category": "Luxury"
  },
  "itinerary": [
    {
      "day_number": 1,
      "theme": "Delhi's Historical Landmarks",
      "activities": [
        {
          "time": "Morning",
          "activity_name": "Qutub Minar"
        }
      ]
    }
  ]
}

**Objectives**
Simplify travel planning using AI
Generate personalized itineraries
Reduce time spent on trip planning
Provide structured and readable outputs
Build an intuitive user interface

**Results**
The system successfully generates:
Day-by-day itinerary
Recommended attractions
Activity suggestions
Estimated costs
Optimized travel flow
This helps users plan trips efficiently without manual research.

**Future Scope**
Real-time hotel and flight integration
Weather-based recommendations
Google Maps route visualization
Mobile application development
Voice-based travel planning
