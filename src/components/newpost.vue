<template>
  <div style="padding: 20px;">
    <div class="control-tab">
      <h3 class="window-headtext">บทความใหม่</h3>
      <i @click="newPostClose();" class="fas fa-times close-btn"></i>
    </div>
    <div class="tab-panel">
      <button class="tab-item-active" v-if="current_tab === 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-inactive" v-if="current_tab != 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-active" v-if="current_tab === 'en'" @click="switchTab('en')">English</button>
      <button class="tab-item-inactive" v-if="current_tab != 'en'" @click="switchTab('en')">English</button>
    </div>
    <h1>{{current_tab}}</h1>
    <div class="thai-post-box"></div>
  </div>
</template>
<script>
export default {
  name: "newpost",
  data() {
    return {
      current_tab: "th"
    };
  },
  props: {
    newPostClose: Function
  },
  methods: {
    switchTab: function(target) {
      this.current_tab = target;
    }
  }
};
</script>
<style scoped>
.control-tab {
  display: flex;
  position: relative;
}
.close-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.window-headtext {
  font-size: 25px;
  padding-bottom: 15px;
  margin: 0;
}
.tab-headtext {
  margin: 20px 0;
}
.tab-panel {
  width: 100%;
  border: 1px solid grey;
  border-width: 0 0 1px 0;
}
.tab-item-active {
  border-width: 0 0 3px 0;
  border-color: grey;
  font-weight: bold;
}
.tab-item-inactive {
  border-width: 0;
}
.tab-item-inactive,
.tab-item-active {
  width: fit-content;
  background-color: transparent;
  height: 30px;
  border-radius: 0;
  font-size: 15px;
  outline: none;
  padding: 0 40px;
}
</style>