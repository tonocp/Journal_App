<template>
  <div class="d-flex justify-content-center">
    <h1 class="align-self-center">No hay entrada seleccionada</h1>
  </div>

  <Fab @on:click="createEntry" />
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  name: "NoEntrySelected",

  components: {
    Fab: defineAsyncComponent(() => import("../components/Fab.vue")),
  },

  methods: {
    createEntry() {
      this.$router.push({ name: "entry", params: { id: "new" } });
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  height: 100%;
}
</style>
