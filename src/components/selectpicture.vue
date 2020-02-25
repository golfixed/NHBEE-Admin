<template>
  <div>
    <div>
      <div>
        <div class="searchbox-div">
          <div class="form-set">
            <input
              v-model="search"
              class="form-set-input"
              type="text"
              placeholder="ค้นหาด้วยชื่อ หรือ ID"
              @keypress.enter="getPicture(1)"
            />
          </div>
          <i class="fas fa-search" v-if="search == ''"></i>
          <i class="fas fa-times" v-on:click="clearSearch()" v-if="search != ''"></i>
        </div>
      </div>
      <div class="loading-section" v-if="pictureList.length <= 0">
        <p v-if="isLoading == true">กำลังโหลดรายการ</p>
        <p v-if="isLoading == false">ไม่พบผลลัพธ์</p>
      </div>
      <div class="picture-display">
        <div v-for="(picture, i) in pictureList" :key="'picture_' + i">
          <div
            class="picture-item"
            @click="savePicture(i)"
            :disabled="!(selectedIndex >= 0 && selectedIndex < pictureList.length)"
          >
            <img :src="picture.pictureURL" :alt="picture.filename" height="50px" />
            <span :class="selectedIndex === i ? 'redText' : ''">{{ picture.filename }}</span>
          </div>
        </div>
      </div>
      <div class="page-controller">
        <button @click="getPicture(page.now - 1)" v-if="page.now > 1">
          <i class="fas fa-arrow-left"></i>
        </button>
        <button @click="getPicture(page.now + 1)" v-if="page.now < page.all">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";

export default {
  name: "select-picture",
  props: ["pictureId", "url"],
  model: {
    prop: "pictureId",
    event: "selected"
  },
  created() {
    this.getPicture(1);
  },
  data() {
    return {
      selectedIndex: null,
      search: "",
      pictureName: "",
      pictureURL: "",
      page: {
        now: 1,
        all: 0
      },
      limit: 3,
      pictureList: [],
      isLoading: false
    };
  },
  methods: {
    getPicture(page = 1) {
      this.isLoading = true;
      axios
        .get(
          `/admin/picture?page=${page}&limit=${this.limit}${
            this.search ? `&q=${this.search}` : ""
          }`
        )
        .then(response => {
          this.page = response.data.page;
          this.pictureList = response.data.file.data;
          this.isLoading = false;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get file list", error.response.data.error);
          else console.error("get file list", error.message);
        });
    },
    savePicture(i) {
      this.selectedIndex = i;
      this.isOpenStorage = false;
      const picture = this.pictureList[this.selectedIndex];
      this.$emit("update:url", picture.pictureURL);
      this.$emit("selected", picture.id);
      this.selectedIndex = null;
      this.search = "";
      this.pictureList = [];
    },
    clearClose() {
      this.isOpenStorage = false;
      this.selectedIndex = null;
      this.search = "";
      this.pictureName = "";
      this.pictureURL = "";
      this.page = {
        now: 1,
        all: 0
      };
      this.pictureList = [];
    },
    clearSearch() {
      this.selectedIndex = null;
      this.search = "";
      this.pictureName = "";
      this.page = {
        now: 1,
        all: 0
      };
      this.pictureList = [];
      this.getPicture(1);
    }
  }
};
</script>

<style scoped>
button {
  outline: none;
}
.page-controller {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.page-controller > button {
  border: 0;
  background-color: #ececec;
  margin: 0 10px;
  padding: 5px 10px;
  cursor: pointer;
}
.picture-display {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
}
.picture-item {
  padding: 20px;
  display: block;
  transition: all 0.1s;
}
.picture-item:hover {
  background-color: #ececec;
  transform: scale(1.05);
  transition: all 0.1s;
}
.picture-item > img {
  width: 100%;
  height: 100%;
}
.picture-item > span {
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 5px;
}
.picture-item > button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
  color: #fff;
}
.loading-section {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  color: #aaaaaa;
}
.searchbox-div > i {
  font-size: 15px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-10px, -50%);
  color: #aaaaaa;
}
.searchbox-div > i:hover {
  color: grey;
  cursor: pointer;
}
.searchbox-div > div.form-set {
  margin-top: 3px;
}
.searchbox-div > div.form-set > input {
  width: 100%;
  height: 30px;
  font-size: 14px;
  padding-left: 10px;
}
.searchbox-div > div.form-set > input::placeholder {
  font-size: 14px;
}
.recent-file {
  color: #808080;
  cursor: default;
}
</style>