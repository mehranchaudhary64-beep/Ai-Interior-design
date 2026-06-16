import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Move, Lock, Unlock, Download, Camera } from 'lucide-react';
import { PRESET_ROOMS } from '../types';

interface StagingObject {
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  isLocked: boolean;
}

const OBJECT_LIBRARY = [
  { id: 'obj_1', name: 'Minimalist Floor Lamp', src: 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?q=80&w=200&bg=transparent' },
  { id: 'obj_2', name: 'Lounge Chair', src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=200&bg=transparent' },
  { id: 'obj_3', name: 'Potted Monstera', src: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=200&bg=transparent' },
  { id: 'obj_4', name: 'Abstract Art Canvas', src: 'https://images.unsplash.com/photo-1544833058-e70f66b04ceb?q=80&w=200&bg=transparent' }
];

export default function VirtualStaging() {
  const [bgImage, setBgImage] = useState<string>(PRESET_ROOMS[0].beforeImage);
  const [stagedObjects, setStagedObjects] = useState<StagingObject[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setBgImage(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addObject = (obj: any) => {
    setStagedObjects([
      ...stagedObjects,
      {
        id: `${obj.id}-${Date.now()}`,
        name: obj.name,
        src: obj.src,
        x: 100,
        y: 100,
        scale: 1,
        isLocked: false
      }
    ]);
  };

  const updateObject = (id: string, updates: Partial<StagingObject>) => {
    setStagedObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const removeObject = (id: string) => {
    setStagedObjects(prev => prev.filter(obj => obj.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-4">
        <h1 className="font-display text-4xl text-luxury-charcoal tracking-tight font-medium">Virtual Staging Engine</h1>
        <p className="font-sans text-lg text-luxury-slate font-light leading-relaxed">
          Upload your empty room or use a generated concept. Drag, drop, and scale curated design elements into your space to visualize the final architectural layout.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Workspace Canvas */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">
          <div className="bg-white border border-luxury-stone p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-luxury-cream border border-luxury-stone px-4 py-2 hover:border-luxury-gold transition-all rounded">
                <Camera className="w-4 h-4 text-luxury-charcoal" />
                <span className="text-xs font-mono uppercase tracking-widest text-luxury-charcoal">Base Environment</span>
                <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              </label>
              <button 
                onClick={() => setStagedObjects([])}
                className="text-[10px] font-mono tracking-widest uppercase text-luxury-slate hover:text-luxury-accent transition-colors"
              >
                Clear Canvas
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-luxury-charcoal text-luxury-cream rounded shadow hover:bg-luxury-black transition-all group">
              <Download className="w-4 h-4 text-luxury-gold group-hover:translate-y-px transition-transform" />
              <span className="text-xs font-mono uppercase tracking-widest">Snapshot</span>
            </button>
          </div>

          <div 
            ref={containerRef}
            className="w-full aspect-[4/3] bg-luxury-cream border border-luxury-stone rounded-xl overflow-hidden relative shadow-inner"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {stagedObjects.map(obj => (
              <motion.div
                key={obj.id}
                drag={!obj.isLocked}
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                initial={{ x: 100, y: 100, opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: obj.scale }}
                whileHover={!obj.isLocked ? { filter: 'brightness(1.1)' } : {}}
                whileDrag={{ scale: obj.scale * 1.05, cursor: 'grabbing' }}
                className="absolute origin-center cursor-grab group select-none"
                style={{ zIndex: obj.isLocked ? 10 : 20 }}
              >
                {/* Object Image */}
                <div className={`${obj.isLocked ? '' : 'ring-1 ring-transparent group-hover:ring-dashed group-hover:ring-luxury-gold group-hover:ring-offset-4 ring-offset-transparent'} rounded transition-all duration-200`}>
                  <img src={obj.src} alt={obj.name} className="w-48 h-auto object-contain drop-shadow-2xl pointer-events-none" />
                </div>

                {/* Controls - visible on hover when unlocked */}
                {!obj.isLocked && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white border border-luxury-stone rounded shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => updateObject(obj.id, { isLocked: true })} className="p-1 hover:bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal rounded" title="Lock Position">
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateObject(obj.id, { scale: Math.min(2, obj.scale + 0.1) })} className="px-2 hover:bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal font-mono text-xs rounded" title="Scale Up">+</button>
                    <button onClick={() => updateObject(obj.id, { scale: Math.max(0.3, obj.scale - 0.1) })} className="px-2 hover:bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal font-mono text-xs rounded" title="Scale Down">-</button>
                    <button onClick={() => removeObject(obj.id)} className="p-1 hover:bg-red-50 text-red-400 hover:text-red-500 rounded" title="Remove">
                      <Move className="w-3.5 h-3.5 rotate-45" />
                    </button>
                  </div>
                )}

                {obj.isLocked && (
                  <button onClick={() => updateObject(obj.id, { isLocked: false })} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                    <Unlock className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar - Object Library */}
        <div className="w-full lg:w-1/4 bg-white border border-luxury-stone rounded-xl shadow-sm p-5 flex flex-col">
          <h3 className="font-display text-lg text-luxury-charcoal mb-4">Element Library</h3>
          <p className="text-[10px] font-mono tracking-wide text-luxury-slate uppercase border-b border-luxury-stone pb-3 mb-4">Click to stage item</p>
          
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
            {OBJECT_LIBRARY.map((item) => (
              <button 
                key={item.id}
                onClick={() => addObject(item)}
                className="group border border-luxury-stone hover:border-luxury-gold bg-luxury-cream rounded aspect-square flex flex-col items-center justify-center p-3 transition-colors relative overflow-hidden"
              >
                <img src={item.src} className="w-full h-full object-contain mb-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur text-[9px] font-mono text-center py-1.5 border-t border-luxury-stone/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-6">
            <div className="p-4 bg-luxury-cream border border-luxury-stone rounded text-xs font-sans text-luxury-slate leading-relaxed">
              <strong>Pro Tip:</strong> Hover over a placed item to reveal scaling controls. Lock elements once satisfied to prevent accidental movement.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
