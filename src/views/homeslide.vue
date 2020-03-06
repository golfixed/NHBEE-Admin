<template>
  <div class="isdesktop">
    <div class="toolbar-panel-bg">
      <h1 class="tab-headtext">สไลด์รูปภาพ (หน้าแรก)</h1>
      <div class="post-toolbar">
        <div class="toolbar-button toolbar-button-white" @click="loadFileList(1);">
          <span>รีเฟรช</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
        <div class="toolbar-button toolbar-button-white" @click="uploadToggle('open');">
          <span>อัปโหลดรูปภาพใหม่</span>
          <i class="fas fa-arrow-up toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="popup-mask" v-if="isUploadOpen === true" v-on:click="uploadToggle('close');"></div>
    <div
      class="popup-window"
      v-if="isUploadOpen === true"
      style="display:block !important;padding:20px;"
    >
      <div class="tab-title-popup">
        <h5>อัปโหลดรูปภาพใหม่</h5>
        <i class="fas fa-arrow-up" style="margin-left: 10px;"></i>
      </div>
      <div class="lib-toolbar">
        <div class="upload-panel">
          <div>
            <h5>เลือกไฟล์</h5>
            <input
              ref="picture_input"
              type="file"
              @change="fileChange"
              accept="image/jpeg, image/png"
              :disabled="isUploading"
            />
          </div>
        </div>
      </div>
      <hr class="section-hr" style="margin-top: 20px;" />
      <div class="popup-btn-panel-2col">
        <div class="left-group">
          <div
            class="popup-button popup-button-clear"
            @click="uploadToggle('close');"
            :disabled="isUploading"
          >
            <span>ยกเลิก</span>
            <i class="fas fa-times popup-btn-icon"></i>
          </div>
        </div>
        <div class="right-group">
          <div
            class="popup-button popup-button-submit"
            @click="uploadFile();"
            :disabled="isUploading"
          >
            <span>อัปโหลด</span>
            <i class="fas fa-arrow-up popup-btn-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-panel">
      <button
        class="tab-item-active"
        v-if="current_tab === 'lib'"
        @click="switchTab('lib')"
      >รูปภาพในคลัง</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'lib'"
        @click="switchTab('lib')"
      >รูปภาพในคลัง</button>
      <button
        class="tab-item-active"
        v-if="current_tab === 'onshow'"
        @click="switchTab('onshow')"
      >รูปภาพที่แสดงอยู่</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'onshow'"
        @click="switchTab('onshow')"
      >รูปภาพที่แสดงอยู่</button>
    </div>
    <div class="tab-view">
      <div class="homeslide-display" v-if="current_tab == 'lib'">
        <div class="left-panel">
          <div class="tab-title" style="background-color: #fff;padding: 20px 0 0 20px;">
            <i class="far fa-images" style="margin-right: 10px;"></i>
            <h5>รูปภาพในคลัง</h5>
          </div>
          <div class="no-result" v-if="imageList.length <= 0">
            <div class="inner-box">
              <div>
                <h3>ยังไม่มีรูปภาพในคลัง</h3>
                <h4>เริ่มต้นอัปโหลดรูปภาพใหม่ที่เครื่องมืออัปโหลดด้านบน</h4>
              </div>
            </div>
          </div>
          <div class="image-show-area" v-if="imageList.length > 0">
            <div class="image-item" v-for="(data, i) in imageList" :key="i">
              <img class="image-item-img" :src="data.url" />
              <h5 class="image-item-filename">ID: {{data.id}}</h5>
              <button class="image-delete-btn">
                <i class="fas fa-plus add-btn" @click="addSelectImage(i)"></i>
                <i class="fas fa-trash-alt trash-btn" @click="deleteImage(i)"></i>
              </button>
            </div>
          </div>
          <div class="image-pagination">
            <button
              class="pagination-btn prev-btn"
              v-if="this.page.now > 1"
              @click="prevPage(page.now);"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
            <button
              class="pagination-btn next-btn"
              v-if="this.page.now < this.page.all"
              @click="nextPage(page.now);"
            >
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div class="right-panel">
          <div class="tab-title" style="background-color: #fff;padding: 20px 0 0 20px;">
            <i class="fas fa-check-double" style="margin-right: 10px;"></i>
            <h5>รูปภาพที่เลือก</h5>
          </div>
          <div class="no-result" v-if="imageSelectList.length <= 0">
            <div class="inner-box">
              <div>
                <h3>ยังไม่มีรูปภาพที่เลือก</h3>
                <h4>เริ่มต้นเลือกรูปภาพด้านซ้ายมือ</h4>
              </div>
            </div>
          </div>
          <div class="select-image-show-area">
            <div class="image-item" v-for="(data, i) in imageSelectList" :key="i">
              <img class="image-item-img" :src="data.url" />
              <h5 class="image-item-filename">{{data.order}}</h5>
              <button class="image-delete-btn">
                <i class="fas fa-trash-alt trash-btn" @click="removeSelectImage(data.id)"></i>
              </button>
            </div>
          </div>
          <div class="tab-bottom-toolbar">
            <div class="toolbar-button toolbar-button-grey" @click="saveSelectImage(true)">
              <span>จัดแสดงรายการเลือก</span>
              <i class="fas fa-check-double toolbar-btn-icon"></i>
            </div>
          </div>
          <!-- ONLINE GALLERY -->
        </div>
      </div>
      <div v-if="current_tab == 'onshow'">
        <div class="onshow-display">
          <div
            class="tab-title"
            style="background-color: #fff;padding-top:20px;padding-left: 20px;"
          >
            <i class="far fa-images" style="margin-right: 10px;"></i>
            <h5>รูปภาพที่แสดงอยู่</h5>
          </div>
          <div class="no-result" v-if="imageSelectList.length <= 0">
            <div class="inner-box">
              <div>
                <h3>ยังไม่มีรูปภาพที่แสดงอยู่</h3>
                <h4>เริ่มต้นเลือกรูปภาพสำหรับจัดแสดงที่แถบ "รูปภาพในคลัง"</h4>
              </div>
            </div>
          </div>
          <div class="image-onshow-area" v-if="imageSelectList.length > 0">
            <div class="image-item" v-for="(data, i) in imageSelectList" :key="i">
              <img class="image-item-img" :src="data.url" />
              <h5 class="image-item-filename">{{data.order}}</h5>
              <button class="image-delete-btn">
                <i class="fas fa-trash-alt trash-btn" @click="removeSelectImage(data.id, true)"></i>
              </button>
            </div>
          </div>
          <div class="tab-bottom-toolbar" v-if="imageSelectList.length > 0">
            <div class="toolbar-button toolbar-button-grey" @click="clearSelectImage()">
              <span>ลบทั้งหมด</span>
              <i class="fas fa-trash-alt toolbar-btn-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
import axios from "@/axios.js";
export default {
  name: "homeslide",
  data() {
    return {
      page: {
        now: 1,
        all: 0
      },
      imageList: [],
      filename: "",
      file: null,
      isUploading: false,
      uploadIsOpen: false,
      onShowImg: [],
      current_tab: "lib",
      isUploadOpen: false,
      imageSelectList: []
    };
  },
  created() {
    this.loadFileList(1);
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    uploadToggle(method) {
      if (method == "open") this.isUploadOpen = true;
      else if (method == "close") this.isUploadOpen = false;
      else this.isUploadOpen = this.isUploadOpen;
    },
    refreshList: function() {
      this.loadFileList(1);
    },
    nextPage: function(page) {
      if (this.page.now <= this.page.all) {
        this.page.now = this.page.now + 1;
        this.loadFileList(this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(this.page.now);
      }
    },
    prevPage: function(page) {
      if (this.page.now <= this.page.all && this.page.now != 0) {
        this.page.now = this.page.now - 1;
        this.loadFileList(this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(this.page.now);
      }
    },
    loadFileList(page) {
      axios(`/admin/carousel?page=${page}&limit=10`)
        .then(response => {
          this.page = response.data.page;
          this.imageList = response.data.carousel.data;
          this.imageSelectList = response.data.order.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get file list", error.response.data.error);
          else console.error("get file list", error.message);
        });
    },
    uploadFile() {
      if (this.isUploading) return "";
      this.isUploading = true;
      const formData = new FormData();
      formData.append("carousel", this.file);
      axios
        .post(`/admin/carousel`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          console.log("file id", response.data.id);
          this.filename = "";
          this.file = null;
          this.imageList.push(response.data);
          this.$refs.picture_input.value = "";
          alert("อัปโหลดรูปภาพสำเร็จ");
          this.loadFileList(1);
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error("upload file", error.response.data.error);
            if (error.response.data.error === "Carousel already exists") {
              alert("เกิดข้อผิดพลาด: อัปโหลดรูปภาพซ้ำ");
            } else if (error.response.data.error === "No Carousel") {
              alert("เกิดข้อผิดพลาด: ไม่มีรูปภาพ หรือ รูปแบบรูปภาพไม่รองรับ");
            } else if (error.response.data.error === "Upload unsuccessful") {
              alert("เกิดข้อผิดพลาด: อัปโหลดไม่สำเร็จ");
            } else if (error.response.data.error === "Only JPEG or PNG") {
              alert("เกิดข้อผิดพลาด: รูปแบบรูปภาพไม่รองรับ");
            }
          } else console.error("upload file", error.message);
        })
        .finally(() => {
          this.isUploading = false;
          this.uploadToggle("close");
        });
    },
    deleteImage(index) {
      const image = this.imageList[index];
      if (confirm(`ยืนยันว่าจะลบรูป ${image.id}?`)) {
        axios
          .post(`/admin/carousel/${image.id}/delete`)
          .then(response => {
            this.imageList.splice(index, 1);
            this.loadFileList(1);
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("delete", error.response.data.error);
            else console.error("delete", error.message);
          });
      }
    },
    fileChange(e) {
      const file = e.target.files[0];
      this.filename = file.name;
      this.file = file;
    },
    switchTab: function(target) {
      this.current_tab = target;
      this.loadFileList(1);
    },
    addSelectImage (index) {
      if (!(index >= 0)) return null
      if (!this.imageList[index]) return null
      const image = { ...this.imageList[index] }
      image.order = this.imageSelectList.length + 1
      let isDup = false
      for (const i in this.imageSelectList) {
        const selected = this.imageSelectList[i]
        if (selected.id === image.id) {
          isDup = true
          break
        }
      }
      if (!isDup) this.imageSelectList.push(image)
    },
    removeSelectImage (id, save = false) {
      if (this.imageSelectList <= 0) return null
      const imageList = this.imageSelectList.filter(a => a.id !== id)
      if (imageList.length !== this.imageSelectList.length) {
        for (let i = 0; i < imageList.length; i++) imageList[i].order = (i + 1)
        this.imageSelectList = imageList.sort((a, b) => a.order - b.order)
        if (save) this.saveSelectImage()
      }
    },
    clearSelectImage () {
      if (confirm('ยืนยันที่จะลบทั้งหมด?')) {
        this.imageSelectList = []
        this.saveSelectImage()
      }
    },
    saveSelectImage (isButton = false) {
      const save = []
      for (const i in this.imageSelectList) save.push(this.imageSelectList[i].id)
      axios({
        method: "post",
        url: "/admin/carousel/save",
        data: save
      }).then((response) => {
        if (isButton) alert('จัดแสดงเรียบร้อย')
      }).catch((error) => {
        if (error.response.data) {
          alert(`รูปภาพที่เลือกไม่ถูกบันทึกเนื่องจาก: ${error.response.data.error}`)
        } else {
          alert(`รูปภาพที่เลือกไม่ถูกบันทึกเนื่องจาก: ${error.message}`)
        }
      })
    }
  }
};
</script>

<style scoped>
.tab-view > div.homeslide-display {
  display: grid;
  grid-template-columns: 70% 30%;
  background-color: #fff;
  height: calc(100vh - 190px);
}
.right-panel {
  border: 1px solid #ebebeb;
  border-width: 0 0 0 1px;
  position: relative;
}
.left-panel {
  position: relative;
}

/* Popup Buttons  */

.post-toolbar {
  display: flex;
}

.tab-bottom-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.tab-bottom-toolbar > div.toolbar-button {
  margin: 0 5px;
}
.no-result {
  color: #aaaaaa;
  background-color: #fff;
}
.no-result > div.inner-box {
  text-align: center;
  cursor: default;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-result > div.inner-box > div {
  text-align: center;
}

/* Pagination style */
.prev-btn,
.next-btn {
  border: 0;
  background-color: #e8e8e8;
  border-radius: 0;
  outline: none;
  padding: 9px 15px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.1s;
}

.prev-btn:hover,
.next-btn:hover {
  transform: scale(1.1);
  transition: all 0.1s;
}
.prev-btn:focus,
.next-btn:focus {
  transform: scale(1);
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
.image-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px 0;
}
.pagination-current {
  padding: 0 20px;
}

/* Tab style */

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
  border: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 100px);
  grid-gap: 20px;
  padding: 20px;
}
.image-onshow-area {
  background-color: #fff;
  border: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 100px);
  grid-gap: 20px;
  padding: 20px;
}
.select-image-show-area {
  background-color: #fff;
  border: 0;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 20px;
  padding: 20px;
  height: calc(100vh - 360px);
  overflow: scroll;
  margin-top: 10px;
}
.select-image-show-area > div.image-item {
  width: 100%;
  height: 150px;
}
.image-item {
  position: relative;
  transition: all 0.1s;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
}
.image-item:hover {
  transform: scale(1.05);
  transition: all 0.1s;
  cursor: pointer;
}
.image-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}
.image-item-filename {
  position: absolute;
  bottom: 0;
  background-color: #ffffffbd;
  width: 100%;
  padding: 5px 0 5px 10px;
}
.image-delete-btn {
  border-radius: 10000px;
  width: fit-content;
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
  outline: none;
  cursor: pointer;
}
.trash-btn:hover {
  color: red;
  outline: none;
}
.add-btn:hover {
  color: rgb(68, 160, 15);
  outline: none;
}
.image-delete-btn > i {
  margin: 0 7px;
}
.image-item:hover > .image-delete-btn {
  display: block;
  margin: 0 10px 10px 0;
}
.doc-show-area {
  background-color: #fff;
  border: 0;
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
  padding: 5px 20px;
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
  outline: none;
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
.upload-panel {
  display: block;
  position: relative;
}
.upload-panel > div {
  display: flex;
  align-items: center;
  height: 40px;
}
.upload-panel > div > h5 {
  min-width: 100px;
}
.upload-name-file {
  height: 30px;
  width: 200px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  border: 0;
  font-size: 15px;
  background-color: #eaeaea;
  padding-left: 10px;
  outline: none;
}

.onshow-display {
  position: relative;
  padding-bottom: 62px;
  background-color: #fff;
}
</style>
