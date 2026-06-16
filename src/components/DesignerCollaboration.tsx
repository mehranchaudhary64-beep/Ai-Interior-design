import React, { useState, useRef } from 'react';
import { Mail, Calendar, UploadCloud, MessageSquare, CheckCircle, ArrowRight, MapPin, Send } from 'lucide-react';
import { PRESET_ROOMS } from '../types';

export default function DesignerCollaboration() {
  const [viewMode, setViewMode] = useState<"consultation" | "feedback">("consultation");
  const [isBooked, setIsBooked] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium">("standard");
  const [formState, setFormState] = useState({ projectBrief: "" });

  // Feedback Loop State
  interface FeedbackMarker {
    id: string;
    x: number;
    y: number;
    comment: string;
    designerReply?: string;
  }
  const [markers, setMarkers] = useState<FeedbackMarker[]>([
    { id: 'm1', x: 45, y: 30, comment: 'Could we adjust the lighting here to be warmer?', designerReply: 'Certainly, we can swap these for 2700K LED spots.' }
  ]);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newMarker: FeedbackMarker = {
      id: `m_${Date.now()}`,
      x,
      y,
      comment: "New note...",
    };
    setMarkers([...markers, newMarker]);
    setActiveMarker(newMarker.id);
    setNewComment("New note...");
  };

  const updateMarkerComment = (id: string, text: string) => {
    setMarkers(prev => prev.map(m => m.id === id ? { ...m, comment: text } : m));
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-luxury-stone font-mono uppercase tracking-widest text-xs justify-center gap-8 pb-4">
        <button 
          onClick={() => setViewMode("consultation")}
          className={`pb-4 -mb-4 transition-colors ${viewMode === "consultation" ? "text-luxury-accent border-b-2 border-luxury-gold" : "text-luxury-slate hover:text-luxury-charcoal"}`}
        >
          Book Consultation
        </button>
        <button 
          onClick={() => setViewMode("feedback")}
          className={`pb-4 -mb-4 transition-colors ${viewMode === "feedback" ? "text-luxury-accent border-b-2 border-luxury-gold" : "text-luxury-slate hover:text-luxury-charcoal"}`}
        >
          Designer Feedback Lab
        </button>
      </div>

      {viewMode === "consultation" && (
        <div className="space-y-12 py-4">
          {isBooked ? (
            <div className="bg-white border border-luxury-stone p-12 shadow-sm rounded-xl animate-fade-in text-center">
              <CheckCircle className="w-12 h-12 text-luxury-accent mx-auto mb-6" />
              <h2 className="font-display text-3xl text-luxury-charcoal mb-4">Request Initiated</h2>
              <p className="font-sans text-luxury-slate max-w-lg mx-auto">
                Our senior architectural design team has received your project brief and AI concept shares. A dedicated liaison will contact you within 24 hours to schedule the introductory video consultation.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="font-display text-4xl text-luxury-charcoal tracking-tight font-medium">Bespoke Designer Consultation</h1>
        <p className="font-sans text-lg text-luxury-slate font-light leading-relaxed">
          Elevate your AI-generated concepts into reality. Pair your preliminary AI blueprints with the expertise of our world-class human spatial architects for final detailing, material sourcing, and structural implementation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white border border-luxury-stone p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center mb-4 border border-luxury-gold">
            <UploadCloud className="w-5 h-5 text-luxury-accent" />
          </div>
          <h3 className="font-display text-lg text-luxury-charcoal mb-2">1. Share Workspace</h3>
          <p className="text-sm font-sans text-luxury-slate">Your favored AI-generated designs and reports are automatically attached for the designer's review.</p>
        </div>
        <div className="bg-white border border-luxury-stone p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center mb-4 border border-luxury-gold">
            <Calendar className="w-5 h-5 text-luxury-accent" />
          </div>
          <h3 className="font-display text-lg text-luxury-charcoal mb-2">2. Video Consultation</h3>
          <p className="text-sm font-sans text-luxury-slate">A 45-minute deep-dive session to refine your aesthetic, review structural viability, and discuss sourcing.</p>
        </div>
        <div className="bg-white border border-luxury-stone p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center mb-4 border border-luxury-gold">
            <MessageSquare className="w-5 h-5 text-luxury-accent" />
          </div>
          <h3 className="font-display text-lg text-luxury-charcoal mb-2">3. Master Blueprint</h3>
          <p className="text-sm font-sans text-luxury-slate">Receive a finalized master document including exact fixture links, trade paint codes, and architectural CADs.</p>
        </div>
      </div>

      <div className="bg-luxury-cream border border-luxury-stone rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Booking Form */}
        <div className="w-full md:w-3/5 p-8 md:p-10 bg-white">
          <h3 className="font-display text-2xl text-luxury-charcoal mb-6">Initiate Project Setup</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-luxury-slate mb-2">Project Brief & Observations</label>
              <textarea 
                rows={4}
                value={formState.projectBrief}
                onChange={e => setFormState({ ...formState, projectBrief: e.target.value })}
                placeholder="What specific elements of your AI generations are you seeking to implement? Are there major structural limitations?"
                className="w-full border border-luxury-stone rounded p-4 text-sm font-sans focus:outline-none focus:border-luxury-gold transition-colors resize-none"
              ></textarea>
            </div>

            <div className="p-4 border border-luxury-stone rounded bg-luxury-cream flex items-start gap-3">
              <input type="checkbox" className="mt-1 flex-shrink-0" id="share-toggle" defaultChecked />
              <label htmlFor="share-toggle" className="text-xs font-sans text-luxury-charcoal leading-relaxed cursor-pointer">
                <strong>Automatically link my Design Lab History.</strong> I authorize the architectural team to review my saved AI generated environments and system reports to prepare for the consultation.
              </label>
            </div>

            <button 
              onClick={() => setIsBooked(true)}
              className="w-full py-4 bg-luxury-charcoal text-luxury-cream font-mono uppercase tracking-widest text-xs hover:bg-luxury-black transition-all rounded shadow flex items-center justify-center gap-2"
            >
              Secure Initial Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pricing Sidebar */}
        <div className="w-full md:w-2/5 bg-[#FAF9F6] p-8 md:p-10 border-l border-luxury-stone flex flex-col">
          <h3 className="font-display text-xl text-luxury-charcoal mb-6">Advisory Tiers</h3>
          
          <div className="space-y-4 flex-grow">
            <button 
              onClick={() => setSelectedTier("standard")}
              className={`w-full text-left p-4 rounded border transition-all ${selectedTier === "standard" ? 'border-luxury-gold bg-white shadow-sm' : 'border-luxury-stone hover:border-luxury-gold/50'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-lg text-luxury-charcoal">Design Vision</span>
                <span className="font-mono text-sm text-luxury-accent">$149</span>
              </div>
              <ul className="text-xs font-sans text-luxury-slate space-y-1 list-disc list-inside">
                <li>45-min Zoom Consultation</li>
                <li>AI generation review</li>
                <li>Palette & material confirmation</li>
              </ul>
            </button>

            <button 
              onClick={() => setSelectedTier("premium")}
              className={`w-full text-left p-4 rounded border transition-all ${selectedTier === "premium" ? 'border-luxury-gold bg-white shadow-sm ring-1 ring-luxury-gold/30' : 'border-luxury-stone hover:border-luxury-gold/50'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-lg text-luxury-charcoal">Master Execution</span>
                <span className="font-mono text-sm text-luxury-accent">$850</span>
              </div>
              <ul className="text-xs font-sans text-luxury-slate space-y-1 list-disc list-inside">
                <li>3x Video Consultations</li>
                <li>Direct sourcing links & vendor lists</li>
                <li>Detailed CAD layout plotting</li>
                <li>1-month direct Email access</li>
              </ul>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-luxury-stone">
            <p className="text-[10px] font-mono text-luxury-slate uppercase tracking-wider text-center">Fees are credited toward full implementation contracts if executed through our studio.</p>
          </div>
        </div>

      </div>
          </>
          )}
        </div>
      )}

      {/* Feedback Lab Tab View */}
      {viewMode === "feedback" && (
        <div className="space-y-8 animate-fade-in py-4 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="font-display text-4xl text-luxury-charcoal tracking-tight font-medium">Concept Review Lab</h1>
            <p className="font-sans text-lg text-luxury-slate font-light leading-relaxed max-w-2xl mx-auto">
              Click anywhere on the room design below to drop a marker pin. Add your comments to highlight specific lighting or material changes you'd like to discuss with the architectural team.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 bg-white border border-luxury-stone p-6 rounded-2xl shadow-sm">
            {/* Image Canvas with Pins */}
            <div className="w-full lg:w-2/3 relative rounded-xl overflow-hidden bg-luxury-sand border border-luxury-stone cursor-crosshair group shadow-inner">
              <img 
                ref={imgRef}
                src={PRESET_ROOMS[0].afterImage} 
                alt="Room Design" 
                className="w-full h-auto object-cover select-none"
                onClick={handleImageClick}
              />
              
              {/* Floating Instructions */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-luxury-charcoal/80 text-luxury-cream text-[10px] font-mono tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none opacity-100 transition-opacity">
                Click surface to flag detail
              </div>

              {markers.map((marker, i) => (
                <div 
                  key={marker.id}
                  className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shadow-lg transition-transform cursor-pointer
                    ${activeMarker === marker.id ? 'bg-luxury-gold text-white scale-125 z-20' : 'bg-white text-luxury-charcoal border border-luxury-stone hover:scale-110 z-10'}
                  `}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  onClick={(e) => { e.stopPropagation(); setActiveMarker(marker.id); }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Sidebar Notes & Thread */}
            <div className="w-full lg:w-1/3 flex flex-col h-full min-h-[400px]">
              <div className="flex items-center gap-2 mb-6 border-b border-luxury-stone pb-4">
                <MapPin className="w-5 h-5 text-luxury-accent" />
                <h3 className="font-display text-xl text-luxury-charcoal">Design Notes</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {markers.length === 0 && (
                  <p className="text-sm font-sans text-luxury-slate italic text-center mt-10">No markers placed yet. Click the image to initiate a note.</p>
                )}
                {markers.map((marker, i) => (
                  <div 
                    key={marker.id} 
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${activeMarker === marker.id ? 'bg-luxury-cream border-luxury-gold ring-1 ring-luxury-gold/50 shadow-sm' : 'bg-white border-luxury-stone hover:border-luxury-gold/50'}`}
                    onClick={() => setActiveMarker(marker.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${activeMarker === marker.id ? 'bg-luxury-gold text-white' : 'bg-luxury-stone text-luxury-charcoal'}`}>
                        {i + 1}
                      </div>
                      <div className="space-y-2 flex-grow">
                        {activeMarker === marker.id ? (
                          <textarea 
                            value={marker.comment}
                            onChange={(e) => updateMarkerComment(marker.id, e.target.value)}
                            placeholder="Type observation here..."
                            className="w-full bg-white border border-luxury-stone text-sm font-sans p-2 rounded focus:outline-none focus:border-luxury-gold min-h-[60px] resize-none"
                          />
                        ) : (
                          <p className="text-sm font-sans text-luxury-charcoal">{marker.comment || "Empty note..."}</p>
                        )}
                        
                        {/* Designer Reply Area */}
                        {marker.designerReply && (
                          <div className="mt-3 bg-white p-3 rounded border border-luxury-stone/50 space-y-1 relative before:content-[''] before:absolute before:-left-3 before:top-4 before:w-2 before:h-[1px] before:bg-luxury-stone">
                            <span className="text-[9px] font-mono tracking-widest uppercase text-luxury-accent font-bold">Roomora Architect</span>
                            <p className="text-[13px] font-sans text-luxury-slate leading-relaxed">{marker.designerReply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
