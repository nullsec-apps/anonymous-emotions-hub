import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Heart, Users, MessageCircle, Activity, BookHeart, RefreshCw, Send, Lock, Flame, Eye, EyeOff, Home, Compass, Hash, X, ChevronRight, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { EMOTIONS, generateIdentity, AURAS, seedFeelings, seedBonds, seedRooms, resonance, type Identity, type Feeling, type Bond } from '@/lib/data';
import { cn } from '@/lib/utils';

function Orb({ aura, size = 40, breathe = true }: { aura: string[]; size?: number; breathe?: boolean }) {
  return (
    <motion.div
      animate={breathe ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, background: `radial-gradient(circle at 30% 30%, ${aura[0]}, ${aura[1]})`, boxShadow: `0 0 ${size / 2}px ${aura[0]}66` }}
      className="rounded-full shrink-0 relative overflow-hidden"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" style={{ background: `conic-gradient(from 0deg, transparent, ${aura[1]}44, transparent)` }} />
    </motion.div>
  );
}

function Aurora() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0B0A12]">
      <motion.div animate={{ x: [0, 80, 0], y: [0, -50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40" style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
      <motion.div animate={{ x: [0, -60, 0], y: [0, 60, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(circle, #5EEAD4, transparent)' }} />
      <motion.div animate={{ x: [0, 50, 0], y: [0, 40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(circle, #F472B6, transparent)' }} />
    </div>
  );
}

const glass = 'bg-white/[0.03] backdrop-blur-xl border border-white/10';

function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    { icon: Shield, t: 'You are invisible here', d: 'No real names. No tracking. No history. Just a cipher identity that lives only this session.' },
    { icon: Heart, t: 'Feel without boundaries', d: 'Share your raw emotions freely. Empathy replaces likes. Nobody judges, everybody understands.' },
    { icon: Users, t: 'Bond with kindred souls', d: 'Find strangers feeling exactly what you feel. Form private encrypted bonds. Whisper, then let it burn.' },
  ];
  const S = slides[step];
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="max-w-md border-white/10 bg-[#0B0A12]/95 backdrop-blur-2xl text-[#EDE9F5] [&>button]:hidden">
        <div className="flex flex-col items-center text-center py-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'radial-gradient(circle, #A78BFA33, transparent)' }}>
                <S.icon className="w-9 h-9 text-[#A78BFA]" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-serif mb-3" style={{ fontFamily: 'Fraunces, serif' }}>{S.t}</h2>
              <p className="text-[#EDE9F5]/60 leading-relaxed px-2">{S.d}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2 my-8">
            {slides.map((_, i) => <div key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-8 bg-[#A78BFA]' : 'w-1.5 bg-white/20')} />)}
          </div>
          <Button onClick={() => step < 2 ? setStep(step + 1) : onDone()} className="w-full bg-[#A78BFA] hover:bg-[#9170f0] text-[#0B0A12] font-medium">
            {step < 2 ? 'Continue' : 'Forge my identity'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IdentityForge({ identity, onReroll, onConfirm }: { identity: Identity; onReroll: () => void; onConfirm: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Aurora />
      <Card className={cn(glass, 'max-w-md w-full text-[#EDE9F5]')}>
        <CardContent className="flex flex-col items-center text-center py-10">
          <Badge className="mb-6 bg-white/5 text-[#A78BFA] border-[#A78BFA]/30"><Lock className="w-3 h-3 mr-1" />Session-only persona</Badge>
          <AnimatePresence mode="wait">
            <motion.div key={identity.alias} initial={{ scale: 0.5, opacity: 0, filter: 'blur(12px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0)' }} transition={{ type: 'spring', stiffness: 200 }}>
              <Orb aura={identity.aura} size={120} />
            </motion.div>
          </AnimatePresence>
          <motion.h1 key={identity.alias + 't'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-serif mt-6" style={{ fontFamily: 'Fraunces, serif' }}>{identity.alias}</motion.h1>
          <p className="text-[#EDE9F5]/50 mt-2 text-sm">Your aura: <span style={{ color: identity.aura[0] }}>{identity.auraName}</span></p>
          <div className="flex gap-3 mt-8 w-full">
            <Button variant="outline" onClick={onReroll} className="flex-1 border-white/15 bg-white/5 hover:bg-white/10 text-[#EDE9F5]"><RefreshCw className="w-4 h-4 mr-2" />Reroll</Button>
            <Button onClick={onConfirm} className="flex-1 bg-[#A78BFA] hover:bg-[#9170f0] text-[#0B0A12] font-medium">Enter Eutopia</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Composer({ identity, onPost }: { identity: Identity; onPost: (f: Feeling) => void }) {
  const [emotion, setEmotion] = useState(EMOTIONS[0].id);
  const [intensity, setIntensity] = useState(60);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const em = EMOTIONS.find(e => e.id === emotion)!;
  const submit = () => {
    if (!text.trim()) return;
    onPost({ id: crypto.randomUUID(), author: identity.alias, aura: identity.aura, emotion: emotion, intensity, text: text.trim(), time: Date.now(), reactions: { hold: 0, feel: 0, alone: 0 }, open: true });
    setText(''); setOpen(false);
  };
  return (
    <Card className={cn(glass, 'text-[#EDE9F5]')}>
      <CardContent className="p-4">
        {!open ? (
          <button onClick={() => setOpen(true)} className="flex items-center gap-3 w-full text-left group">
            <Orb aura={identity.aura} size={36} breathe={false} />
            <span className="text-[#EDE9F5]/40 group-hover:text-[#EDE9F5]/60 transition-colors">What are you feeling right now?</span>
          </button>
        ) : (
          <div className="space-y-4">
            <textarea autoFocus value={text} onChange={e => setText(e.target.value)} placeholder="Let it out. No one knows it's you..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[#EDE9F5] placeholder:text-[#EDE9F5]/30 resize-none focus:outline-none focus:border-[#A78BFA]/50" />
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button key={e.id} onClick={() => setEmotion(e.id)} className={cn('px-3 py-1.5 rounded-full text-xs transition-all border', emotion === e.id ? 'border-transparent text-[#0B0A12]' : 'border-white/10 text-[#EDE9F5]/60 hover:border-white/30')} style={emotion === e.id ? { background: e.color } : {}}>{e.label}</button>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#EDE9F5]/50 mb-2"><span>Intensity</span><span style={{ color: em.color }}>{intensity}%</span></div>
              <input type="range" min={0} max={100} value={intensity} onChange={e => setIntensity(+e.target.value)} className="w-full accent-[#A78BFA]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} className="text-[#EDE9F5]/60 hover:text-[#EDE9F5] hover:bg-white/5">Cancel</Button>
              <Button onClick={submit} className="bg-[#A78BFA] hover:bg-[#9170f0] text-[#0B0A12] font-medium"><Send className="w-4 h-4 mr-2" />Whisper it</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReactionBtn({ icon: Icon, label, count, onClick }: any) {
  const [pulse, setPulse] = useState(false);
  return (
    <TooltipProvider><Tooltip><TooltipTrigger asChild>
      <button onClick={() => { setPulse(true); onClick(); setTimeout(() => setPulse(false), 400); }} className="relative flex items-center gap-1.5 text-xs text-[#EDE9F5]/50 hover:text-[#A78BFA] transition-colors group">
        <motion.span animate={pulse ? { scale: [1, 1.5, 1] } : {}}><Icon className="w-4 h-4" strokeWidth={1.5} /></motion.span>
        {count > 0 && <span>{count}</span>}
      </button>
    </TooltipTrigger><TooltipContent className="bg-[#0B0A12] border-white/10 text-[#EDE9F5]">{label}</TooltipContent></Tooltip></TooltipProvider>
  );
}

function FeelingCard({ f, onReact, i }: { f: Feeling; onReact: (k: string) => void; i: number }) {
  const em = EMOTIONS.find(e => e.id === f.emotion)!;
  const ago = Math.max(1, Math.round((Date.now() - f.time) / 60000));
  return (
    <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ delay: Math.min(i * 0.04, 0.4) }}>
      <Card className={cn(glass, 'text-[#EDE9F5] hover:border-white/20 transition-colors')} style={{ boxShadow: `inset 0 0 ${f.intensity / 2}px ${em.color}11` }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Orb aura={f.aura} size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ fontFamily: 'Fraunces, serif' }}>{f.author}</p>
              <p className="text-[10px] text-[#EDE9F5]/40">{ago}m ago</p>
            </div>
            <Badge style={{ background: em.color + '22', color: em.color, borderColor: em.color + '44' }} className="border text-[10px]">{em.label} · {f.intensity}%</Badge>
          </div>
          <p className="text-[#EDE9F5]/85 leading-relaxed text-[15px] mb-4">{f.text}</p>
          <div className="flex items-center gap-5">
            <ReactionBtn icon={Heart} label="Holding you" count={f.reactions.hold} onClick={() => onReact('hold')} />
            <ReactionBtn icon={Wind} label="I feel this" count={f.reactions.feel} onClick={() => onReact('feel')} />
            <ReactionBtn icon={Users} label="You're not alone" count={f.reactions.alone} onClick={() => onReact('alone')} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MoodPulse({ feelings }: { feelings: Feeling[] }) {
  const data = useMemo(() => {
    const arr = Array.from({ length: 20 }, (_, i) => ({ v: 30 + Math.sin(i / 2) * 20 + Math.random() * 15 }));
    return arr;
  }, [feelings.length]);
  const dist = useMemo(() => EMOTIONS.map(e => ({ name: e.label, value: feelings.filter(f => f.emotion === e.id).length, fill: e.color })).filter(d => d.value > 0), [feelings]);
  return (
    <Card className={cn(glass, 'text-[#EDE9F5]')}>
      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-[#A78BFA]" />Community Mood Pulse</CardTitle></CardHeader>
      <CardContent>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}><defs><linearGradient id="mp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA" stopOpacity={0.5} /><stop offset="100%" stopColor="#A78BFA" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="v" stroke="#A78BFA" strokeWidth={2} fill="url(#mp)" /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {dist.map(d => <div key={d.name} className="flex items-center gap-1 text-[10px] text-[#EDE9F5]/60"><span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />{d.name} {d.value}</div>)}
        </div>
      </CardContent>
    </Card>
  );
}

function WhisperDrawer({ bond, identity, onClose }: { bond: Bond; identity: Identity; onClose: () => void }) {
  const [msgs, setMsgs] = useState<{ me: boolean; t: string; id: string }[]>([
    { me: false, t: `I saw your feeling about ${bond.emotion}. I'm here.`, id: '1' },
  ]);
  const [input, setInput] = useState('');
  const [burn, setBurn] = useState(true);
  const send = () => {
    if (!input.trim()) return;
    const id = crypto.randomUUID();
    setMsgs(m => [...m, { me: true, t: input.trim(), id }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { me: false, t: ['I hear you.', "That sounds so heavy. You're carrying so much.", "You don't have to hold this alone.", 'Thank you for trusting me with this.'][Math.floor(Math.random() * 4)], id: crypto.randomUUID() }]), 1400);
  };
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-50 bg-[#0B0A12]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Orb aura={bond.aura} size={36} />
        <div className="flex-1"><p className="text-[#EDE9F5] font-medium" style={{ fontFamily: 'Fraunces, serif' }}>{bond.alias}</p><p className="text-[10px] text-[#5EEAD4] flex items-center gap-1"><Lock className="w-2.5 h-2.5" />End-to-end encrypted</p></div>
        <Button size="icon" variant="ghost" onClick={onClose} className="text-[#EDE9F5]/60 hover:bg-white/5"><X className="w-5 h-5" /></Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm', m.me ? 'ml-auto bg-[#A78BFA] text-[#0B0A12] rounded-br-md' : 'bg-white/8 text-[#EDE9F5] rounded-bl-md')}>{m.t}</motion.div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-3 text-xs text-[#EDE9F5]/50"><Flame className="w-3.5 h-3.5 text-[#F472B6]" /><span className="flex-1">Burn after reading</span><Switch checked={burn} onCheckedChange={setBurn} /></div>
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Whisper something..." className="bg-white/5 border-white/10 text-[#EDE9F5] placeholder:text-[#EDE9F5]/30" />
          <Button size="icon" onClick={send} className="bg-[#A78BFA] hover:bg-[#9170f0] text-[#0B0A12] shrink-0"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<'onboard' | 'forge' | 'app'>('onboard');
  const [identity, setIdentity] = useState<Identity>(generateIdentity);
  const [feelings, setFeelings] = useState<Feeling[]>(seedFeelings);
  const [bonds, setBonds] = useState<Bond[]>(seedBonds.slice(0, 1));
  const [matches, setMatches] = useState<Bond[]>(seedBonds.slice(1));
  const [whisper, setWhisper] = useState<Bond | null>(null);
  const [tab, setTab] = useState('all');
  const [encrypted, setEncrypted] = useState(true);
  const [zeroTrace, setZeroTrace] = useState(true);
  const [nav, setNav] = useState('feed');

  const post = useCallback((f: Feeling) => setFeelings(p => [f, ...p]), []);
  const react = useCallback((id: string, k: string) => setFeelings(p => p.map(f => f.id === id ? { ...f, reactions: { ...f.reactions, [k]: (f.reactions as any)[k] + 1 } } : f)), []);
  const formBond = (m: Bond) => { setBonds(b => [...b, m]); setMatches(p => p.filter(x => x.id !== m.id)); setWhisper(m); };

  const filtered = tab === 'all' ? feelings : feelings.filter(f => f.emotion === tab);
  const rooms = seedRooms;

  if (phase === 'onboard') return <><Aurora /><Onboarding onDone={() => setPhase('forge')} /></>;
  if (phase === 'forge') return <IdentityForge identity={identity} onReroll={() => setIdentity(generateIdentity())} onConfirm={() => setPhase('app')} />;

  return (
    <div className="min-h-screen text-[#EDE9F5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Aurora />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0A12]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#A78BFA]" />
            <span className="text-2xl" style={{ fontFamily: 'Fraunces, serif' }}>Eutopia</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/30 hidden sm:flex"><Shield className="w-3 h-3 mr-1" />Invisible</Badge>
            <Orb aura={identity.aura} size={36} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4">
          <Card className={cn(glass)}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Orb aura={identity.aura} size={64} />
              <p className="mt-3 text-sm" style={{ fontFamily: 'Fraunces, serif' }}>{identity.alias}</p>
              <p className="text-[10px] text-[#EDE9F5]/40" style={{ color: identity.aura[0] }}>{identity.auraName} aura</p>
              <Button variant="outline" size="sm" onClick={() => setIdentity(generateIdentity())} className="mt-3 w-full border-white/15 bg-white/5 hover:bg-white/10 text-[#EDE9F5] text-xs"><RefreshCw className="w-3 h-3 mr-1.5" />New persona</Button>
            </CardContent>
          </Card>
          <nav className="flex flex-col gap-1">
            {[{ id: 'feed', l: 'Feeling Feed', i: Home }, { id: 'rooms', l: 'Safe Rooms', i: Compass }, { id: 'bonds', l: 'Bond Matcher', i: Heart }, { id: 'journal', l: 'My Journal', i: BookHeart }].map(n => (
              <button key={n.id} onClick={() => setNav(n.id)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors', nav === n.id ? 'bg-[#A78BFA]/15 text-[#A78BFA]' : 'text-[#EDE9F5]/60 hover:bg-white/5 hover:text-[#EDE9F5]')}>
                <n.i className="w-4 h-4" strokeWidth={1.5} />{n.l}
              </button>
            ))}
          </nav>
          {/* Privacy shield */}
          <Card className={cn(glass)}>
            <CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-2"><motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}><Shield className="w-3.5 h-3.5 text-[#5EEAD4]" /></motion.span>Privacy Shield</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#EDE9F5]/70"><span className="flex items-center gap-1.5"><Lock className="w-3 h-3" />Encrypted</span><Switch checked={encrypted} onCheckedChange={setEncrypted} /></div>
              <div className="flex items-center justify-between text-xs text-[#EDE9F5]/70"><span className="flex items-center gap-1.5">{zeroTrace ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}Zero-trace</span><Switch checked={zeroTrace} onCheckedChange={setZeroTrace} /></div>
              <Separator className="bg-white/10" />
              <p className="text-[10px] text-[#EDE9F5]/40 leading-relaxed">Nothing you do here is stored. When you leave, you vanish completely.</p>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <main className="space-y-4 min-w-0">
          {nav === 'feed' && (<>
            <Composer identity={identity} onPost={post} />
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#A78BFA]/20 data-[state=active]:text-[#A78BFA] text-xs">All</TabsTrigger>
                {EMOTIONS.map(e => <TabsTrigger key={e.id} value={e.id} className="data-[state=active]:bg-[#A78BFA]/20 data-[state=active]:text-[#A78BFA] text-xs">{e.label}</TabsTrigger>)}
              </TabsList>
              <TabsContent value={tab} className="mt-4 space-y-3">
                {filtered.length === 0 ? <p className="text-center text-[#EDE9F5]/40 py-12">No whispers here yet. Be the first to feel.</p> : filtered.map((f, i) => <FeelingCard key={f.id} f={f} i={i} onReact={k => react(f.id, k)} />)}
              </TabsContent>
            </Tabs>
          </>)}

          {nav === 'rooms' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {rooms.map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={cn(glass, 'overflow-hidden hover:border-white/20 transition-colors group cursor-pointer h-full')}>
                    <div className="h-20 relative" style={{ background: `radial-gradient(circle at 70% 30%, ${r.color}55, transparent)` }}>
                      <r.icon className="absolute bottom-3 left-4 w-8 h-8" style={{ color: r.color }} strokeWidth={1.5} />
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium" style={{ fontFamily: 'Fraunces, serif' }}>{r.name}</p>
                      <p className="text-xs text-[#EDE9F5]/50 mt-1 mb-3">{r.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-[#EDE9F5]/60"><motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4]" />{r.occupants} souls inside</span>
                        <ChevronRight className="w-4 h-4 text-[#EDE9F5]/40 group-hover:text-[#A78BFA] transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {nav === 'bonds' && (
            <div className="space-y-3">
              <p className="text-sm text-[#EDE9F5]/50">Souls feeling like you, right now.</p>
              {matches.length === 0 ? <p className="text-center text-[#EDE9F5]/40 py-12">You've bonded with everyone resonating. Come back later.</p> : matches.map((m, i) => {
                const score = resonance(m.emotion, feelings);
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className={cn(glass, 'hover:border-white/20 transition-colors')}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <Orb aura={m.aura} size={48} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" style={{ fontFamily: 'Fraunces, serif' }}>{m.alias}</p>
                          <p className="text-xs text-[#EDE9F5]/50 truncate">Feeling {m.emotion}</p>
                          <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #A78BFA, #5EEAD4)' }} /></div>
                          <p className="text-[10px] text-[#A78BFA] mt-1">{score}% resonance</p>
                        </div>
                        <Button size="sm" onClick={() => formBond(m)} className="bg-[#A78BFA] hover:bg-[#9170f0] text-[#0B0A12] shrink-0"><Heart className="w-3.5 h-3.5 mr-1.5" />Bond</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {nav === 'journal' && (
            <Card className={cn(glass)}>
              <CardHeader><CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Fraunces, serif' }}><BookHeart className="w-5 h-5 text-[#A78BFA]" />My Private Journey</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-[#EDE9F5]/40 mb-4">Only you can see this. Your emotional intensity over the last 14 days.</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 14 }, (_, i) => ({ d: i, v: 30 + Math.sin(i / 1.5) * 25 + Math.random() * 20 }))}>
                      <defs><linearGradient id="jr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F472B6" stopOpacity={0.5} /><stop offset="100%" stopColor="#F472B6" stopOpacity={0} /></linearGradient></defs>
                      <Area type="monotone" dataKey="v" stroke="#F472B6" strokeWidth={2} fill="url(#jr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[{ l: 'Whispers shared', v: feelings.filter(f => f.author === identity.alias).length }, { l: 'Bonds formed', v: bonds.length }, { l: 'Empathy received', v: feelings.reduce((a, f) => a + f.reactions.hold + f.reactions.feel + f.reactions.alone, 0) }].map(s => (
                    <div key={s.l} className="bg-white/5 rounded-xl p-3 text-center"><p className="text-2xl" style={{ fontFamily: 'Fraunces, serif', color: '#A78BFA' }}>{s.v}</p><p className="text-[10px] text-[#EDE9F5]/50">{s.l}</p></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Right rail */}
        <aside className="hidden lg:flex flex-col gap-4">
          <MoodPulse feelings={feelings} />
          <Card className={cn(glass)}>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-[#A78BFA]" />Active Bonds</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {bonds.length === 0 ? <p className="text-xs text-[#EDE9F5]/40">No bonds yet. Find resonating souls.</p> : bonds.map(b => (
                <button key={b.id} onClick={() => setWhisper(b)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left">
                  <Orb aura={b.aura} size={32} />
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate" style={{ fontFamily: 'Fraunces, serif' }}>{b.alias}</p><p className="text-[10px] text-[#EDE9F5]/40 truncate">last felt {b.emotion}</p></div>
                  <MessageCircle className="w-4 h-4 text-[#EDE9F5]/40" />
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B0A12]/80 backdrop-blur-xl border-t border-white/10 flex">
        {[{ id: 'feed', i: Home }, { id: 'rooms', i: Compass }, { id: 'bonds', i: Heart }, { id: 'journal', i: BookHeart }].map(n => (
          <button key={n.id} onClick={() => setNav(n.id)} className={cn('flex-1 py-3 flex justify-center', nav === n.id ? 'text-[#A78BFA]' : 'text-[#EDE9F5]/40')}><n.i className="w-5 h-5" strokeWidth={1.5} /></button>
        ))}
      </div>

      <AnimatePresence>{whisper && <WhisperDrawer bond={whisper} identity={identity} onClose={() => setWhisper(null)} />}</AnimatePresence>
    </div>
  );
}
