"use client";

import React, { useState } from 'react';
import { 
  Bell, UserCircle, Calendar, Users, Gem, ArrowRight, 
  Clock, Footprints, Camera, Compass, Bookmark, User, MapPin, Sparkles
} from 'lucide-react';

export default function IteraPlanner() {
  const [formData, setFormData] = useState({
    destination: "Kyoto, Japan",
    days: 3,
    budget: "Luxury",
    interests: "History & Zen"
  });

  const [itinerary, setItinerary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch("https://traps-unsubtly-elaborate.ngrok-free.dev/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to connect to the backend.");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setItinerary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface font-body text-on-surface overflow-x-hidden selection:bg-primary/30">
      
      {/* MOBILE NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 md:hidden">
        <div className="text-2xl font-bold tracking-tighter text-primary font-headline">Itera</div>
        <div className="flex gap-4">
          <Bell className="w-6 h-6 text-on-surface-variant hover:text-white transition-colors cursor-pointer" />
          <UserCircle className="w-6 h-6 text-on-surface-variant hover:text-white transition-colors cursor-pointer" />
        </div>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col h-screen w-80 fixed left-0 bg-surface-container-low p-6 gap-8 z-40 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-black text-primary font-headline">Itera</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface">Premium Booking</h2>
            <p className="text-on-surface-variant text-sm mb-2">Configure your bespoke experience.</p>
          </div>

          <div className="flex flex-col gap-3">
            
            {/* Destination */}
            <div className="relative">
              <label className="absolute text-[10px] uppercase text-on-surface-variant left-3 top-2 font-label tracking-wider z-10">Destination</label>
              <div className="bg-surface-container-highest rounded-lg relative overflow-hidden">
                <input 
                  required
                  className="w-full bg-transparent border-0 text-on-surface text-sm pt-6 pb-2 px-3 focus:ring-0 focus:outline-none placeholder:text-on-surface-variant/30" 
                  type="text" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary opacity-50 transition-all focus-within:opacity-100"></div>
              </div>
            </div>

            {/* Days */}
            <div className="relative">
              <label className="absolute text-[10px] uppercase text-on-surface-variant left-3 top-2 font-label tracking-wider z-10">Days</label>
              <div className="bg-surface-container-highest rounded-lg relative overflow-hidden flex items-center justify-between px-3">
                <input 
                  required type="number" min={1} max={14}
                  className="w-full bg-transparent border-0 text-on-surface text-sm pt-6 pb-2 focus:ring-0 focus:outline-none" 
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                />
                <Calendar className="w-4 h-4 text-on-surface-variant" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant"></div>
              </div>
            </div>

            {/* Interests */}
            <div className="relative">
              <label className="absolute text-[10px] uppercase text-on-surface-variant left-3 top-2 font-label tracking-wider z-10">Interests</label>
              <div className="bg-surface-container-highest rounded-lg relative overflow-hidden flex items-center justify-between px-3">
                <input 
                  required
                  className="w-full bg-transparent border-0 text-on-surface text-sm pt-6 pb-2 focus:ring-0 focus:outline-none" 
                  type="text" 
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
                <Sparkles className="w-4 h-4 text-on-surface-variant" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant"></div>
              </div>
            </div>

            {/* Budget / Tier */}
            <div className="relative">
              <label className="absolute text-[10px] uppercase text-on-surface-variant left-3 top-2 font-label tracking-wider z-10">Tier</label>
              <div className="bg-surface-container-highest rounded-lg relative overflow-hidden flex items-center justify-between px-3">
                <select 
                  className="w-full bg-transparent border-0 text-on-surface text-sm pt-6 pb-2 focus:ring-0 focus:outline-none appearance-none"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="Moderate" className="bg-surface-container">Moderate</option>
                  <option value="Luxury" className="bg-surface-container">Luxury</option>
                  <option value="Backpacker" className="bg-surface-container">Backpacker</option>
                </select>
                <Gem className="w-4 h-4 text-on-surface-variant pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant"></div>
              </div>
            </div>
          </div>

          {error && <div className="text-xs text-red-400 mt-2 bg-red-400/10 p-2 border border-red-500/20 rounded">{error}</div>}

          <button 
            type="submit" disabled={isLoading}
            className="mt-4 w-full bg-gradient-to-br from-primary-dim to-primary text-on-primary-fixed font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <span className="animate-pulse">Generating...</span> : <span>Confirm Itinerary</span>}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <button type="button" className="w-full bg-transparent border border-outline/30 text-on-surface py-2 rounded-lg text-sm hover:bg-surface-bright transition-colors">
            Save Draft
          </button>
        </form>

        <div className="mt-auto">
          <div className="flex items-center gap-3 bg-surface-container rounded-lg p-3 border-t border-outline/10">
            <div className="w-10 h-10 rounded-full bg-surface-bright overflow-hidden">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://i.pravatar.cc/150?img=47" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface">Premium Member</span>
              <span className="text-[10px] text-primary tracking-wider uppercase">Elite Tier</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-80 flex flex-col pt-16 md:pt-0 pb-24 md:pb-0">
        
        {/* Dynamic Hero Header */}
        <header className="relative w-full h-[350px] md:h-[409px] min-h-[300px] flex items-end p-8 md:p-12 overflow-hidden border-b border-surface-container-low">
          <div className="absolute inset-0 bg-surface">
            <img 
              alt="Destination Cover" 
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
              src={`https://picsum.photos/seed/${itinerary ? itinerary.trip_metadata.destination.replace(/\s/g, '') : formData.destination.replace(/\s/g, '')}/1600/900`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-label uppercase tracking-[0.2em] text-primary">
                {itinerary ? "Confirmed Itinerary" : "Trip Preview"}
              </span>
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight">
                {itinerary ? itinerary.trip_metadata.destination : formData.destination}
              </h1>
            </div>
            
            <div className="flex gap-4 backdrop-blur-md bg-surface-container-highest/60 p-4 rounded-xl border border-outline/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-label">Est. Cost</span>
                <span className="text-xl font-bold text-on-surface font-headline">
                  {itinerary ? `${itinerary.trip_metadata.currency} ${itinerary.trip_metadata.total_estimated_cost}` : "---"}
                </span>
              </div>
              <div className="w-px bg-outline-variant/30 self-stretch"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-label">Pace</span>
                <span className="text-xl font-bold text-on-surface font-headline">
                  {itinerary ? itinerary.trip_metadata.budget_category : formData.budget}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT CANVAS */}
        <section className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 flex flex-col gap-12">
          
          <div className="relative flex flex-col gap-12 pl-6 md:pl-8">
            
            {/* Glowing Timeline Line */}
            {(isLoading || itinerary) && (
              <div className="absolute left-[7px] md:left-[11px] top-4 bottom-0 w-px bg-outline-variant/30">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50 blur-[2px]"></div>
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary to-transparent"></div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !itinerary && (
              <div className="flex flex-col items-center justify-center text-on-surface-variant mt-16 opacity-50">
                <Compass className="w-12 h-12 mb-4" />
                <p className="font-medium text-lg">Your journey awaits.</p>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="relative flex flex-col gap-6 opacity-60">
                <div className="absolute -left-[30px] md:-left-[34px] top-1 flex items-center justify-center w-6 h-6">
                  <div className="w-2 h-2 rounded-full bg-outline-variant z-10 ring-4 ring-surface"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-surface-container rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row bg-surface-container rounded-lg overflow-hidden h-48 sm:h-36 border border-outline/5">
                      <div className="w-full sm:w-48 h-full bg-surface-container-high animate-pulse"></div>
                      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="h-5 w-3/4 bg-surface-container-high rounded animate-pulse"></div>
                          <div className="h-3 w-full bg-surface-container-highest rounded animate-pulse mt-2"></div>
                          <div className="h-3 w-5/6 bg-surface-container-highest rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Populated Data */}
            {!isLoading && itinerary && itinerary.itinerary.map((day: any) => (
              <div key={day.day_number} className="relative flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Glowing Node */}
                <div className="absolute -left-[30px] md:-left-[34px] top-1 flex items-center justify-center w-6 h-6">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(186,158,255,0.5)] z-10 ring-4 ring-surface"></div>
                  <div className="absolute w-6 h-6 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">Day {day.day_number}: {day.theme}</h3>
                  <span className="text-sm text-on-surface-variant">{day.activities.length} Activities</span>
                </div>

                <div className="flex flex-col gap-4">
                  {day.activities.map((activity: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row bg-surface-container rounded-lg overflow-hidden group hover:bg-surface-container-high transition-colors border-t border-outline/10 relative">
                      
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                      
                      <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-surface-container-highest">
                        <img 
                          alt={activity.activity_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          src={`https://picsum.photos/seed/${activity.activity_name.replace(/\s/g, '')}/400/300`}
                        />
                        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"></div>
                      </div>
                      
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-headline font-bold text-on-surface pr-4">{activity.activity_name}</h4>
                            <span className="text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant shrink-0">{activity.time}</span>
                          </div>
                          <p className="text-sm text-on-surface-variant/90 leading-relaxed">{activity.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20">
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                            <Clock className="w-[14px] h-[14px]" />
                            <span>Cost: {activity.cost_estimate === 0 ? 'Free' : `$${activity.cost_estimate}`}</span>
                          </div>
                          {activity.location_keywords && activity.location_keywords[0] && (
                            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                              <MapPin className="w-[14px] h-[14px]" />
                              <span>{activity.location_keywords[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// "use client";

// import React, { useState } from 'react';
// import { 
//   Menu, MapPin, Calendar, Wallet, Sparkles, 
//   Clock, Banknote, Compass, CalendarDays, Bookmark, User 
// } from 'lucide-react';

// export default function VoyagePage() {
//   // --- STATE ---
//   const [formData, setFormData] = useState({
//     destination: "Kyoto, Japan",
//     days: 5,
//     budget: "Moderate",
//     interests: "History & Zen"
//   });

//   const [itinerary, setItinerary] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // --- HANDLER ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setItinerary(null);

//     try {
//       const res = await fetch("https://traps-unsubtly-elaborate.ngrok-free.dev/api/itinerary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to connect to the local AI backend.");
      
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);

//       setItinerary(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-background font-body text-on-surface min-h-screen">
      
//       {/* HEADER */}
//       <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(22,42,90,0.06)] flex justify-between items-center px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button className="text-primary hover:bg-slate-100 transition-colors p-2 rounded-full">
//             <Menu className="w-6 h-6" />
//           </button>
//           <h1 className="text-2xl font-extrabold tracking-tighter text-primary font-headline">Voyage</h1>
//         </div>
//         <div className="hidden md:flex items-center gap-8">
//           <a className="text-on-surface-variant hover:text-primary font-medium transition-colors" href="#">Explore</a>
//           <a className="text-primary font-semibold" href="#">Planner</a>
//           <a className="text-on-surface-variant hover:text-primary font-medium transition-colors" href="#">Saved</a>
//         </div>
//         <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-white">
//           <img className="w-full h-full object-cover" alt="Profile" src="https://i.pravatar.cc/150?img=11"/>
//         </div>
//       </header>

//       <main className="pt-20 pb-32">
        
//         {/* HERO SECTION */}
//         <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden mb-12">
//           <div className="absolute inset-0">
//             {/* We use a deterministic placeholder image based on the destination */}
//             <img 
//               className="w-full h-full object-cover" 
//               alt="Destination Cover" 
//               src={`https://picsum.photos/seed/${itinerary ? itinerary.trip_metadata.destination.replace(/\s/g, '') : formData.destination.replace(/\s/g, '')}/1600/900`}
//             />
//             <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-background"></div>
//           </div>
//           <div className="absolute bottom-8 left-6 right-6 md:left-12 max-w-2xl">
//             <div className="glass-panel p-6 md:p-8 rounded-2xl editorial-shadow">
//               <span className="font-label text-xs uppercase tracking-widest text-primary font-bold mb-2 block">
//                 {itinerary ? "Generated Itinerary" : "Trip Preview"}
//               </span>
//               <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-primary tracking-tight mb-4">
//                 {itinerary ? itinerary.trip_metadata.destination : formData.destination}
//               </h2>
//               <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
//                 <div className="flex items-center gap-2">
//                   <Banknote className="w-5 h-5 text-tertiary-container" />
//                   <span className="font-semibold text-primary">
//                     {itinerary ? `${itinerary.trip_metadata.currency} ${itinerary.trip_metadata.total_estimated_cost}` : "Est. Cost"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Wallet className="w-5 h-5 text-tertiary-container" />
//                   <span className="font-semibold text-primary">
//                     {itinerary ? itinerary.trip_metadata.budget_category : formData.budget}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-tertiary-container" />
//                   <span className="font-semibold text-primary">
//                     {itinerary ? itinerary.trip_metadata.duration_days : formData.days} Days
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
//           {/* SIDEBAR FORM */}
//           <aside className="lg:col-span-4 space-y-8">
//             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl editorial-shadow sticky top-28">
//               <h3 className="font-headline text-xl font-bold text-primary mb-6">Modify Search</h3>
//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-outline uppercase tracking-wider">Destination</label>
//                   <div className="relative flex items-center">
//                     <MapPin className="absolute left-4 w-5 h-5 text-tertiary-container z-10" />
//                     <input 
//                       required
//                       className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-medium text-on-surface" 
//                       type="text" 
//                       value={formData.destination}
//                       onChange={(e) => setFormData({...formData, destination: e.target.value})}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-outline uppercase tracking-wider">Duration (Days)</label>
//                   <div className="relative flex items-center">
//                     <Calendar className="absolute left-4 w-5 h-5 text-tertiary-container z-10" />
//                     <input 
//                       required
//                       min={1} max={14}
//                       className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-medium text-on-surface" 
//                       type="number" 
//                       value={formData.days}
//                       onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-outline uppercase tracking-wider">Budget Level</label>
//                   <div className="relative flex items-center">
//                     <Wallet className="absolute left-4 w-5 h-5 text-tertiary-container z-10" />
//                     <select 
//                       className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-medium text-on-surface appearance-none"
//                       value={formData.budget}
//                       onChange={(e) => setFormData({...formData, budget: e.target.value})}
//                     >
//                       <option value="Backpacker">Backpacker</option>
//                       <option value="Moderate">Moderate</option>
//                       <option value="Luxury">Luxury</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-outline uppercase tracking-wider">Interests</label>
//                   <div className="relative flex items-center">
//                     <Sparkles className="absolute left-4 w-5 h-5 text-tertiary-container z-10" />
//                     <input 
//                       required
//                       className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-medium text-on-surface" 
//                       type="text" 
//                       value={formData.interests}
//                       onChange={(e) => setFormData({...formData, interests: e.target.value})}
//                     />
//                   </div>
//                 </div>

//                 <button 
//                   type="submit" 
//                   disabled={isLoading}
//                   className="w-full py-4 mt-2 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <span className="animate-pulse">Generating AI Plan...</span>
//                   ) : (
//                     "Update Planner"
//                   )}
//                 </button>

//                 {error && (
//                   <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 mt-4">
//                     {error}
//                   </div>
//                 )}
//               </form>
//             </div>
//           </aside>

//           {/* MAIN CONTENT AREA */}
//           <div className="lg:col-span-8">
//             <div className="mb-10">
//               <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">The Narrative</h3>
//               <h2 className="text-3xl font-headline font-extrabold text-primary">Your Curated Journey</h2>
//             </div>

//             {/* CONDITIONAL RENDERING */}
            
//             {/* State 1: Loading */}
//             {isLoading && (
//               <div className="bg-surface-container-low p-8 rounded-2xl space-y-8 animate-pulse">
//                 <div className="flex items-center justify-between">
//                   <div className="h-6 w-32 bg-surface-container-highest rounded-full"></div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="h-32 bg-surface-container-highest rounded-xl"></div>
//                   <div className="h-32 bg-surface-container-highest rounded-xl"></div>
//                   <div className="h-40 col-span-1 md:col-span-2 bg-surface-container-highest rounded-xl"></div>
//                 </div>
//               </div>
//             )}

//             {/* State 2: Empty (Not loaded, not generated) */}
//             {!isLoading && !itinerary && (
//               <div className="h-64 flex flex-col items-center justify-center text-outline bg-surface-container-lowest rounded-2xl editorial-shadow border border-surface-container-high">
//                 <Compass className="w-12 h-12 mb-4 text-tertiary-fixed-dim" />
//                 <p className="font-medium text-lg">Ready to explore?</p>
//                 <p className="text-sm">Click "Update Planner" to generate your AI itinerary.</p>
//               </div>
//             )}

//             {/* State 3: Populated Itinerary */}
//             {!isLoading && itinerary && (
//               <div className="relative pl-8 md:pl-12">
//                 {/* Vertical Timeline Line */}
//                 <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary-fixed-dim/40 md:left-2"></div>
                
//                 {itinerary.itinerary.map((day: any) => (
//                   <div key={day.day_number} className="relative mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
//                     {/* Timeline Dot */}
//                     <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary ring-4 ring-background md:-left-6"></div>
                    
//                     <div className="mb-6">
//                       <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Day {String(day.day_number).padStart(2, '0')}</span>
//                       <h4 className="text-2xl font-headline font-bold text-primary mt-1">{day.theme}</h4>
//                     </div>
                    
//                     {day.activities.map((activity: any, idx: number) => (
//                       <div key={idx} className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow flex flex-col md:flex-row group cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl mb-6 border border-surface-container-high/50">
                        
//                         {/* Dynamic Activity Image */}
//                         <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative bg-surface-container-low">
//                           <img 
//                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                             alt={activity.activity_name} 
//                             src={`https://picsum.photos/seed/${activity.activity_name.replace(/\s/g, '')}/400/300`}
//                           />
//                         </div>

//                         <div className="p-6 md:w-2/3 flex flex-col justify-center">
//                           <div className="flex justify-between items-start mb-3">
//                             <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed/30 px-3 py-1 rounded-full">
//                               {activity.time}
//                             </span>
//                           </div>
                          
//                           <h5 className="text-xl font-headline font-bold text-primary mb-2">
//                             {activity.activity_name}
//                           </h5>
                          
//                           <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
//                             {activity.description}
//                           </p>
                          
//                           <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-primary/80 pt-4 border-t border-surface-container-high">
//                             <span className="flex items-center gap-1.5">
//                               <Banknote className="w-4 h-4" /> 
//                               {activity.cost_estimate === 0 ? 'Free' : `$${activity.cost_estimate}`}
//                             </span>
//                             {activity.location_keywords && activity.location_keywords[0] && (
//                               <span className="flex items-center gap-1.5">
//                                 <MapPin className="w-4 h-4" /> 
//                                 {activity.location_keywords[0]}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* MOBILE BOTTOM NAV */}
//       <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-[2rem] bg-white/80 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(22,42,90,0.06)] flex justify-around items-end pb-6 pt-3 px-6">
//         <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
//           <Compass className="w-6 h-6 mb-1" />
//           <span className="font-body text-[10px] font-bold uppercase tracking-widest">Explore</span>
//         </div>
//         <div className="flex flex-col items-center justify-center bg-primary text-white rounded-2xl p-4 mb-2 shadow-xl transform -translate-y-4">
//           <CalendarDays className="w-6 h-6" />
//         </div>
//         <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
//           <Bookmark className="w-6 h-6 mb-1" />
//           <span className="font-body text-[10px] font-bold uppercase tracking-widest">Saved</span>
//         </div>
//         <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
//           <User className="w-6 h-6 mb-1" />
//           <span className="font-body text-[10px] font-bold uppercase tracking-widest">Profile</span>
//         </div>
//       </nav>
//     </div>
//   );
// }