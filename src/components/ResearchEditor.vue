<template>
  <div class="inner-popup-window">
    <div class="control-tab">
      <h3 class="tab-title-popup">
        {{ saveId ? 'แก้ไขรายการงานวิจัย' : 'รายการงานวิจัยใหม่' }}
        <i
          class="fas fa-edit popup-btn-icon"
          v-if="saveId"
        ></i>
        <i class="fas fa-plus popup-btn-icon" v-if="!saveId"></i>
      </h3>
      <hr class="section-hr" style="margin: 10px 0 30px 0" />
    </div>
    <div class="popup-display">
      <div>
        <div class="thai-post-box">
          <h4>ชื่อ (ภาษาไทย)</h4>
          <input v-model="th.title" placeholder="ตัวอย่าง: ผึ้งหลวงเป็นผึ้งของไทย" />
          <h4>Title (English)</h4>
          <input v-model="en.title" placeholder="Example: How bumble bee can fly." />
        </div>
      </div>
      <div>
        <p v-if="pdfId">ไฟล์ PDF ที่เลือก</p>
        <div class="selected-pdf" v-if="pdfId">
          <p v-text="pdfFilename"></p>
          <i class="fas fa-edit" v-on:click="clearPDFSelect();"></i>
        </div>
        <p v-else>เลือกไฟล์ PDF</p>
        <select-pdf v-if="pdfId == null" v-model="pdfId" :filename.sync="pdfFilename" />
      </div>
    </div>
    <hr class="section-hr" style="margin-top: 20px;" />
    <div class="popup-btn-panel-2col">
      <div class="left-group">
        <div
          class="popup-button popup-button-cancel"
          @click="newPostClose();"
          :disabled="isLoading"
        >
          <span>ยกเลิก</span>
          <i class="fas fa-times popup-btn-icon"></i>
        </div>
      </div>
      <div class="right-group">
        <div class="popup-button popup-button-clear" @click="clearPost();" :disabled="isLoading">
          <span>ล้างทั้งหมด</span>
          <i class="fas fa-eraser popup-btn-icon"></i>
        </div>
        <div class="popup-button popup-button-submit" @click="savePost();" :disabled="isLoading">
          <span>บันทึกข้อมูล</span>
          <i class="fas fa-save popup-btn-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/axios.js";
import selectpdf from "@/components/selectpdf.vue";

export default {
  name: "research-editor",
  components: {
    "select-pdf": selectpdf
  },
  data() {
    return {
      current_tab: "th",
      th: {
        title: ""
      },
      en: {
        title: ""
      },
      pdfId: null,
      pdfFilename: "",
      saveId: null,
      isLoading: false,
      clearConfirm: false
    };
  },
  props: {
    newPostClose: Function,
    researchId: Number
  },
  created() {
    this.getPost(this.researchId);
  },
  watch: {
    researchId(value) {
      this.getPost(value);
    }
  },
  methods: {
    clearPDFSelect() {
      this.pdfId = null;
    },
    clearPost() {
      this.th = {
        title: ""
      };
      this.en = {
        title: ""
      };
      this.pdfId = null;
      this.pdfFilename = "";
      this.saveId = null;
    },
    getPost(researchId) {
      if (!researchId) return this.clearPost();
      axios
        .get(`/admin/research/${this.researchId}`)
        .then(response => {
          const data = response.data;
          this.th = data.th;
          this.en = data.en;
          this.pdfId = data.pdfId;
          this.pdfFilename = data.pdfFilename;
          this.saveId = data.id;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get research", error.response.data.error);
          else console.error("get research", error.message);
          this.clearPost();
        });
    },
    savePost() {
      if (this.isLoading) return "";
      this.isLoading = true;

      if (this.en.title == "" || this.th.title == "") {
        alert("โปรดกรอกข้อมูลให้ครบถ้วน");
      } else if (this.pdfId == null) {
        alert("โปรดเลือกไฟล์ PDF");
      } else {
        const sendData = {
          th: this.th,
          en: this.en,
          pdfId: this.pdfId
        };

        axios({
          url: `/admin/research${this.saveId ? "/" + this.saveId : ""}`,
          method: "post",
          data: sendData
        })
          .then(response => {
            this.clearPost();
            // alert('Research ID: ' + response.data.id)
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("save research", error.response.data.error);
            else console.error("save research", error.message);
          })
          .finally(() => {
            this.isLoading = false;
            alert("บันทึกข้อมูลสำเร็จ");
            this.newPostClose();
          });
      }
    }
  }
};
</script>
<style scoped>
.inner-popup-window {
  padding: 30px;
  width: 600px;
}
.thai-post-box > input {
  background-color: #f1f1f1;
  border: 0;
  width: calc(100% - 10px);
  height: 30px;
  font-size: 14px;
  margin: 5px 0 20px 0;
  padding-left: 10px;
}
.thai-post-box > input::placeholder,
.thai-post-box > input::-webkit-input-placeholder {
  padding-left: 10px;
}
.control-tab {
  display: block;
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
.selected-pdf > p {
  background-color: #f1f1f1;
  height: 32px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.selected-pdf > i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.selected-pdf > i:hover {
  color: grey;
}
.selected-pdf {
  position: relative;
}
</style>