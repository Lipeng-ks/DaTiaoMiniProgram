"use strict";
const categories = [
  { id: "love", name: "情歌对唱", icon: "💕", description: "表达爱意的山歌" },
  { id: "folk", name: "民俗山歌", icon: "🏔️", description: "传统壮族民俗歌曲" },
  { id: "festival", name: "节庆山歌", icon: "🎉", description: "节日庆典歌曲" },
  { id: "labor", name: "劳动山歌", icon: "🌾", description: "劳作时唱的山歌" }
];
const sampleSongs = [
  {
    id: "song-1",
    categoryId: "love",
    title: "山歌好比春江水",
    artist: "壮族民歌",
    duration: 180,
    bgmUrl: "/static/audio/song1.mp3",
    lyrics: [
      { time: 0, text: "山歌好比春江水" },
      { time: 5e3, text: "不怕滩险弯又多" },
      { time: 1e4, text: "弯弯曲曲都经过" },
      { time: 15e3, text: "还有那情歌万万千" }
    ],
    coverImage: "/static/images/song1.jpg"
  },
  {
    id: "song-2",
    categoryId: "love",
    title: "刘三姐",
    artist: "壮族民歌",
    duration: 210,
    bgmUrl: "/static/audio/song2.mp3",
    lyrics: [
      { time: 0, text: "唱山歌咧" },
      { time: 3e3, text: "这边唱来那边和" },
      { time: 8e3, text: "山歌好比春江水" },
      { time: 13e3, text: "不怕滩险弯又多" }
    ],
    coverImage: "/static/images/song2.jpg"
  },
  {
    id: "song-3",
    categoryId: "folk",
    title: "壮乡美",
    artist: "壮族民歌",
    duration: 195,
    bgmUrl: "/static/audio/song3.mp3",
    lyrics: [
      { time: 0, text: "壮乡美如画" },
      { time: 5e3, text: "山清水秀人更美" },
      { time: 1e4, text: "歌声飘四方" }
    ],
    coverImage: "/static/images/song3.jpg"
  },
  {
    id: "song-4",
    categoryId: "folk",
    title: "赶圩归来啊哩哩",
    artist: "壮族民歌",
    duration: 165,
    bgmUrl: "/static/audio/song4.mp3",
    lyrics: [
      { time: 0, text: "赶圩归来啊哩哩" },
      { time: 4e3, text: "赶圩归来啊哩哩" },
      { time: 8e3, text: "身上背着竹背篓" }
    ],
    coverImage: "/static/images/song4.jpg"
  },
  {
    id: "song-5",
    categoryId: "festival",
    title: "三月三",
    artist: "壮族民歌",
    duration: 200,
    bgmUrl: "/static/audio/song5.mp3",
    lyrics: [
      { time: 0, text: "三月三来歌满天" },
      { time: 5e3, text: "壮家儿女齐欢唱" },
      { time: 1e4, text: "山歌飘过九重山" }
    ],
    coverImage: "/static/images/song5.jpg"
  },
  {
    id: "song-6",
    categoryId: "festival",
    title: "欢度佳节",
    artist: "壮族民歌",
    duration: 175,
    bgmUrl: "/static/audio/song6.mp3",
    lyrics: [
      { time: 0, text: "佳节到来喜洋洋" },
      { time: 5e3, text: "壮乡处处歌声扬" }
    ],
    coverImage: "/static/images/song6.jpg"
  },
  {
    id: "song-7",
    categoryId: "labor",
    title: "插秧歌",
    artist: "壮族民歌",
    duration: 150,
    bgmUrl: "/static/audio/song7.mp3",
    lyrics: [
      { time: 0, text: "春风吹来插秧忙" },
      { time: 5e3, text: "弯腰插秧歌声扬" }
    ],
    coverImage: "/static/images/song7.jpg"
  },
  {
    id: "song-8",
    categoryId: "labor",
    title: "丰收歌",
    artist: "壮族民歌",
    duration: 185,
    bgmUrl: "/static/audio/song8.mp3",
    lyrics: [
      { time: 0, text: "金秋时节稻谷香" },
      { time: 5e3, text: "丰收喜悦满山乡" }
    ],
    coverImage: "/static/images/song8.jpg"
  }
];
function filterSongsByCategory(songs, categoryId) {
  if (!categoryId || categoryId === "") {
    return songs;
  }
  return songs.filter((song) => song.categoryId === categoryId);
}
function validateRecordingSubmission(selectedSong, recordingPath) {
  if (!selectedSong) {
    return { valid: false, message: "请先选择一首歌曲" };
  }
  if (!recordingPath || recordingPath === "") {
    return { valid: false, message: "请先录制您的歌声" };
  }
  return { valid: true, message: "验证通过" };
}
exports.categories = categories;
exports.filterSongsByCategory = filterSongsByCategory;
exports.sampleSongs = sampleSongs;
exports.validateRecordingSubmission = validateRecordingSubmission;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/song.service.js.map
