// import {stage, dom} from 'mnf'
const H_CANVAS = 200;
const MARGIN = 5;
const H_INFO_BAR = 12;
const H_BEAT_BAR = 20;
const W_BAR = 50;
const H_BAR = H_CANVAS - MARGIN * 2;
const SPACE_BAR = 1;

class Audio {

	constructor() {
		if (window.AudioContext) {
			this.context = new AudioContext();
		} else if (window.webkitAudioContext) {
			this.context = new webkitAudioContext();
		}
		this.masterGain = this.context.createGain();

		this.fftSize = 1024;

		this.lastTime = Date.now();

		this.audioRange = 8;
		this.audioAmp = 5;
		this.audioIndex = .3;
		this.audioIndexStep = .06;
		this.isContrained = false;
		this.values = [];
		this.showPreview = true;
		this.easingAudioRangeValue = .48;
		for (let i = 0, n = this.audioRange; i < n; i++) {
			this.values[i] = 0;
		}

		this.hasAudioTexture = false;

		this.onBeat = null;
		this.waveData = [];
		this.levelsData = [];
		this.volumeHistory = [];

		this.BEAT_HOLD_TIME = 60;
		this.BEAT_DECAY_RATE = 0.98;
		this.BEAT_MIN = 2;

		this.globalVolume = 1;
		this.volume = 0;
		this.bpmTime = 0;
		this.msecsAvg = 633;
		this.globalVolume = 1;
		this.currentPlay = -1;
		this.fist = '';

		this.levelsCount = 16;
		this.beatCutOff = 0;
		this.beatTime = 0;

	}

	start({ onLoad = null, onBeat = null, live = true, analyze = true, debug = false, playlist = ["audio/galvanize.mp3"], shutup = false, src = null } = {}) {

		this.debug = debug;
		this.playlist = playlist;
		this.live = live;
		this.onBeat = onBeat;
		this._src = src;

		if (!live) {
			if (!shutup) {
				this.masterGain.connect(this.context.destination);
			}
			document.body.addEventListener('click', this.playNext, false);
			setTimeout(this.playNext, 100);
			if (onLoad) {
				onLoad();
			}
		}

		else {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			navigator.getUserMedia({ audio: true, video: false },
				(stream) => {
					let mediaStream = this.context.createMediaStreamSource(stream);
					let tracks = stream.getAudioTracks();
					mediaStream.connect(this.masterGain);
					if (onLoad) {
						onLoad();
					}
				},
				(e) => console.log('fail load stream\n', e)
			);
		}

		if (analyze) {
			this.analyze();
		}
	}

	playNext = () => {
		document.body.removeEventListener('click', this.playNext, false);
		this.currentPlay++;
		if (this.currentPlay >= this.playlist.length) {
			this.currentPlay = 0;
		}

		this.audio = document.createElement('audio');
		this.audio.src = this._src;
		this.audio.loop = false;
		this.audio.play();
		this.audio.addEventListener('ended', this.playNext);

		if (this.audioSource) {
			this.audioSource.disconnect(this.masterGain);
		}
		this.audioSource = this.context.createMediaElementSource(this.audio);
		this.audioSource.connect(this.masterGain);

	};

	analyze() {
		console.log('analyze');
		this.analyser = this.context.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.3;
		this.analyser.fftSize = this.fftSize;
		this.binCount = this.analyser.frequencyBinCount;
		this.levelBins = Math.floor(this.binCount / this.levelsCount);
		this.freqByteData = new Uint8Array(this.binCount);
		this.timeByteData = new Uint8Array(this.binCount);
		this.masterGain.connect(this.analyser);

		if (this.showPreview) {
			this.canvas = document.createElement("canvas");
			this.canvas.width = this.audioRange * W_BAR + (this.audioRange - 1) * SPACE_BAR + MARGIN * 2;
			this.canvas.height = H_CANVAS + MARGIN * 2 + H_BEAT_BAR + H_INFO_BAR;
			this.ctx = this.canvas.getContext("2d");
			this.canvas.style.position = "absolute";
			this.canvas.style.zIndex = 9999;
			this.canvas.style.top = 0;
			this.canvas.style.left = 0;
			document.body.append(this.canvas);
		}


		for (let i = 0; i < 256; i++) {
			this.volumeHistory.push(0);
		}
		// stage.onUpdate.add(this.update)
	}

	update = () => {
		let t = Date.now();
		let dt = t - this.lastTime;

		this.analyser.getByteFrequencyData(this.freqByteData);
		this.analyser.getByteTimeDomainData(this.timeByteData);

		if (this.showPreview) {
			this.ctx.fillStyle = "#444444";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
		}

		let audioIndexAmp = this.audioIndex;

		let x = MARGIN;
		for (let i = 0; i < this.audioRange; i++) {
			let value = this.getAverage(i);
			value = (value * this.audioAmp) * audioIndexAmp;
			if (this.isContrained) {
				value = Math.min(value, 256);
			}
			value /= 255;
			value *= this.globalVolume;

			let h = H_BAR * value;
			this.values[i] += (value - this.values[i]) * this.easingAudioRangeValue;

			if (this.showPreview) {
				if (i == 2) {
					this.ctx.fillStyle = "#00ff00";
				} else {
					this.ctx.fillStyle = "#cccccc";
				}

				this.ctx.fillRect(x, H_CANVAS - MARGIN * 2, W_BAR, -h);
				x += W_BAR + SPACE_BAR;
			}
			audioIndexAmp += this.audioIndexStep;
		}
		if (this.audioRangeTexture) {
			this.audioRangeTexture.update(this.values, true);
		}

		for (let i = 0; i < this.binCount; i++) {
			this.waveData[i] = ((this.timeByteData[i] - 128) / 128);
		}

		this.volume = 0;
		for (let i = 0; i < this.levelsCount; i++) {
			let sum = 0;
			for (let j = 0; j < this.levelBins; j++) {
				sum += this.freqByteData[(i * this.levelBins) + j];
				this.levelsData[i] = sum / this.levelBins / 256;
			}
			this.volume += sum / this.levelBins / 256;
		}
		this.volume *= this.globalVolume;
		if (this.debug) {
			console.log('volume:', this.volume);
		}

		if (this.showPreview) {
			this.ctx.beginPath();
			this.ctx.rect(0, this.canvas.height - MARGIN - H_BEAT_BAR, x, H_BEAT_BAR);
			this.ctx.fillStyle = 'red';
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.rect(0, this.canvas.height - MARGIN - H_BEAT_BAR, x * (this.beatCutOff / this.lastBeat) * .8, H_BEAT_BAR);
			this.ctx.fillStyle = 'orange';
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.rect(0, this.canvas.height - MARGIN - H_BEAT_BAR, x * (this.volume / this.lastBeat) * .8, H_BEAT_BAR);
			this.ctx.fillStyle = 'yellow';
			this.ctx.fill();
			this.ctx.beginPath();
			if (!this.live) {

			}
			this.ctx.beginPath();
			// this.ctx.rect(0, 6, 256*(this.audio.currentTime/this.audio.duration), 6)
			this.ctx.rect(0, H_CANVAS, x, H_INFO_BAR);
			this.ctx.fillStyle = 'rgba(255,255,255,.9)';
			this.ctx.fill();
			this.ctx.fillStyle = 'rgba(0,0,0,1)';
			this.ctx.fillText("Volume:" + parseFloat(this.volume).toFixed(2), 6, H_CANVAS + MARGIN * 2);
			let t = parseInt(this.currentTime);
			if (t < 100) { t = "0" + t; }
			if (t < 10) { t = "0" + t; }
			this.ctx.fillText(t + "s", x - 32, H_CANVAS + MARGIN * 2);

		}
		this.detectBeat(dt);
	};

	getAverage(idx) {
		const step = this.binCount / this.audioRange >> 0;

		let value = 0;

		const start = idx * step;
		const end = start + step;
		for (let i = start; i < end; i++) {
			value += this.freqByteData[i];
		}

		return value / step;
	}

	detectBeat = (dt) => {
		this.volumeHistory.shift(1);
		this.volumeHistory.push(this.volume);

		if (this.beatTime >= this.BEAT_HOLD_TIME && this.volume > this.beatCutOff && this.volume > this.BEAT_MIN) {
			if (this.debug) {
				console.log('Beat detected');
			}
			// this.onBeat.dispatch()
			if (this.onBeat) {
				this.onBeat();
			}
			this.beatCutOff = this.volume * 1.1;
			this.lastBeat = this.beatCutOff;
			this.beatTime = 0;
		}
		else {
			if (this.beatTime <= this.BEAT_HOLD_TIME) {
				this.beatTime += dt;
			}
			else {
				this.beatCutOff *= this.BEAT_DECAY_RATE;
				this.beatCutOff = Math.max(this.beatCutOff, this.BEAT_MIN);
			}
		}
	};

	addAudioRangeTexture(audioRangeTexture) {
		this.audioRangeTexture = audioRangeTexture;
	}

	connectToMidi() {
		// if(midi.xl){
		// 	midi.xl.add(this,'globalVolume',13,false).minMax(0,2)
		// 	midi.xl.add(this,'BEAT_DECAY_RATE',15,false).minMax(0.95,0.9999)
		// 	midi.xl.add(this,'BEAT_HOLD_TIME',14,false).minMax(0,1000)
		// }
	}
}

export default Audio;