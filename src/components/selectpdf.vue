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
              @keypress.enter="getPdf(1)"
            />
          </div>
          <i class="fas fa-search" v-if="search == ''"></i>
          <i class="fas fa-times" v-on:click="clearSearch()" v-if="search != ''"></i>
        </div>
      </div>
      <div class="loading-section" v-if="pdfList.length <= 0">
        <p v-if="isLoading == true">กำลังโหลดรายการ</p>
        <p v-if="isLoading == false">ไม่พบผลลัพธ์</p>
      </div>
      <div style="height: 130px;" v-if="pdfList.length > 0">
        <table class="table-header">
          <tr class="table-head">
            <th>ID</th>
            <th>ชื่อไฟล์</th>
            <th>อัปโหลดวันที่</th>
          </tr>
          <tr
            v-for="(pdf, i) in pdfList"
            :key="'pdf_' + i"
            @click="savePdf(i)"
            :disabled="!(selectedIndex >= 0 && selectedIndex < pdfList.length)"
          >
            <td>{{pdf.id}}</td>
            <td>{{pdf.filename}}</td>
            <td>{{pdf.date}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";

export default {
  name: "select-pdf",
  props: ["pdfId", "filename"],
  model: {
    prop: "pdfId",
    event: "selected"
  },
  created() {
    this.getPdf(1);
  },
  data() {
    return {
      selectedIndex: null,
      search: "",
      pdfName: "",
      page: {
        now: 1,
        all: 0
      },
      limit: 3,
      pdfList: [],
      isLoading: false
    };
  },
  methods: {
    getPdf(page = 1) {
      this.isLoading = true;
      axios
        .get(
          `/admin/pdf?page=${page}&limit=${this.limit}${
            this.search ? `&q=${this.search}` : ""
          }`
        )
        .then(response => {
          this.page = response.data.page;
          this.pdfList = response.data.file.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get file list", error.response.data.error);
          else console.error("get file list", error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    savePdf(i) {
      this.selectedIndex = i;
      const pdf = this.pdfList[this.selectedIndex];
      this.$emit("update:filename", pdf.filename);
      this.$emit("selected", pdf.id);
      this.selectedIndex = null;
      this.search = "";
      this.pdfList = [];
    },
    clearSearch() {
      this.selectedIndex = null;
      this.search = "";
      this.pdfName = "";
      this.page = {
        now: 1,
        all: 0
      };
      this.pdfList = [];
      this.getPdf(1);
    }
  }
};
</script>

<style scoped>
.loading-section {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  color: #aaaaaa;
}
.redText {
  color: red;
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
.table-header {
  width: 100%;
}
table > tr {
  height: 30px;
}
table > tr > th {
  font-size: 14px;
  color: grey;
}
table > tr:hover {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.table-head:hover {
  box-shadow: none;
  cursor: default;
}
.table-head {
  text-align: left;
}
.form-set {
  margin-bottom: 10px;
}
</style>