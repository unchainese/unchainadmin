<template>
  <el-button :title="title" @click="$router.go(-1)" @keyup.esc="$router.go(-1)">Go Back</el-button>
</template>

<script>
export default {
  name: "GoBackBtn",
  props: ['title']
}
</script>

<style scoped>

</style>