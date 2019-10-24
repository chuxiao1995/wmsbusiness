<template>
  <router-view style="height:100%;" />
</template>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {
      ops: {}
    };
  }
};
</script>

<style lang="scss">
@import "./style/main.scss";
</style>
