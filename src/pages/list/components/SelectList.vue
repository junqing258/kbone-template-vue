<template>
  <ul>
    <li class="product-item" v-for="item in products" :key="item.id">
      {{ item.value }}
    </li>
  </ul>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectList',
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    setTimeout(() => {
      this.products = new Array(30).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
    }, 300);
  },
});
</script>

<style>
.product-item {
  width: 90%;
  height: 10vw;
  margin: auto;
  background: rgb(209, 219, 234);
  margin-bottom: 1vw;
  display: block;
}
</style>
