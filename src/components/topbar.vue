<template>
  <div class="topbar-div">
    <div>
      <p>USERNAME</p>
      <select>
        <option>Profile</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "topbar"
};
</script>

<style scoped>
.topbar-div {
  background-color: grey;
  max-height: 50px;
  display: flex;
  justify-content: flex-end;
}
</style>
