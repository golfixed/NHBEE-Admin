<template>
  <div class="isdesktop">
    <div class="toolbar-panel-bg" style="margin-bottom: 20px;">
      <h1 class="tab-headtext">งานวิจัย</h1>
      <div class="post-toolbar">
        <div class="toolbar-button toolbar-button-white" @click="ftSearch();">
          <span>รีเฟรช</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
        <div class="toolbar-button toolbar-button-white" @click="newResearch();">
          <span>งานวิจัยใหม่</span>
          <i class="fas fa-plus toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="research-view">
      <div class="searchbox-div" v-if="dataList.length > 0 || isSearch == true">
        <div class="form-set">
          <p class="form-set-label">ค้นหาด้วยชื่อ</p>
          <input v-model="search" class="form-set-input" type="text" @keypress.enter="getResearch" />
        </div>
        <i class="fas fa-search" v-if="search == ''"></i>
        <i class="fas fa-times" v-on:click="clearSearch(); " v-if="search != ''"></i>
      </div>
      <div class="no-result" v-if="dataList.length <= 0">
        <div
          class="no-inner-box"
          v-if="dataList.length <= 0 && isLoading == false && isSearch == true"
        >
          <div>
            <h3>ไม่พบผลลัพธ์</h3>
            <h4>โปรดลองใช้คำค้นหาอื่น</h4>
          </div>
        </div>
        <div
          class="no-inner-box"
          v-if="isLoading == false && dataList.length <= 0 && isSearch == false"
        >
          <div>
            <h3>ยังไม่มีงานวิจัยในระบบ</h3>
            <h4>
              คลิก รายการงานวิจัยใหม่
              <i
                class="fas fa-edit toolbar-btn-icon"
                style="margin:0 5px 0 5px;"
              ></i>เพื่อเริ่มสร้างรายการใหม่
            </h4>
          </div>
        </div>
        <div class="no-inner-box" v-if="isLoading == true">
          <div>
            <h3>กำลังโหลด</h3>
            <h4>โปรดรอสักครู่</h4>
          </div>
        </div>
      </div>
      <div v-if="dataList.length > 0 && isLoading == false">
        <table style="width: 100%;">
          <thead>
            <tr style="height:30px;">
              <th width="88%" style="color:#808080;">ชื่อ</th>
              <th width="6%" style="color:#808080;">แก้ไข</th>
              <th width="6%" style="color:#808080;">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(research, index) in dataList"
              :key="'research_' + research.id"
              class="research-list"
            >
              <td>
                <div class="research-list-title">{{ research.th.title }} ({{ research.en.title }})</div>
              </td>
              <td style="text-align:center;align-items:center;">
                <button @click="editResearch(research.id)">
                  <i class="fas fa-edit" />
                </button>
              </td>
              <td style="text-align:center;align-items:center;">
                <button @click="deleteResearch(index)">
                  <i class="fas fa-trash" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="research-pagination" style="margin-top: 20px;">
          <button
            class="pagination-btn prev-btn"
            v-if="this.page.now != 1"
            @click="changePage('previous');"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
          <button
            class="pagination-btn next-btn"
            v-if="this.page.now != this.page.all"
            @click="changePage('next');"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="popup-mask" v-if="isOpenNewPost === true" v-on:click="newPostClose();"></div>
    <div class="popup-window" v-if="isOpenNewPost === true">
      <research-editor :newPostClose="newPostClose" :researchId="researchId" />
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";
import layout_default from "@/layouts/main.vue";
import ResearchEditor from "@/components/ResearchEditor.vue";

export default {
  name: "research",
  components: {
    ResearchEditor
  },
  data() {
    return {
      dataList: [],
      isLoading: false,
      search: "",
      limit: 10,
      isOpenNewPost: false,
      page: {
        now: 1,
        all: 0
      },
      researchId: null,
      isSearch: false
    };
  },
  created() {
    // this.getResearch();
    this.ftSearch();
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    clearSearch: function() {
      this.search = "";
      this.getResearch();
      this.isLoading = true;
    },
    ftSearch(page = 1) {
      this.isSearch = false;
      if (this.isLoading) return "";
      this.isLoading = true;
      axios(`/admin/research?limit=${this.limit}&page=${page}&q=${this.search}`)
        .then(response => {
          const data = response.data;
          this.dataList = data.research.data;
          this.page = data.page;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get research", error.response.data.error);
          else console.error("get research", error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getResearch(page = 1) {
      if (this.isLoading) return "";
      this.isLoading = true;
      axios(`/admin/research?limit=${this.limit}&page=${page}&q=${this.search}`)
        .then(response => {
          const data = response.data;
          this.dataList = data.research.data;
          this.page = data.page;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get research", error.response.data.error);
          else console.error("get research", error.message);
        })
        .finally(() => {
          this.isLoading = false;
          this.isSearch = true;
        });
    },
    editResearch(id) {
      this.researchId = id;
      this.newPostOpen();
    },
    newResearch() {
      this.researchId = null;
      this.newPostOpen();
    },
    newPostOpen: function() {
      this.isOpenNewPost = true;
    },
    newPostClose: function() {
      this.isOpenNewPost = false;
    },
    changePage: function(direction) {
      if (direction === "previous") {
        if (this.page.now > 1 && this.page.now <= this.page.all) {
          this.getResearch(this.page.now - 1);
        }
      } else if (direction === "next") {
        if (this.page.now < this.page.all) {
          this.getResearch(this.page.now + 1);
        }
      } else {
        this.page.now = 1;
      }
    },
    deleteResearch: function(index = -1) {
      if (!this.dataList[index]) return "";
      if (confirm(`ยืนยันการลบงานวิจัยนี้?`)) {
        axios({
          method: "post",
          url: `/admin/research/${this.dataList[index].id}/delete`
        })
          .then(() => {
            this.dataList.splice(index, 1);
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("patch news", error.response.data.error);
            else console.error("patch news", error.message);
          });
      }
    }
  }
};
</script>

<style>
.no-result > div.no-inner-box > div {
  text-align: center;
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
.research-list-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-right: 10px;
}
.research-list {
  transition: all 0.1s;
  height: 40px;
}
.research-list:hover {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
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
.research-pagination {
  grid-column: span 5;
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.pagination-current {
  padding: 0 20px;
}

.research-view {
  background-color: #ffffff;
  border-width: 1px;
  border-radius: 10px;
  padding: 20px;
}
.section-title {
  font-size: 20px;
}
.searchbox-div {
  border: solid #aaaaaa;
  border-width: 0;
  position: relative;
}
.form-set {
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;
}
.form-set-label {
  width: 150px;
  color: rgb(41, 41, 41);
}
.form-set-input {
  width: 100%;
  min-height: 30px;
  border-radius: 100px;
  border: 1px solid #e8e8e8;
  outline: none;
  padding-left: 10px;
  font-size: 14px;
}
</style>
