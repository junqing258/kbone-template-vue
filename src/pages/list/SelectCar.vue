<template>
  <div
    class="select-car"
    :class="[easing ? 'easing' : '']"
    ref="selectCarRef"
    @touchstart.capture="touchStart"
    @touchmove.capture="touchMove"
    @touchend.capture="touchEnd"
  >
    <div class="select-header"></div>
    <div class="scroll-list" ref="scrollListRef">
      <div class="scroll-content">
        <div class="product-item" v-for="item in products" :key="item.id">
          {{ item.value }}
        </div>
      </div>
    </div>
    <div class="select-footer"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectCar',
  data: () => ({
    zones: [0],
    mode: null,
    products: [],
    easing: false,
  }),
  methods: {
    setMode(val) {
      this.mode = val;
      const top = this.zones[val];
      const distance = this.top - top;
      Object.assign(this.$refs.selectCarRef.style, {
        top: `${top}px`,
        transitionDuration: `${Math.abs(distance)}ms`,
      });
    },
    touchStart(e) {
      this.easing = false;
      this.$refs.selectCarRef.style.transitionDuration = null;
      this.prevented = this.mode === 2;
      if (this.prevented) {
        e.preventDefault();
      }
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.startTarget = e.target;
      this.startTop = Number(this.$refs.selectCarRef.style.top.replace(/[a-z]+/i, ''));
    },
    touchMove(e) {
      const moveX = e.changedTouches[0].pageX;
      const moveY = e.changedTouches[0].pageY;
      this.offsetY = moveY - this.startY;
      this.top = this.startTop + this.offsetY;
      const scrollListEle = this.$refs.scrollListRef;
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      if (isInScroll && this.prevented === false) return;

      if (this.top > this.zones[0] && this.top < this.zones[this.zones.length - 1]) {
        this.$refs.selectCarRef.style.top = `${this.top}px`;
      }
    },
    touchEnd(e) {
      this.easing = true;

      const endX = e.changedTouches[0].pageX;
      const endY = e.changedTouches[0].pageY;
      const offsetY = endY - this.startY;

      const scrollListEle = this.$refs.scrollListRef;
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      const isUp = offsetY < 0;
      const isDown = offsetY > 0;

      if (isInScroll && this.prevented === false) {
        if (isUp && !this.isScrollToBottom(scrollListEle)) return;
        if (isDown && !this.isScrollToTop(scrollListEle)) return;
      }

      if (Math.abs(offsetY) <= 5) return;

      if (isDown && this.mode < this.zones.length - 1) {
        e.stopPropagation();
        setTimeout(() => {
          const n = this.zones.findIndex((v) => v > this.top);
          this.setMode(n);
        });
      } else if (isUp && this.mode > 0) {
        e.stopPropagation();
        setTimeout(() => {
          const n = [...this.zones].reverse().findIndex((v) => v < this.top);
          this.setMode(this.zones.length - 1 - n);
        });
      }
    },
    isScrollToTop(dom) {
      const d = dom.scrollTop <= 1;
      return d;
    },
    isScrollToBottom(dom) {
      const d = dom.scrollHeight - dom.scrollTop - dom.clientHeight <= 1;
      return d;
    },
  },
  mounted() {
    this.zones = [0, window.innerHeight * 0.5, window.innerHeight - this.$refs.selectCarRef.children[0].offsetHeight];
    this.setMode(1);

    const len = 30;
    this.products = new Array(len).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
});
</script>

<style lang="less">
.select-car {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #f1f2f7;
  border-radius: 2.5vw 2.5vw 0 0;
  padding-bottom: 2px;
  bottom: -2px;
  &.easing {
    transition: top 300ms ease-in-out;
  }
}

.select-header {
  background: #06c584;
  width: 100%;
  height: 10vw;
  border-radius: inherit;
}

.select-footer {
  background: #fff;
  width: 100%;
  height: 10vw;
  position: absolute;
  bottom: 0;
}

.scroll-list {
  width: 90%;
  max-height: 100%;
  margin: auto;
  overflow-y: scroll;
  .scroll-content {
    display: block;
    width: 100%;
    height: fit-content;
  }
}

.product-item {
  width: 100%;
  height: 10vw;
  background: rgb(196, 75, 75);
  margin-bottom: 1vw;
  display: block;
}
</style>
