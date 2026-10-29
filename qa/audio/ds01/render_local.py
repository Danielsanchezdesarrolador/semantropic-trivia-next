#!/usr/bin/env python3
"""SEMANTROPIC TRIVIA DS-01 — 13 audios de QA reproducibles.

NO PUBLICAR: salidas derivadas de TimGM6mb.sf2 (GPL-2); revisión legal pendiente.
Son maquetas MIDI/FluidSynth, no Foley original, ni audio comercial definitivo.
Ejecutar localmente. Los archivos se escriben FUERA de public/ y src/.
Requisitos Linux: libfluidsynth3, timgm6mb-soundfont, ffmpeg;
Python: numpy, scipy, soundfile. Requiere TimGM6mb.sf2 disponible localmente.
"""
from pathlib import Path
import ctypes as C
import hashlib
import json
import os
import subprocess
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
ROOT = Path(os.environ.get("DS01_OUTPUT", "./.local-ds01-audio")).resolve()
ROOT.mkdir(parents=True, exist_ok=True)
SOUNDFONT = os.environ.get("DS01_SOUNDFONT", "/usr/share/sounds/sf2/TimGM6mb.sf2")
if not Path(SOUNDFONT).is_file():
    raise SystemExit("Falta TimGM6mb.sf2. Configura DS01_SOUNDFONT localmente.")
L = C.CDLL(os.environ.get("DS01_FLUID_LIB", "libfluidsynth.so.3"))
def fn(name, restype, args):
    f = getattr(L, name)
    f.restype, f.argtypes = restype, args
    return f
P, I, S = C.c_void_p, C.c_int, C.c_char_p
newsettings = fn("new_fluid_settings", P, [])
setnum = fn("fluid_settings_setnum", I, [P, S, C.c_double])
setint = fn("fluid_settings_setint", I, [P, S, I])
newsynth = fn("new_fluid_synth", P, [P])
sfload = fn("fluid_synth_sfload", I, [P, S, I])
program = fn("fluid_synth_program_change", I, [P, I, I])
noteon = fn("fluid_synth_noteon", I, [P, I, I, I])
noteoff = fn("fluid_synth_noteoff", I, [P, I, I])
pitch = fn("fluid_synth_pitch_bend", I, [P, I, I])
write = fn("fluid_synth_write_float", I, [P, I, P, I, I, P, I, I])
alloff = fn("fluid_synth_all_sounds_off", I, [P, I])
settings = newsettings()
setnum(settings, b"synth.sample-rate", SR)
setnum(settings, b"synth.gain", .38)
setint(settings, b"synth.reverb.active", 0)
setint(settings, b"synth.chorus.active", 0)
synth = newsynth(settings)
if sfload(synth, SOUNDFONT.encode(), 1) < 0:
    raise SystemExit("No se pudo cargar el soundfont TimGM6mb.")

# Nota: datos y tiempos originales de DS-01 V1 (no son una recomposición).
# Formato: (id, evento, descripcion, segundos, [(canal,programa,[(t,nota,dur,vel)])], bends, color)
ITEMS = [
("POP01_BOTON_A","Botón","A madera cálida",.29,[(0,115,[(.012,73,.07,88)]),(1,108,[(.037,78,.055,40)])],None,"warm"),
("POP01_BOTON_B","Botón","B goma y mini-resorte",.34,[(0,117,[(.012,60,.08,82)]),(1,108,[(.073,69,.065,36)])],[(.05,0,7650),(.12,0,8120)],"soft"),
("POP01_BOTON_C","Botón","C madera doble rebote",.29,[(0,115,[(.015,70,.055,95),(.083,77,.04,36)])],None,"warm"),
("POP02_SELECCION_A","Selección","A tap cálido",.47,[(0,115,[(.018,66,.065,61)]),(1,108,[(.054,72,.12,71)])],None,"warm"),
("POP02_SELECCION_B","Selección","B clic juguete",.47,[(0,117,[(.015,62,.05,75)]),(1,12,[(.086,77,.085,59)])],None,"soft"),
("TIKI01_ACIERTO_A","Acierto","A marimba",.94,[(0,12,[(.015,67,.12,76),(.151,72,.13,87),(.285,76,.20,94)]),(1,115,[(.285,78,.035,34)])],None,"warm"),
("TIKI01_ACIERTO_B","Acierto","B xilófono",.97,[(0,13,[(.012,72,.09,57),(.130,76,.09,75),(.241,79,.16,88)]),(1,108,[(.329,67,.18,50)])],None,"soft"),
("TIKI01_ACIERTO_C","Acierto","C kalimba y marimba",1.00,[(0,108,[(.021,72,.16,77),(.187,76,.14,72)]),(1,12,[(.346,79,.19,82)])],None,"warm"),
("TOOT01_ERROR_A","Error","A fagot",.96,[(0,70,[(.027,62,.24,76),(.314,58,.28,66)]),(1,115,[(.596,63,.065,35)])],None,"dark"),
("TOOT01_ERROR_B","Error","B trombón suave",.91,[(0,57,[(.025,58,.30,64),(.334,55,.22,58)]),(1,117,[(.601,56,.08,42)])],[(.03,0,8500),(.14,0,8130),(.24,0,7830),(.35,0,8270),(.48,0,7900)],"dark"),
("TOOT01_ERROR_C","Error","C plonk madera",.84,[(0,12,[(.015,63,.14,77),(.206,59,.19,61)]),(1,115,[(.384,65,.07,45)])],None,"soft"),
("POP03_TIEMPO_A","Timeout","A dos toques",.91,[(0,115,[(.017,72,.06,55),(.263,72,.06,49)]),(1,117,[(.538,60,.12,57)])],None,"soft"),
("POP03_TIEMPO_B","Timeout","B madera suave",1.08,[(0,108,[(.025,72,.1,66),(.302,72,.08,60)]),(1,115,[(.604,65,.06,64)])],None,"warm")
]

def render(tracks, duration, bends, color):
    events = []
    for ch, pg, notes in tracks:
        events.append((0,"program",ch,pg,0))
        for t, n, d, v in notes:
            events.append((int(t*SR),"on",ch,n,v))
            events.append((int((t+d)*SR),"off",ch,n,0))
    for t,ch,b in bends or []:
        events.append((int(t*SR),"bend",ch,b,0))
    events.sort(key=lambda e:(e[0],{"program":0,"bend":1,"off":2,"on":3}[e[1]]))
    n=int(duration*SR)
    l=np.zeros(n,dtype=np.float32);r=np.zeros(n,dtype=np.float32)
    for ch in range(9):
        alloff(synth,ch)
        pitch(synth,ch,8192)
    last=0
    for pos,kind,ch,num,vel in events+[(n,"end",0,0,0)]:
        if pos>n: continue
        length=pos-last
        if length>0:
            a=np.zeros(length,dtype=np.float32);b=np.zeros(length,dtype=np.float32)
            write(synth,length,a.ctypes.data,0,1,b.ctypes.data,0,1)
            l[last:pos]=a;r[last:pos]=b
        if kind=="program":program(synth,ch,num)
        if kind=="on":noteon(synth,ch,num,vel)
        if kind=="off":noteoff(synth,ch,num)
        if kind=="bend":pitch(synth,ch,num)
        last=pos
    y=np.column_stack([l,r]).astype(np.float64)
    if color in ("warm","soft"):
        y=sosfilt(butter(2,125 if color=="warm" else 100,btype="highpass",fs=SR,output="sos"),y,axis=0)
        if color=="soft":
            y=sosfilt(butter(2,4300,btype="lowpass",fs=SR,output="sos"),y,axis=0)
    elif color=="dark":
        y=sosfilt(butter(2,2700,btype="lowpass",fs=SR,output="sos"),y,axis=0)
    original=y.copy()
    wet=.025 if color=="dark" else .05
    for delay,coef in ((.017,wet),(.041,wet*.52)):
        d=round(SR*delay)
        y[d:]+=original[:-d]*coef
    fade=min(int(.045*SR),len(y)//6)
    start=min(128,len(y))
    y[:start]*=np.linspace(0,1,start)[:,None]
    y[-fade:]*=np.linspace(1,0,fade)[:,None]
    peak=np.max(np.abs(y))
    if peak>1e-6: y=y*.389/peak
    return y.astype("float32")

catalog=[]
for name,event,desc,duration,tracks,bends,color in ITEMS:
    audio=render(tracks,duration,bends,color)
    wav=ROOT/(name+".wav")
    mp3=ROOT/(name+".mp3")
    sf.write(wav,audio,SR,subtype="PCM_24")
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-qscale:a","3",str(mp3)],check=True)
    catalog.append(dict(archivo=name,evento=event,descripcion=desc,segundos=duration,sha256_mp3=hashlib.sha256(mp3.read_bytes()).hexdigest(),licencia_origen="TimGM6mb / GPL-2; SOLO QA LOCAL"))
(ROOT/"CATALOGO_LOCAL.json").write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding="utf8")
print("OK:",len(catalog),"efectos WAV+MP3 en",ROOT)
print("NO agregues esta carpeta a GitHub, public/, dist/ ni Render.")
