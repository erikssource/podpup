import utils from '../src/renderer/common/utils';

test('#mimeToExt() audio/flac to .flac', () => {
   expect(utils.mimeToExt('audio/flac')).toBe('.flac');
});

test('#mimeToExt() audio/mp4 to .m4a', () => {
   expect(utils.mimeToExt('audio/mp4')).toBe('.m4a');
});

test('#mimeToExt() audio/mpeg to .mp3', () => {
   expect(utils.mimeToExt('audio/mpeg')).toBe('.mp3');
});

test('#mimeToExt() audio/ogg to .ogg', () => {
   expect(utils.mimeToExt('audio/ogg')).toBe('.ogg');
});

test('#mimeToExt() audio/wav to .wav', () => {
   expect(utils.mimeToExt('audio/wav')).toBe('.wav');
});

test('#formatDuration() 0 secs to 0:00', () => {
   expect(utils.formatDuration(0)).toBe('0:00');
});

test('#formatDuration() 5 secs to 0:05', () => {
   expect(utils.formatDuration(5)).toBe('0:05');
});

test('#formatDuration() 60 secs to 1:00', () => {
   expect(utils.formatDuration(60)).toBe('1:00');
});

test('#formatDuration() 123 secs to 2:03', () => {
   expect(utils.formatDuration(123)).toBe('2:03');
});

test('#formatDuration() 1877 secs to 31:17', () => {
   expect(utils.formatDuration(1877)).toBe('31:17');
});

test('#formatDuration() 7384 secs to 2:03:04', () => {
   expect(utils.formatDuration(7384)).toBe('2:03:04');
});

test('#formatDuration() 10800 secs to 3:00:00', () => {
   expect(utils.formatDuration(10800)).toBe('3:00:00');
});

test('#formatDateFromString Thu, 20 Dec 2018 00:00:00 -0800 to 12/20/2018', () => {
   expect(utils.formatDateFromString('Thu, 20 Dec 2018 00:00:00 -0800')).toBe('12/20/2018');
});