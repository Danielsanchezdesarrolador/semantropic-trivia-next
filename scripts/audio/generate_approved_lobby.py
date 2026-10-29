# SEMANTROPIC POP — Caricatura Familiar.
# Generador reproducible de la pista APROBADA para lobby y menús.
# No modificar la composición. Detenerse si el SHA-256 no coincide.
import math, subprocess, hashlib, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
SR=44100
rng=np.random.default_rng()
rng.bit_generator.state={'bit_generator':'PCG64','state':{'state':191980929363213858415224311482899029173,'inc':101337997940671469275679608595685006413},'has_uint32':0,'uinteger':0}
def count(s): return max(1,round(SR*s))

def time(s): return np.arange(count(s))/SR

def smooth(y, a=0.003, tail=0.02):
    y=np.asarray(y,dtype=float).copy()
    ni=min(max(1,count(a)),len(y)//3)
    nf=min(max(1,count(tail)),len(y)//3)
    if ni>0:y[:ni]*=np.linspace(0,1,ni)
    if nf>0:y[-nf:]*=np.linspace(1,0,nf)
    return y

def pitch(f0,f1,t,d,power=1):
    u=np.clip(t/max(d,.001),0,1)**power
    return f0*(f1/f0)**u

def noise(d, low=100,high=8000,dec=.08):
    tt=time(d); x=rng.normal(size=len(tt))
    hi=min(high,SR*.46)
    if low < hi and low>0:
        x=sosfilt(butter(2,[low,hi],fs=SR,btype='band',output='sos'),x)
    return smooth(x*np.exp(-tt/max(dec,.005))*.42,.001,.02)

def synth_curve(f,d,timbre='rubber',dec=.4,attack=.008,release=.055):
    tt=time(d); f=np.asarray(f,dtype=float)
    if f.ndim==0:f=np.full(len(tt),float(f))
    ph=2*np.pi*np.cumsum(f)/SR
    if timbre=='whistle':
        s=np.sin(ph)+.075*np.sin(2*ph); s*=.85
    elif timbre=='rubber':
        s=(np.sin(ph)+.33*np.sin(2*ph)+.18*np.sin(3*ph)+.06*np.sin(5*ph))*.63
        s+=.06*np.sin(2.9*ph)*np.exp(-tt*15)
    elif timbre=='bloop':
        s=(np.sin(ph)+.28*np.sin(2*ph)+.14*np.sin(3*ph))*.75
    elif timbre=='brass':
        s=(.85*np.sin(ph)+.52*np.sin(2*ph)+.31*np.sin(3*ph)+.18*np.sin(4*ph)+.095*np.sin(5*ph))*.47
        s*=1+.065*np.sin(2*np.pi*5.1*tt)
    else:
        s=np.sin(ph)
    env=(1-np.exp(-tt/max(attack,.0007)))*np.exp(-tt/max(dec,.003))
    env*=np.clip((d-tt)/max(release,.003),0,1)
    return s*env

def slide(f0,f1,d,timbre='rubber',dec=None,power=1,vib=0):
    tt=time(d)
    f=pitch(f0,f1,tt,d,power)
    if vib:f*=1+.018*np.sin(2*np.pi*vib*tt)*(tt/d)
    return synth_curve(f,d,timbre,dec=dec or d*.92,release=.045)

def mallet(f,d=.32,kind='marimba'):
    tt=time(d); phase=2*np.pi*f*tt
    if kind=='marimba':
        s=(.85*np.sin(phase)*np.exp(-tt*6)+.3*np.sin(phase*3.95)*np.exp(-tt*24)+.12*np.sin(phase*9.2)*np.exp(-tt*38))
    elif kind=='woodblock':
        s=(.75*np.sin(phase*1.1)*np.exp(-tt*27)+.23*np.sin(phase*2.73)*np.exp(-tt*40))
    else:
        s=(np.sin(phase)+.3*np.sin(2*phase))*np.exp(-tt*10)
    return smooth(.69*s, .002,.035)

def kick(d=.19):
    tt=time(d); fr=54+115*np.exp(-tt*36)
    ph=2*np.pi*np.cumsum(fr)/SR
    y=(.6*np.sin(ph)+.08*rng.normal(size=len(tt)))*np.exp(-tt*20)
    return smooth(y,.001,.02)

def shaker(d=.12): return .65*noise(d,3600,10500,.042)

def clap(d=.20):
    tt=time(d); bursts=np.exp(-tt*45)+.48*np.exp(-np.maximum(0,tt-.024)*55)*(tt>=.024)+.30*np.exp(-np.maximum(0,tt-.05)*60)*(tt>=.05)
    z=rng.normal(size=len(tt));z=sosfilt(butter(2,[700,6000],fs=SR,btype='band',output='sos'),z)
    return smooth(z*bursts*.23,.001,.016)

def bass(freq,d=.4):
    tt=time(d)
    p=2*np.pi*np.cumsum(freq*(1+.06*np.exp(-tt*22)))/SR
    s=(np.sin(p)+.19*np.sin(2*p)+.085*np.sin(3*p))*.62
    env=(1-np.exp(-tt/.006))*np.exp(-tt/(d*.65))*np.minimum(1,(d-tt)/.06)
    return s*env

NOTES={'C2':65.406,'D2':73.416,'E2':82.407,'F2':87.307,'G2':98,'A2':110,'B2':123.47,
       'C3':130.813,'D3':146.832,'E3':164.814,'F3':174.614,'G3':196,'A3':220,'B3':246.94,
       'C4':261.626,'D4':293.665,'E4':329.628,'F4':349.228,'G4':391.995,'A4':440,'B4':493.883,
       'C5':523.251,'D5':587.33,'E5':659.255,'F5':698.456,'G5':783.99,'A5':880,'B5':987.77,'C6':1046.5}

def track(bpm=114, extra=False):
    beat=60/bpm; bars=12; dur=bars*4*beat+1.65
    l=np.zeros(count(dur));r=np.zeros(count(dur))
    def add(when,x,level=.2,pan=0):
        ix=count(when) if when else 0
        n=min(len(x),len(l)-ix)
        if n<=0:return
        left=math.sqrt((1-pan)*.5); right=math.sqrt((1+pan)*.5)
        l[ix:ix+n]+=x[:n]*level*left;r[ix:ix+n]+=x[:n]*level*right
    roots=['C3','A2','F2','G2','C3','A2','F2','G2','F2','G2','C3','C3']
    chords=[['C4','E4','G4'],['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4']]*2+[ ['F3','A3','C4'], ['G3','B3','D4'],['C4','E4','G4'],['C4','E4','G4'] ]
    melody1=[['E5',0,.50],['G5',1,.45],['E5',2,.38],['D5',3,.42],
       ['C5',0,.48],['E5',.75,.42],['A4',2,.45],['C5',3,.44],
       ['A4',0,.48],['C5',1,.45],['D5',2,.38],['C5',3,.40],
       ['B4',0,.50],['D5',1,.35],['G4',2,.48],['B4',3,.42],
       ['G5',0,.37],['E5',.75,.5],['C5',2,.40],['D5',3,.37],
       ['C5',0,.40],['A4',1,.45],['E5',2,.42],['C5',3,.45],
       ['F5',0,.52],['E5',1,.37],['C5',2,.40],['A4',3,.46],
       ['D5',0,.40],['B4',1,.4],['G4',2,.42],['B4',3,.4],
       ['C5',0,.40],['A4',1,.4],['F4',2,.42],['A4',3,.43],
       ['D5',0,.45],['G5',1,.35],['D5',2,.42],['B4',3,.38],
       ['E5',0,.45],['G5',1,.42],['C6',2,.40],['G5',3,.36],
       ['E5',0,.40],['D5',1,.4],['C5',2,.90] ]
    melody2=[['G4',0,.38],['C5',.75,.36],['E5',1.5,.38],['G5',3,.38],
       ['E5',0,.40],['C5',1,.4],['A4',2,.4],['E5',3,.38],
       ['C5',0,.4],['A4',1,.3],['F4',2,.42],['C5',3,.43],
       ['D5',0,.42],['G4',1,.35],['B4',2,.35],['D5',3,.3],
       ['E5',0,.42],['G5',1,.38],['C5',2,.41],['E5',3,.37],
       ['A4',0,.40],['C5',1,.35],['E5',2,.35],['A5',3,.4],
       ['F5',0,.37],['C5',1,.34],['A4',2,.35],['F5',3,.38],
       ['G5',0,.36],['B4',1,.34],['G4',2,.39],['D5',3,.36],
       ['A4',0,.36],['C5',1,.39],['F5',2,.34],['A4',3,.39],
       ['G4',0,.38],['B4',1,.35],['D5',2,.4],['G5',3,.34],
       ['E5',0,.38],['D5',1,.37],['C5',2,.41],['E5',3,.35],
       ['G5',0,.39],['E5',1,.42],['C5',2,.9] ]
    melody=melody2 if extra else melody1
    for bar in range(bars):
        start=bar*4*beat
        for j,c in enumerate(chords[bar]):
            add(start+.04*beat, synth_curve(NOTES[c],3.9*beat,'bloop',dec=3.4*beat,attack=.08,release=.22),.042,pan=(j-1)*.6)
        for b in range(4):
            if b in (0,2):
                add(start+b*beat,bass(NOTES[roots[bar]],.60*beat),.24,pan=-.08)
            else:
                add(start+(b+.48)*beat,bass(NOTES[roots[bar]]*1.5,.40*beat),.105,pan=-.05)
            if b in (0,2): add(start+b*beat,kick(.19),.15,pan=0)
            if b in (1,3): add(start+b*beat,clap(.15),.11,pan=.02)
            add(start+(b+.5)*beat,shaker(.13),.09 if not extra else .115,pan=.35)
            if extra and b in (0,2): add(start+b*beat,mallet(680,.12,'woodblock'),.10,pan=.55)
        if bar in (3,7,11):
            add(start+3.68*beat,slide(430,820,.25,'whistle',dec=.24),.08 if not extra else .15,pan=.18)
    for i,(note,onset,d_beats) in enumerate(melody):
        bar=i//4;when=(bar*4+onset)*beat
        if not extra:
            add(when,melody_note(NOTES[note],d_beats*beat,kind='marimba'),.25,pan=.20 if i%2==0 else -.21)
            if i%5==0:add(when+.13*beat,mallet(NOTES[note]/2,.28,'woodblock'),.055,pan=-.45)
        else:
            add(when,synth_curve(NOTES[note],max(.25,d_beats*beat),'brass',dec=max(.25,d_beats*beat*.7),attack=.026,release=.05),.225,pan=.18 if i%2==0 else -.18)
            if i%3==1:add(when+.06*beat,mallet(NOTES[note],.24,'marimba'),.09,pan=.3)
    l=smooth(l,.03,.95);r=smooth(r,.03,.95)
    y=np.column_stack((l,r))
    peak=max(np.max(np.abs(y)),.001)
    return y*min(1,.79/peak)

def melody_note(f,d,kind='marimba'):
    return mallet(f,max(.15,d),kind)
if __name__ == '__main__':
    target=Path('public/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3')
    target.parent.mkdir(parents=True,exist_ok=True)
    y=track(109,False)
    for c in range(y.shape[1]): y[:,c]=smooth(y[:,c],.005,.055)
    peak=max(np.max(np.abs(y)),.001)
    y=y*min(1.0,.86/peak)
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        wav=Path(d)/'lobby.wav'
        sf.write(wav,y,SR,subtype='PCM_16')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-q:a','3',str(target)],check=True)
    checksum=hashlib.sha256(target.read_bytes()).hexdigest()
    print(f'MP3 bytes: {target.stat().st_size}; SHA-256: {checksum}')
    expected='e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707'
    if checksum!=expected:
        sys.exit('ERROR: Audio not identical to approved original; DO NOT COMMIT')
