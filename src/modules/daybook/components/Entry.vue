<template>
  <div class="entry-container mb-3 pointer p-2">
    <!-- Título -->
    <div class="entry-title d-flex">
      <span class="text-success fs-5 fw-bold">15</span>
      <span class="mx-1 fs-5">Diciembre</span>
      <span class="mx-2 fw-light">2021, miércoles</span>
    </div>

    <div class="entry-description">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius possimus fugiat ipsa, libero aut illo, quibusdam
      obcaecati voluptates odit, voluptatum soluta minus asperiores quis? Autem necessitatibus voluptatem officia sit
      provident.
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.entry-container {
  border-bottom: 1px solid #2c3e50;
  transition: 0.2s all ease-in;

  &:hover {
    background-color: lighten($color: grey, $amount: 45);
    transition: 0.2s all ease-in;
  }

  .entry-description {
    font-size: 12px;
  }
}
</style>
