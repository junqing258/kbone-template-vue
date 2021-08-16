<template>
  <div>
    <div class="map"></div>
    <Panel>
      <template slot="header">
        <Notice />
        <TypeList />
      </template>
      <SelectList slot="body" />
      <template slot="footer">
        <div class="bottom-submit">
          <div></div>
          <a class="btn-submit" @click.prevent="onSubmit">立即打车</a>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Panel from './components/Panel.vue';
import Notice from './components/Notice.vue';
import TypeList from './components/TypeList.vue';
import SelectList from './components/SelectList.vue';

export default Vue.extend({
  name: 'List',
  components: {
    Notice,
    Panel,
    TypeList,
    SelectList,
  },
  created() {
    window.addEventListener('wxload', (query: any) => console.log('page2 wxload', query));
    window.addEventListener('wxshow', () => console.log('page2 wxshow'));
    window.addEventListener('wxready', () => console.log('page2 wxready'));
    window.addEventListener('wxhide', () => console.log('page2 wxhide'));
    window.addEventListener('wxunload', () => console.log('page2 wxunload'));
  },
  methods: {
    onClickJump() {
      window.location.href = '/home';
    },
    onSubmit() {
      console.log('立即打车');
    },
  },
});
</script>

<style lang="less">
.bottom-submit {
  position: relative;
  width: 100vw;
  box-shadow: 0px -3px 10px 0px rgb(187 187 187 / 28%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 11vw;
  width: 80%;
  border-radius: 999999px;
  flex-direction: column;
  background: rgb(6, 197, 132);
  color: #fff;
  margin: auto;
  margin-top: auto;
}
</style>
