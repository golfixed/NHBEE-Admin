<template>
  <div class="box-bg">
    <div class="window">
      <h1>Upload File</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "uploadfile"
};
</script>

<style scoped>
.box-bg {
  position: absolute;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000075;
}
.window {
  position: absolute;
  width: 1000px;
  height: 630px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}
</style>