<!--
 * @Author: junqing.zhang
 * @Date: 2021-08-07 11:31:31
 * @LastEditors: junqing.zhang
 * @LastEditTime: 2021-08-07 17:16:33
 * @Description: 
-->
<template>
  <div class="cnt">
    <!-- <Header></Header> -->
    <!-- <a href="/home">回到首页</a> -->
    <!-- <button @click="onClickJump">回到首页</button> -->
    <div class="map"></div>
    <SelectCar />
    <!-- <Footer></Footer> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/common/Header.vue'
import Footer from '@/common/Footer.vue'
import SelectCar from './SelectCar.vue'

export default Vue.extend({
  name: 'List',
  components: {
    Header,
    Footer,
    SelectCar,
  },
  created() {
    window.addEventListener('wxload', (query: any) =>
      console.log('page2 wxload', query)
    )
    window.addEventListener('wxshow', () => console.log('page2 wxshow'))
    window.addEventListener('wxready', () => console.log('page2 wxready'))
    window.addEventListener('wxhide', () => console.log('page2 wxhide'))
    window.addEventListener('wxunload', () => console.log('page2 wxunload'))
  },
  methods: {
    onClickJump() {
      window.location.href = '/home'
    },
  },
})
</script>

<style lang="less">

a,
button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
