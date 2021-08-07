<template>
  <div
    class="select-car"
    :class="posCodes[posIndex]"
    @touchstart.capture="touchStart"
    @touchend.capture="touchEnd"
    @touchmove.capture="touchMove"
  >
    <div class="select-header"></div>
    <div class="scroll-list" ref="scrollListRef">
      <div class="scroll-content">
        <div class="product-item" v-for="(item, index) in products" :key="item">
          {{ index }}
        </div>
      </div>
    </div>
    <div class="select-footer"></div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectCar',
  data: () => ({
    posCodes: ['high', 'middle', 'low'],
    posIndex: 1,
    products: new Array(50).map((_, i) => i + 1),
  }),
  watch: {
    posIndex(val) {},
  },
  methods: {
    touchStart(e) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.startTarget = e.target;
    },
    touchMove(e) {
      const moveX = e.changedTouches[0].pageX;
      const moveY = e.changedTouches[0].pageY;
      const offsetY = moveY - this.startY;
      if (this.posIndex === 2) {
        e.stopPropagation();
      }
    },
    touchEnd(e) {
      const endX = e.changedTouches[0].pageX;
      const endY = e.changedTouches[0].pageY;
      this.endTarget = e.target;
      const offsetY = endY - this.startY;

      const scrollListEle = this.$refs.scrollListRef;

      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(this.endTarget);
      const isUp = offsetY < 0;
      const isDown = offsetY > 0;

      if (isInScroll) {
        if (isUp && !this.isScrollToBottom(scrollListEle)) return;
        if (isDown && !this.isScrollToTop(scrollListEle)) return;
      }

      if (Math.abs(offsetY) <= 5) return;

      if (isDown && this.posIndex < this.posCodes.length - 1) {
        e.stopPropagation();
        this.posIndex = this.posIndex + 1;
      } else if (isUp && this.posIndex > 0) {
        e.stopPropagation();
        this.posIndex = this.posIndex - 1;
      }
    },
    isScrollToTop(dom) {
      const d = dom.scrollTop <= 1;
      return d;
    },
    isScrollToBottom(dom) {
      const d = parseInt(dom.scrollHeight - dom.scrollTop - dom.clientHeight) <= 1;
      return d;
    },
  },
});
</script>

<style lang="less">
.select-car {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #f1f2f7;
  transition: all 300ms ease-in-out;
  border-radius: 2.5vw 2.5vw 0 0;
  padding-bottom: -2px;
  bottom: -2px;
  &.high {
    height: 100vh;
  }
  &.middle {
    height: 50vh;
  }
  &.low {
    height: 20vh;
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
