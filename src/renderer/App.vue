<template>
  <div id="app" class="universe">
    <header>
      <toolbar />
      <player />
    </header>
    <rs-panes class="pt-140" split-to="columns" :allow-resize="true" :size=300 :minSize=100 :maxSize=600>
      <div slot="firstPane">
        <podcast-list></podcast-list>
      </div>
      <div slot="secondPane"> 
        <div v-if="isInSearchMode">
          <search-pane />
        </div>     
        <div v-else-if="isInSettingsMode">
          <app-settings />
        </div>
        <b-tabs v-else>
          <b-tab title="Episodes"><podcasts-pane></podcasts-pane></b-tab>
          <!-- <b-tab title="Search"><search-pane /></b-tab> -->
          <b-tab title="Settings"><settings-pane /></b-tab>
        </b-tabs>
      </div>
    </rs-panes>
  </div>
</template>

<script>
  import ResizeSplitPane from './components/ResizeSplitPane';
  import PodcastList from './components/PodcastList';
  import PodcastsPane from './components/PodcastsPane';
  import SearchPane from './components/SearchPane';
  import SettingsPane from './components/SettingsPane';
  import Player from './components/Player';
  import Toolbar from './components/Toolbar';
  import AppSettings from './components/AppSettings';

  export default {
    name: 'app',
    components: {
      "rs-panes": ResizeSplitPane,
      PodcastsPane,
      PodcastList,
      SearchPane,
      SettingsPane,
      Player,
      Toolbar,
      AppSettings
    },
    computed: {
      isInSearchMode() {
        return this.$store.state.controls.display_mode === 'search';
      },
      isInSettingsMode() {
        return this.$store.state.controls.display_mode === 'settings';
      }
    }
  }
</script>

<style>
body {
  margin: 0px;
} 

.p-10 {
  padding: 10px;
}

.pr-8 {
  padding-right: 8px;
}

.w-100 {
  width: 100px;
}

.pt-140 {
  padding-top: 140px;
}

header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 140px;
  text-align: center;
  z-index: 1;
}

.go-left {
  float: left;
}

.go-right {
  float: right;
}

.pp-modal-title {
  text-align: center;
  width: 100%;
  height: 48px;
  padding-top: 2px;
  font-size: 120%;
}

.pp-modal-title-light {
  background-color: #007bff;
  color: #ffffff;
}

.pp-modal-title-error-light {
  background-color: #dc3545;
  color: #ffffff;
}

.pp-modal-content-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.pp-modal-content {
  width: 100%;
}

.pp-modal-container {
  height: 100%;
  position: relative;
  z-index: 5;
}

</style>
