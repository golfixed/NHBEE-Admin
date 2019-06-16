<template>
  <div class="isdesktop">
    <div class="box">
      <div class="searchbox-div">
        <p class="section-title">ค้นหาโพสต์</p>
        <div class="form-set">
          <p class="form-set-label">ค้นหาด้วยชื่อ</p>
          <input class="form-set-input" type="type">
        </div>
        <div class="form-set">
          <p class="form-set-label">ประเภท</p>
          <input class="form-set-input" type="type">
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th style="width:25%">วันที่</th>
              <th style="width:80%">ชื่อ</th>
              <th style="width:15%">แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12-03-2019</td>
              <td>Honeybees have a noontime break from their dancing activity</td>
              <td>
                <button>
                  <i class="fas fa-edit"/>
                </button>
              </td>
            </tr>
            <tr>
              <td>12-03-2019</td>
              <td>Honeybees have a noontime break from their dancing activity</td>
              <td>
                <button>
                  <i class="fas fa-edit"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.section-title {
  font-size: 20px;
}
.searchbox-div {
  border: solid #aaaaaa;
  border-width: 0 0 1px 0;
}
.form-set {
  display: flex;
  align-items: center;
  margin: 15px 0;
}
.form-set-label {
  width: 150px;
  color: rgb(41, 41, 41);
}
.form-set-input {
  width: 100%;
  min-height: 30px;
  border-radius: 5px;
  border: 1px solid #aaaaaa;
}
</style>
