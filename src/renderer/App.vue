<template>
  <div id="app" class="universe">
    <div class="main-pane">
      <rs-panes split-to="columns" :allow-resize="true" :size=300 :minSize=100 :maxSize=600>
        <div slot="firstPane">
          <podcast-list></podcast-list>
        </div>
        <div slot="secondPane">
          <player />
          <b-tabs>
            <b-tab title="Episodes"><podcasts-pane></podcasts-pane></b-tab>
            <b-tab title="Search"><search-pane /></b-tab>
            <b-tab title="Settings"><settings-pane /></b-tab>
          </b-tabs>
        </div>
      </rs-panes>
    </div>
  </div>
</template>

<script>
  import ResizeSplitPane from './components/ResizeSplitPane'
  import PodcastList from './components/PodcastList'
  import PodcastsPane from './components/PodcastsPane'
  import SearchPane from './components/SearchPane'
  import SettingsPane from './components/SettingsPane'
  import Player from './components/Player'

  export default {
    name: 'app',
    components: {
      "rs-panes": ResizeSplitPane,
      PodcastsPane,
      PodcastList,
      SearchPane,
      SettingsPane,
      Player
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

</style>
