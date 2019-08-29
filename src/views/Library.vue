<template>
  <div class="isdesktop">
    <div class="tab-panel">
      <button
        class="tab-item-active"
        v-if="current_tab === 'image'"
        @click="switchTab('image')"
      >รูปภาพ</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'image'"
        @click="switchTab('image')"
      >รูปภาพ</button>
      <button
        class="tab-item-active"
        v-if="current_tab === 'pdf'"
        @click="switchTab('pdf')"
      >เอกสาร PDF</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'pdf'"
        @click="switchTab('pdf')"
      >เอกสาร PDF</button>
    </div>
    <div class="tab-view">
      <div v-if="current_tab === 'image'">
        <h1 class="tab-headtext">คลังรูปภาพ</h1>
        <div class="toolbar">
          <div class="toolbar-button">
            <span>อัปโหลดรูปภาพ</span>
            <i class="fas fa-file-import toolbar-btn-icon"></i>
          </div>
        </div>
        <div class="image-show-area">
          <div class="image-item" v-for="(data, i) in imageList" :key="i">
            <img class="image-item-img" :src="data.pictureURL" />
            <h5 class="image-item-filename">{{data.filename}}</h5>
            <button class="image-delete-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-if="current_tab === 'pdf'">
        <h1 class="tab-headtext">คลังเอกสาร</h1>
        <div class="toolbar">
          <div class="toolbar-button">
            <span>อัปโหลดเอกสาร</span>
            <i class="fas fa-file-import toolbar-btn-icon"></i>
          </div>
        </div>
        <div class="doc-show-area">
          <div class="doc-table-header">
            <h5 class="doc-table-filename">ชื่อไฟล์</h5>
            <h5 class="doc-table-date">อัปโหลดวันที่</h5>
          </div>
          <div class="doc-item" v-for="(data, i) in documentList" :key="i">
            <i class="far fa-file-pdf doc-item-icon"></i>
            <h5 class="doc-item-filename">{{data.filename}}</h5>
            <h5 class="doc-item-date">{{data.date}}</h5>
            <button class="doc-delete-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
export default {
  name: "library",
  created() {
    this.$emit(`update:layout`, layout_default);
  },
  data() {
    return {
      current_tab: "image",
      imageList: [
        {
          filename: "bee.jpg",
          pictureURL: "https://placeimg.com/320/200/any"
        },
        {
          filename: "people.jpg",
          pictureURL: "https://placeimg.com/320/200/nature"
        },
        {
          filename: "shocked.jpg",
          pictureURL: "https://placeimg.com/320/200/animals"
        },
        {
          filename: "bee.jpg",
          pictureURL: "https://placeimg.com/360/640/tech"
        },
        {
          filename: "people.jpg",
          pictureURL: "https://placeimg.com/320/200/nature"
        },
        {
          filename: "shocked.jpg",
          pictureURL: "https://placeimg.com/320/200/people"
        }
      ],
      documentList: [
        {
          filename: "newest.pdf",
          date: "2019-02-12"
        },
        {
          filename: "newer.pdf",
          date: "2018-09-12"
        },
        {
          filename: "neweee.pdf",
          date: "2019-01-15"
        }
      ]
    };
  },
  methods: {
    switchTab: function(target) {
      this.current_tab = target;
    }
  }
};
</script>

<style scoped>
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
.doc-table-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-items: center;
  color: grey;
  padding: 10px 20px;
  padding-top: 0;
}
.doc-table-filename {
  width: 50%;
}
.doc-table-date {
  margin-left: 30px;
}
.image-show-area {
  background-color: #fff;
  border: 1px solid grey;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
  padding: 20px;
}
.image-item {
  position: relative;
  transition: all 0.1s;
  height: 150px;
  max-height: 150px;
  overflow: hidden;
}
.image-item:hover {
  transform: scale(1.1);
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
}
.image-item-img {
  width: 100%;
  object-fit: cover;
  overflow: hidden;
}
.image-item-filename {
  position: absolute;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  padding: 10px;
}
.image-delete-btn {
  border-radius: 10000px;
  width: 35px;
  height: 35px;
  background-color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  display: none;
  font-size: 16px;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border: 0;
}
.image-delete-btn:hover {
  color: red;
  outline: none;
}
.image-item:hover > .image-delete-btn {
  display: block;
  margin: 0 10px 10px 0;
}
.doc-show-area {
  background-color: #fff;
  border: 1px solid grey;
  border-radius: 5px;
  display: block;
  padding: 20px;
}
.doc-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  align-items: center;
  font-size: 20px;
  padding: 10px 20px;
  transition: all 0.1s;
}
.doc-item:hover {
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.doc-item-icon {
  position: absolute;
  left: 0;
  margin-left: 20px;
}
.doc-item-filename {
  width: 50%;
  padding-left: 30px;
}
.doc-item-date {
  width: fit-content;
}
.doc-delete-btn {
  position: absolute;
  right: 0;
  display: none;
  transition: all 0.1s;
}
.doc-delete-btn:hover {
  color: red;
  transition: all 0.1s;
  transform: scale(1.1);
}
.doc-item:hover > .doc-delete-btn {
  display: block;
  margin-right: 20px;
  border: 0;
  font-size: 17px;
}
.toolbar {
  display: flex;
  margin-bottom: 20px;
}
.toolbar-button {
  width: fit-content;
  height: 30px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid grey;
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
}
.toolbar-button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
}
.toolbar-btn-icon {
  margin-left: 10px;
}
</style>
