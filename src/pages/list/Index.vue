<template>
  <div>
    <div class="map"></div>
    <Panel>
      <div class="header" slot="header">
        <div class="notice" @click.capture="onNoticeClick"></div>
        <div class="car-types preset-scroll">
          <ul>
            <li
              class="product-item"
              v-for="item in carTypes"
              :key="item.id"
              @click.capture="onCarTypeClick(item.value)"
            >
              {{ item.value }}
            </li>
          </ul>
        </div>
      </div>
      <div slot="body">
        <ul>
          <li class="product-item" v-for="item in products" :key="item.id" @click.capture="onCarClick(item.value)">
            {{ item.value }}
          </li>
        </ul>
      </div>
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

export default Vue.extend({
  name: 'List',
  data: () => ({
    products: [],
    carTypes: [],
  }),
  components: {
    Panel,
  },
  created() {
    window.addEventListener('wxload', (query: any) => console.log('page2 wxload', query));
    window.addEventListener('wxshow', () => console.log('page2 wxshow'));
    window.addEventListener('wxready', () => console.log('page2 wxready'));
    window.addEventListener('wxhide', () => console.log('page2 wxhide'));
    window.addEventListener('wxunload', () => console.log('page2 wxunload'));
  },
  mounted() {
    setTimeout(() => {
      this.carTypes = new Array(7).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
      this.products = new Array(30).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
    }, 300);
  },
  methods: {
    onNoticeClick() {
      alert('公告');
    },
    onCarTypeClick(val) {
      alert('选车型' + val);
    },
    onCarClick(val) {
      alert('选车' + val);
    },
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
.panel {
  position: relative;
  background: #f1f2f7;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}
.header {
  position: relative;
}

.notice {
  width: 100%;
  height: 10vw;
  border-radius: 2.5vw 2.5vw 0 0;
  background: turquoise;
  position: relative;
  &::after {
    content: ' ';
    position: absolute;
    display: block;
    width: 100%;
    height: 5vw;
    bottom: -4vw;
    left: 0;
    background: turquoise;
  }
}

.car-types {
  position: relative;
  width: 100vw;
  height: 12vw;
  background: #f1f2f7;
  border-radius: 2.5vw 2.5vw 0 0;
  overflow-x: scroll;
  > ul {
    width: fit-content;
    white-space: nowrap;
    > li {
      display: inline-block;
      width: 20vw;
    }
  }
}

.product-item {
  width: 90%;
  height: 10vw;
  margin: auto;
  background: rgb(209, 219, 234);
  margin-bottom: 1vw;
  display: block;
}

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
