"use strict";
const common_vendor = require("../../common/vendor.js");
const services_audio_service = require("../../services/audio.service.js");
const services_song_service = require("../../services/song.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      statusBarHeight: 20,
      navPaddingTop: 140,
      categories: services_song_service.categories,
      selectedCategory: "love",
      songs: services_song_service.sampleSongs,
      selectedSong: null,
      isPlaying: false,
      isRecording: false,
      recordingPath: "",
      recordingDuration: 0,
      currentLyric: "",
      currentLyricIndex: -1,
      recordingTimer: null,
      currentPlayTime: 0
    };
  },
  computed: {
    filteredSongs() {
      return services_song_service.filterSongsByCategory(this.songs, this.selectedCategory);
    },
    playProgress() {
      if (!this.selectedSong || !this.selectedSong.duration)
        return 0;
      return this.currentPlayTime / this.selectedSong.duration * 100;
    }
  },
  onLoad() {
    const info = common_vendor.index.getSystemInfoSync();
    const sbh = info.statusBarHeight || 20;
    this.statusBarHeight = sbh;
    this.navPaddingTop = sbh + 75;
    this.setupAudioListeners();
  },
  onUnload() {
    this.cleanup();
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.selectedSong = null;
      this.isPlaying = false;
      this.currentLyric = "";
    },
    selectSong(song) {
      if (this.isPlaying) {
        services_audio_service.AudioService.stop();
      }
      this.selectedSong = song;
      this.isPlaying = false;
      this.recordingPath = "";
      this.recordingDuration = 0;
      this.currentLyric = "";
      this.currentLyricIndex = -1;
      this.currentPlayTime = 0;
    },
    setupAudioListeners() {
      services_audio_service.AudioService.onAudioEvent("timeUpdate", () => {
        this.updateLyric();
      });
      services_audio_service.AudioService.onAudioEvent("ended", () => {
        this.isPlaying = false;
        this.currentLyric = "";
        this.currentLyricIndex = -1;
      });
      services_audio_service.AudioService.onAudioEvent("error", (err) => {
        common_vendor.index.__f__("error", "at pages/sound-healing/online-duet.vue:189", "Audio playback error:", err);
        this.isPlaying = false;
        common_vendor.index.showToast({
          title: "音频加载失败，请重试",
          icon: "none"
        });
      });
    },
    togglePlay() {
      if (!this.selectedSong)
        return;
      if (this.isPlaying) {
        services_audio_service.AudioService.pause();
        this.isPlaying = false;
      } else {
        services_audio_service.AudioService.playBgm(this.selectedSong.bgmUrl);
        this.isPlaying = true;
      }
    },
    updateLyric() {
      if (!this.selectedSong || !this.selectedSong.lyrics)
        return;
      const currentTime = services_audio_service.AudioService.getCurrentTime() * 1e3;
      this.currentPlayTime = services_audio_service.AudioService.getCurrentTime();
      const lyrics = this.selectedSong.lyrics;
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
          if (this.currentLyricIndex !== i) {
            this.currentLyricIndex = i;
            this.currentLyric = lyrics[i].text;
          }
          break;
        }
      }
    },
    async toggleRecording() {
      if (this.isRecording) {
        await this.stopRecordingHandler();
      } else {
        await this.startRecordingHandler();
      }
    },
    async startRecordingHandler() {
      try {
        await services_audio_service.AudioService.startRecord();
        this.isRecording = true;
        this.recordingDuration = 0;
        this.recordingPath = "";
        this.recordingTimer = setInterval(() => {
          this.recordingDuration++;
        }, 1e3);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/sound-healing/online-duet.vue:245", "Failed to start recording:", err);
        common_vendor.index.showToast({
          title: "录音启动失败，请检查麦克风权限",
          icon: "none"
        });
      }
    },
    async stopRecordingHandler() {
      try {
        if (this.recordingTimer) {
          clearInterval(this.recordingTimer);
          this.recordingTimer = null;
        }
        const result = await services_audio_service.AudioService.stopRecord();
        this.isRecording = false;
        this.recordingPath = result.tempFilePath;
        this.recordingDuration = result.duration;
        common_vendor.index.showToast({
          title: "录音完成",
          icon: "success"
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/sound-healing/online-duet.vue:270", "Failed to stop recording:", err);
        this.isRecording = false;
        common_vendor.index.showToast({
          title: "录音保存失败",
          icon: "none"
        });
      }
    },
    previewRecording() {
      if (!this.recordingPath) {
        common_vendor.index.showToast({
          title: "没有可预览的录音",
          icon: "none"
        });
        return;
      }
      services_audio_service.AudioService.playRecord(this.recordingPath);
    },
    reRecord() {
      this.recordingPath = "";
      this.recordingDuration = 0;
    },
    submitRecording() {
      const validation = services_song_service.validateRecordingSubmission(this.selectedSong, this.recordingPath);
      if (!validation.valid) {
        common_vendor.index.showToast({
          title: validation.message,
          icon: "none"
        });
        return { success: false, message: validation.message };
      }
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success"
      });
      this.recordingPath = "";
      this.recordingDuration = 0;
      return { success: true, message: "提交成功" };
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
    cleanup() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
      services_audio_service.AudioService.stop();
      services_audio_service.AudioService.destroy();
    }
  }
};
if (!Array) {
  const _component_custom_nav_bar = common_vendor.resolveComponent("custom-nav-bar");
  _component_custom_nav_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "线上山歌对唱",
      gradient: "linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)"
    }),
    b: common_vendor.f($data.categories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.selectedCategory === category.id ? 1 : "",
        d: common_vendor.o(($event) => $options.selectCategory(category.id), category.id)
      };
    }),
    c: common_vendor.f($options.filteredSongs, (song, k0, i0) => {
      return {
        a: song.coverImage,
        b: common_vendor.t(song.title),
        c: common_vendor.t(song.artist),
        d: common_vendor.t($options.formatDuration(song.duration)),
        e: song.id,
        f: $data.selectedSong && $data.selectedSong.id === song.id ? 1 : "",
        g: common_vendor.o(($event) => $options.selectSong(song), song.id)
      };
    }),
    d: $data.selectedSong
  }, $data.selectedSong ? common_vendor.e({
    e: common_vendor.t($data.selectedSong.title),
    f: common_vendor.t($data.isPlaying ? "⏸" : "▶"),
    g: common_vendor.o((...args) => $options.togglePlay && $options.togglePlay(...args)),
    h: $data.selectedSong.lyrics && $data.selectedSong.lyrics.length
  }, $data.selectedSong.lyrics && $data.selectedSong.lyrics.length ? {
    i: $options.playProgress + "%",
    j: common_vendor.t($data.currentLyric || "♪ 准备播放 ♪"),
    k: common_vendor.t($options.formatDuration(Math.floor($data.currentPlayTime))),
    l: common_vendor.t($options.formatDuration($data.selectedSong.duration))
  } : {}, {
    m: $data.isRecording
  }, $data.isRecording ? {
    n: common_vendor.t($options.formatDuration($data.recordingDuration))
  } : {}, {
    o: common_vendor.t($data.isRecording ? "停止录音" : "开始录音"),
    p: $data.isRecording ? 1 : "",
    q: common_vendor.o((...args) => $options.toggleRecording && $options.toggleRecording(...args)),
    r: $data.recordingPath
  }, $data.recordingPath ? {
    s: common_vendor.o((...args) => $options.previewRecording && $options.previewRecording(...args))
  } : {}, {
    t: $data.recordingPath
  }, $data.recordingPath ? {
    v: common_vendor.o((...args) => $options.reRecord && $options.reRecord(...args))
  } : {}, {
    w: $data.recordingPath
  }, $data.recordingPath ? {
    x: common_vendor.o((...args) => $options.submitRecording && $options.submitRecording(...args))
  } : {}) : {}, {
    y: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bfdbbdc5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/sound-healing/online-duet.js.map
