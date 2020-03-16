<template>
  <div class="main-layout-display" style="margin: 0px; padding: 0px;">
    <sidebar />
    <div class="display-area">
      <slot />
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar.vue";
import sidebar from "@/components/sidebar.vue";
export default {
  name: "loginlayout",
  components: {
    topbar,
    sidebar
  }
};
</script>

<style>
.no-result {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaaaaa;
  background-color: #fff;
  user-select: none;
}
.no-result > div.no-inner-box {
  text-align: center;
  cursor: default;
}
.lib-toolbar {
  display: block;
  background-color: #fff;
  position: relative;
  margin-top: 20px;
}
.lib-toolbar-button {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: 30px;
  background-color: #eaeaea;
  border-radius: 0;
  border: 0;
  font-size: 15px;
  padding: 0 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  border-radius: 100px;
  outline: none;
}
.lib-toolbar-button:hover {
  background-color: rgb(35, 124, 0);
  color: #fff;
  transition: all 0.1s;
  cursor: pointer;
}
.lib-toolbar-btn-icon {
  margin-left: 10px;
}
.section-hr {
  border: 1px solid #ececec;
}
.popup-window {
  height: fit-content;
  position: absolute;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
}
.popup-mask {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.post-toolbar {
  display: flex;
}
.toolbar-button {
  width: fit-content;
  height: 30px;
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
  border-radius: 100px;
  user-select: none;
  cursor: pointer;
}
.toolbar-button:hover {
  transition: all 0.1s;
  cursor: pointer;
}
.toolbar-btn-icon {
  margin-left: 10px;
}
.toolbar-button-white {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(255, 255, 255);
}
.toolbar-button-white:hover {
  border: 1px solid rgb(100, 100, 100);
}
.toolbar-button-grey {
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
}
.toolbar-button-grey:hover {
  background-color: #f5f5f5;
  border: 1px solid rgb(100, 100, 100);
}
ิbutton {
  user-select: none;
  cursor: pointer;
  outline: none;
}
.toolbar-panel-bg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e8e8e8;
  margin: -20px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-width: 0 0 1px 0;
  margin-bottom: 0px;
}
.post-toolbar > div.toolbar-button {
  margin-right: 15px;
}
.post-toolbar > div.toolbar-button:last-child {
  margin: 0;
}
.display-area {
  width: calc(100vw - 200px);
  margin-left: 200px;
}
.main-layout-display {
  display: grid;
  grid-template-columns: 200px calc(100vw - 200px);
}
@media screen and (min-width: 1024px) {
  .isdesktop {
    margin: 20px;
  }
}
p,
h1,
h2,
h3,
h4,
h5,
h6,
li,
ul {
  margin: 0;
  padding: 0;
}
.box {
  background-color: #ffffff;
  border: solid #e6e6e6;
  border-width: 1px;
  border-radius: 6px;
  padding: 20px;
}
.tab-panel {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
.tab-item-active {
  background-color: #fff !important;
  font-weight: bold;
  border: 1px solid #fff;
}
.tab-item-active:hover {
  border: 1px solid rgb(100, 100, 100);
  transition: all 0.1s;
}
.tab-item-inactive {
  border: 1px solid #f0f0f0;
}
.tab-item-inactive:hover {
  border: 1px solid rgb(100, 100, 100);
  transition: all 0.1s;
}
.tab-item-inactive,
.tab-item-active {
  color: black;
  width: fit-content;
  background-color: transparent;
  height: 40px;
  font-size: 15px;
  outline: none;
  padding: 0 20px;
  margin: 0 10px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.1s;
}
.popup-btn-panel {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}
.popup-btn-panel-2col {
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 20px;
}
.left-group {
  display: flex;
  justify-content: flex-start;
}
.right-group {
  display: flex;
  justify-content: flex-end;
}
.right-group > div.popup-button:last-child {
  margin-right: 0;
}

.left-group,
.right-group {
  display: flex;
  position: relative;
}
.popup-button {
  width: fit-content;
  height: 30px;
  background-color: #ececec;
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
  margin-right: 10px;
  user-select: none;
  border-radius: 100px;
}
.popup-button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
  color: #fff;
}
.popup-button-cancel:hover {
  background-color: rgb(163, 163, 163);
}
.popup-button-clear:hover {
  background-color: rgb(255, 111, 111);
}
.popup-button-submit:hover {
  background-color: rgb(55, 199, 120);
}
.popup-btn-icon {
  margin-left: 10px;
}
.page-headtext {
  user-select: none;
}
.tab-title {
  padding: 20px 0px 0px 20px;
  display: flex;
  align-items: center;
  user-select: none;
}

.tab-title-popup {
  display: flex;
  align-items: center;
}
.tab-title > h5 {
  font-size: 20px;
}
.tab-title-popup > h5 {
  font-size: 20px;
}
.tab-view {
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  height: calc(100vh - 190px);
}
.no-tab {
  height: calc(100vh - 130px);
  border-radius: 10px;
  overflow: hidden;
}
.page-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 20px;
  background-color: #fff;
}
.page-pagination > button {
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
  transition: all 0.1s;
}
.page-pagination > button:hover {
  background-color: #ebebeb;
  border: 1px solid rgb(100, 100, 100);
}
.page-pagination > div.pagination-current {
  padding: 0 20px;
}
.prev-btn,
.next-btn {
  background-color: #e8e8e8;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  border-radius: 100px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev-btn:hover,
.next-btn:hover {
  transition: all 0.1s;
}
.prev-btn:focus,
.next-btn:focus {
  transition: all 0.1s;
}
.prev-btn {
  position: absolute;
  left: 0;
}
.next-btn {
  position: absolute;
  right: 0;
}
.list-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 30px;
  background-color: #ebebeb;
  border-radius: 100px;
  border: 0;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  outline: none;
}
.list-btn:hover {
  border: 1px solid #646464;
}
.list-btn-red:hover {
  border: 1px solid rgb(255, 31, 31);
  background-color: rgb(255, 75, 75);
  color: #fff;
}
</style>
