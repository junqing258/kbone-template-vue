<template>
  <div>
    <div class="map"></div>
    <Panel :loading="loaded === false">
      <div class="header" slot="header">
        <div class="notice" @click.prevent="onNoticeClick"></div>
        <div class="car-types preset-scroll no-scrollbar">
          <ul class="types-list">
            <li class="type-item" v-for="item in carTypes" :key="item.id" @click.prevent="onCarTypeClick(item.value)">
              {{ item.value }}
            </li>
          </ul>
        </div>
      </div>
      <div slot="body" ref="scrollRef" class="products no-scrollbar">
        <ul>
          <li class="product-item" v-for="item in products" :key="item.id" @click.prevent="onCarClick(item.value)">
            {{ item.value }}
          </li>
        </ul>
      </div>
      <div slot="footer" class="bottom-submit">
        <div></div>
        <a class="btn-submit" @click.prevent="onSubmit">立即打车</a>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import Panel from './components/Panel.vue';
import { defineComponent, ref } from '@vue/composition-api';
import { useProductsInquiry } from './composable/useProductsInquiry';
import { useOnScroll } from 'vue-composable';

export default defineComponent({
  name: 'List',
  setup: () => {
    const { products, carTypes, switchSelectedCarType } = useProductsInquiry();
    const scrollRef = ref(null);
    const { scrollTop } = useOnScroll(scrollRef);

    return {
      scrollRef,
      loaded: false,
      scrollTop,
      products,
      carTypes,
      switchSelectedCarType,
    };
  },
  components: {
    Panel,
  },
  watch: {
    scrollTop(val) {
      console.log('========== scrollTop ==========', val);
    },
    products(val) {
      if (val) {
        if (this.loaded === false) this.loaded = true;
      }
    },
  },
  methods: {
    onNoticeClick() {
      alert('公告');
    },
    onCarTypeClick(val) {
      this.switchSelectedCarType(val, true);
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
  created() {
    window.addEventListener('wxload', (query: any) => console.log('page2 wxload', query));
    window.addEventListener('wxshow', () => console.log('page2 wxshow'));
    window.addEventListener('wxready', () => console.log('page2 wxready'));
    window.addEventListener('wxhide', () => console.log('page2 wxhide'));
    window.addEventListener('wxunload', () => console.log('page2 wxunload'));
  },
  mounted() {
    // this.timer = setInterval(actions.refreshCarList, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
});
</script>

<style lang="less">
.no-scrollbar {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
    &-track-piece {
      width: 0;
      height: 0;
      background-color: transparent;
    }

    &-thumb {
      width: 0;
      height: 0;
      background-color: transparent;
      cursor: pointer;
      &:hover {
        background-color: transparent;
      }
    }
  }
}
.panel {
  // position: relative;
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
  border-radius: 20px 20px 0 0;
  background: #06c584;
  position: relative;
  &::after {
    content: ' ';
    position: absolute;
    display: block;
    width: 100%;
    height: 5vw;
    bottom: -4vw;
    left: 0;
    background: #06c584;
  }
}

.car-types {
  position: relative;
  width: 100vw;
  background: #f1f2f7;
  border-radius: 2.5vw 2.5vw 0 0;
  padding: 0;
  overflow-x: scroll;
  > ul {
    width: fit-content;
    white-space: nowrap;
    > li.type-item {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background: rgb(209, 219, 234);
      margin: 0 2px;
      width: 120px;
      height: 90px;
    }
  }
}
.products {
  overflow: scroll;
  height: 100%;
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
  box-shadow: 0px -3px 10px 0px rgba(187, 187, 187, 0.28);
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
  margin: 30px auto;
}
</style>
