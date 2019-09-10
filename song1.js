//LOOP:::
let loopBeat;

//Drums:::
let kick, hihat, hithatPan, hihat2, hihat2Pan, snare, snarePan;

// MELODY ::
let bass;
let leadAutoPanner;
let lead;
let polySynthDelay;
let polySynthFilter;
let polySynthPanner;
let polySynth;

//UTILITIES::
let counter;
let rand;
let rand2;
counter = 0;

// Create instances::

// Start
loopBeat = new Tone.Loop(song, "16n");
Tone.Transport.bpm.value = 130;
Tone.Transport.start();
loopBeat.start(0);

//kick:::
kick = new Tone.MembraneSynth({
  pitchDecay: 0.07,
  octaves: 5,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0.002,
    release: 1,
    attackCurve: "exponential"
  }
}).toMaster();

// Bass:::::
bass = new Tone.MembraneSynth({
  pitchDecay: 0.03,
  octaves: 2,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.02,
    decay: 0.5,
    sustain: 0.001,
    release: 0.1,
    attackCurve: "exponential"
  }
}).toMaster();

// Lead and autopanner::::
leadAutoPanner = new Tone.AutoPanner({
  frequency: 0.3,
  type: "sine",
  depth: 1
})
  .toMaster()
  .start();

lead = new Tone.PluckSynth({
  attackNoise: 1,
  dampening: 7000,
  resonance: 0.7
}).connect(leadAutoPanner);

/// Polysynth:::

polySynthFilter = new Tone.AutoFilter({
  frequency: 0.8,
  type: "sine",
  depth: 1,
  baseFrequency: 300,
  octaves: 2.6,
  filter: {
    type: "lowpass ",
    rolloff: -24,
    Q: 3
  }
})
  .toMaster()
  .start();

polySynthPanner = new Tone.PanVol({
  pan: 0.4
}).toMaster();

polySynthDelay = new Tone.PingPongDelay({
  delayTime: "12n",
  maxDelay: 2,
  wet: 0.4,
  feedback: 0.3
}).toMaster();

polySynth = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: "sawtooth"
  }
}).chain(polySynthFilter, polySynthDelay, polySynthPanner, Tone.Master);

// Hihat::::
hithatPan = new Tone.PanVol({
  pan: 0.35
}).toMaster();

hihat = new Tone.MetalSynth({
  frequency: 200,
  envelope: {
    attack: 0.008,
    decay: 0.052,
    release: 0.002
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 3000,
  octaves: 1.5
}).connect(hithatPan);

//Hihat2:::
hihat2Pan = new Tone.PanVol({
  pan: -0.3
}).toMaster();

hihat2 = new Tone.MetalSynth({
  frequency: 400,
  envelope: {
    attack: 0.01,
    decay: 0.01,
    release: 0.005
  },
  harmonicity: 1.1,
  modulationIndex: 24,
  resonance: 4000,
  octaves: 2.5
}).connect(hihat2Pan);

//Snare :::
snarePan = new Tone.PanVol({
  pan: -0.3
}).toMaster();
snare = new Tone.NoiseSynth({
  noise: {
    type: "brown"
  },
  envelope: {
    attack: 0,
    decay: 0.05,
    sustain: 0.008
  }
}).connect(snarePan);

function song(time) {
  //
  let currentBeat = Tone.Transport.position.split(":");
  // Set Seqeunce:::
  // kick
  if (counter % 4 == 0) {
    kick.triggerAttackRelease("c1", "8n", time, 0.8);
  }

  ///bass
  if (counter % 5 == 0) {
    bass.triggerAttackRelease("f2", "3n", time, 0.2);
  }

  if (counter % 4 == 0) {
    bass.envelope.decay = rand * 2.5;
    bass.envelope.sustain = rand * 0.6;
  } else {
    bass.envelope.decay = 0.5;
    bass.envelope.sustain = 0.001;
  }

  if (counter == 7) {
    bass.triggerAttackRelease("c3", "3n", time, 0.2);
  }

  ///Lead
  if (counter % 1 == 0) {
    lead.triggerAttackRelease("d6", "4n", time);
    lead.volume.value = -20;
    rand2 = Math.random();
  }
  if (counter % 3 == 0) {
    lead.triggerAttackRelease("f7", "4n", time);
    lead.volume.value = -10;
    lead.resonance.value = 0.9;
  } else {
    lead.resonance.value = 0.7;
  }

  ///Polysynth
  if (counter == 2) {
    polySynth.triggerAttackRelease(["d4", "f4", "A4"], "4n");
    polySynthDelay.feedback.value = rand2;
    polySynthDelay.wet.value = rand2 * 0.3;
    polySynth.volume.value = -25;
  }
  if (counter == 4) {
    polySynth.triggerAttackRelease(["d4", "c4", "A3"], "4n");
    polySynthDelay.feedback.value = rand2;
    polySynthDelay.wet.value = rand2 * 0.3;
    polySynth.volume.value = -25;
  }
  /////Hh

  if (counter % 4.5 == 0 || counter % 7 == 2) {
    hihat.triggerAttackRelease("8n", time, 0.08);
    hihat.envelope.decay = rand2 * 0.3;
  }

  if (counter == 2 || counter == 6 || counter == 10 || counter == 14) {
    hihat2.triggerAttackRelease("8n", time, 0.3);
  }
  if (counter == 2 || counter == 6 || counter == 10 || counter == 14) {
    rand = Math.random();
  }

  /// Snare
  if (counter == 4 || counter == 12) {
    snare.triggerAttackRelease("8n", time, 0.4);
  }

  console.log(`This is rand: ${rand}`);
  console.log(`This is rand2: ${rand2}`);

  console.log(time);
  console.log(currentBeat);
  // Set counter
  counter = (counter + 1) % 16;
  console.log(`hihat env ${hihat.envelope.decay}`);
  console.log(`delay feedback ${polySynthDelay.feedback.value}`);
}
