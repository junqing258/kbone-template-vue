<template>
  <div class="warp">
    <div
      class="panel"
      :class="[easing ? 'easing' : '']"
      ref="selectCarRef"
      @touchstart.capture="touchStart"
      @touchmove.capture="touchMove"
      @touchend.capture="touchEnd"
    >
      <div class="select-header" ref="selectHeaderRef">
        <slot name="select-header" />
      </div>
      <div class="select-body" ref="scrollListRef">
        <slot name="select-body" />
      </div>
    </div>
    <div class="select-footer" ref="selectFooterRef">
      <slot name="select-footer" />
      <div class="select-footer-placeholder"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectCarPanel',
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
      this.setTop(top);
    },
    setTop(top) {
      this.$refs.selectCarRef.style.top = `${top}px`;
      if (this.easing) {
        const distance = this.top - top;
        this.$refs.selectCarRef.style.transitionDuration = `${Math.abs(distance)}ms`;
      } else {
        this.$refs.selectCarRef.style.transitionDuration = null;
      }

      this.top = top;
    },
    touchStart(e) {
      this.isPreventDefault = this.mode !== 0;
      if (this.isPreventDefault) {
        e.preventDefault();
      }
      this.easing = false;
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.startTarget = e.target;
      this.startTop = Number(this.$refs.selectCarRef.style.top.replace(/[a-z]+/i, ''));
    },
    touchMove(e) {
      const moveY = e.changedTouches[0].pageY;
      this.offsetY = moveY - this.startY;
      const top = this.startTop + this.offsetY;

      const scrollListEle = this.$refs.scrollListRef;
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      if (isInScroll && this.isPreventDefault === false) return;

      if (top > this.zones[0] && top < this.zones[this.zones.length - 1]) {
        e.preventDefault();
        this.setTop(top);
      }
    },
    touchEnd(e) {
      this.easing = true;

      const endY = e.changedTouches[0].pageY;
      const offsetY = endY - this.startY;
      const isUp = offsetY < 0;
      const isDown = offsetY > 0;

      const scrollListEle = this.$refs.scrollListRef;
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      if (isInScroll && this.isPreventDefault === false) return;
      // const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      // if (isInScroll && this.isPreventDefault === false) {
      //   if (isUp && !this.isScrollToBottom(scrollListEle)) return;
      //   if (isDown && !this.isScrollToTop(scrollListEle)) return;
      // }

      if (Math.abs(offsetY) <= 5) return;

      if (isDown && this.mode < this.zones.length - 1) {
        e.preventDefault();
        setTimeout(() => {
          const n = this.zones.findIndex((v) => v > this.top);
          this.setMode(n);
        });
      } else if (isUp && this.mode > 0) {
        e.preventDefault();
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
    refreshSize() {
      const hHeight = this.$refs.selectHeaderRef.offsetHeight;
      const fHeight = this.$refs.selectFooterRef.children[0].offsetHeight;
      this.zones = [0, window.innerHeight * 0.4, window.innerHeight - hHeight - fHeight];
    },
  },
  mounted() {
    this.refreshSize();
    this.setMode(1);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
});
</script>

<style lang="less">
.panel {
  position: fixed;
  width: 100vw;
  background: #f1f2f7;
  border-radius: 2.5vw 2.5vw 0 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  &.easing {
    transition: top 300ms ease-in-out;
  }
}

.select-header {
  display: block;
}

.select-footer {
  position: fixed;
  background: #fff;
  bottom: -50px;
}
.select-footer-placeholder {
  width: 100%;
  height: 50px;
}

.select-body {
  width: 100%;
  flex-grow: 1;
  overflow: scroll;
}
</style>
