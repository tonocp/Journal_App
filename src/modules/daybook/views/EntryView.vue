<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold">{{ day }}</span>
        <span class="mx-1 fs-3">{{ month }}</span>
        <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
      </div>

      <div>
        <button v-if="entry.id" class="btn btn-danger mx-2" @click="onDeleteEntry">
          Borrar
          <i class="fa fa-trash-all"></i>
        </button>

        <button class="btn btn-primary">
          Subir foto
          <i class="fa fa-upload"></i>
        </button>
      </div>
    </div>

    <hr />

    <div class="d-flex flex-column px-3 h-75">
      <textarea v-model="entry.text" placeholder="¿Qué te cuentas hoy?"></textarea>
    </div>

    <img
      src="https://dearsam.com/img/600/744/resize/p/a/panoramic-landscape-70x50.jpg"
      alt="entry-picture"
      class="img-thumbnail"
    />
  </template>

  <Fab icon="fa-save" @on:click="saveEntry" />
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";
import { mapGetters, mapActions } from "vuex";
import Swal from "sweetalert2";

import getDayMonthYear from "../helpers/getDayMonthYear";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      entry: null,
      localImage: null,
      file: null,
    };
  },

  components: {
    Fab: defineAsyncComponent(() => import("../components/Fab.vue")),
  },

  methods: {
    ...mapActions("journal", ["updateEntry", "createEntry", "deleteEntry"]),

    loadEntry() {
      let entry;
      if (this.id === "new") {
        entry = {
          text: "",
          date: new Date().getTime(),
        };
      } else {
        entry = this.getEntryById(this.id);
        if (!entry) return this.$router.push({ name: "no-entry" });
      }
      this.entry = entry;
    },

    async saveEntry() {
      new Swal({
        title: "Espere por favor",
        allowOutsideClick: false,
      });
      Swal.showLoading();

      if (this.entry.id) {
        await this.updateEntry(this.entry);
      } else {
        const id = await this.createEntry(this.entry);
        this.$router.push({ name: "entry", params: { id } });
      }

      Swal.fire("Guardado!", "Entrada registrada con éxito.", "success");
    },

    async onDeleteEntry() {
      const { isConfirmed } = await Swal.fire({
        title: "¿Está seguro?",
        text: "Una vez borrado no podrá recuperar la entrada.",
        showDenyButton: true,
        confirmButtonText: "Borrar",
      });

      if (isConfirmed) {
        new Swal({
          title: "Espere por favor",
          allowOutsideClick: false,
        });
        Swal.showLoading();
        await this.deleteEntry(this.entry.id);
        this.$router.push({ name: "no-entry" });

        Swal.fire("Eliminado!", "", "success");
      }
    },
  },

  computed: {
    ...mapGetters("journal", ["getEntryById"]),

    day() {
      const { day } = getDayMonthYear(this.entry.date);
      return day;
    },

    month() {
      const { month } = getDayMonthYear(this.entry.date);
      return month;
    },

    yearDay() {
      const { yearDay } = getDayMonthYear(this.entry.date);
      return yearDay;
    },
  },

  created() {
    this.loadEntry();
  },

  watch: {
    id() {
      this.loadEntry();
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  border: none;
  height: 100%;

  &:focus {
    outline: none;
  }
}

img {
  width: 200px;
  position: fixed;
  bottom: 150px;
  right: 20px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
</style>
