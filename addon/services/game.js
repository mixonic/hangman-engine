import Ember from 'ember';

const WAITING = () => {};
const PLAYING = () => {};
const WON = () => {};
const LOST = () => {};

const bodyParts = [
  'head',
  'body',
  'leftArm',
  'rightArm',
  'leftLeg',
  'rightLeg'
];

export default Ember.Service.extend(Ember.Evented, {

  init() {
    this.set('_state', WAITING);
    this.reset();
  },

  playLetter(rawLetter) {
    var letter = rawLetter.toLowerCase();
    var guessedLetter = this._word.indexOf(letter) !== -1;

    if (guessedLetter) {
      this.set('guessedLetters', this.get('guessedLetters').concat(letter));
    } else {
      this.set('missedLetters', this.get('missedLetters').concat(letter));
    }

    this.updateGame();
  },

  showingBodyParts: Ember.computed('missedLetters', function() {
    var misses = this.get('missedLetters.length');
    var show = {};
    for (var i=0; i<misses; i++) {
      show[bodyParts[i]] = true;
    }
    return show;
  }),

  playWord(word) {
    this.set('_state', PLAYING);
    this.reset();
    this._word = word.toLowerCase();
  },

  reset() {
    this.set('guessedLetters',[]);
    this.set('missedLetters', []);
  },

  updateGame() {
    if (this.get('_state') !== PLAYING) {
      return;
    }

    if (this.isWordMissed()) {
      this.set('_state', LOST);
    } else if (this.isWordGuessed()) {
      this.set('_state', WON);
    }
  },

  isWordMissed() {
    return this.get('missedLetters').length >= bodyParts.length;
  },

  isWordGuessed() {
    var word = this._word;
    var guessed = this.get('guessedLetters');
    for (var i=0; i<word.length; i++) {
      if (guessed.indexOf(word[i]) === -1) {
        return false;
      }
    }
    return true;
  },

  isWaiting: Ember.computed.equal('_state', WAITING),
  isPlaying: Ember.computed.equal('_state', PLAYING),
  isWinning: Ember.computed.equal('_state', WON),
  isLosing: Ember.computed.equal('_state', LOST)

});
