<template>
  <div ref="wrapRef">
    <div
      class="panel"
      :class="[easing ? 'easing' : '']"
      ref="panelRef"
      @touchstart.capture="touchStart"
      @touchmove.capture="touchMove"
      @touchend.capture="touchEnd"
    >
      <div class="panel-header">
        <slot name="header" />
      </div>
      <div class="panel-body">
        <slot name="body" />
      </div>
    </div>
    <div class="panel-footer">
      <slot name="footer" />
      <div class="panel-footer-placeholder"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { throttle } from '@/utils/util';

export default Vue.extend({
  name: 'DrawerPanel',
  data: () => ({
    partitions: [0],
    mode: null,
    easing: false,
  }),
  methods: {
    setMode(val) {
      this.mode = val;
      this.setTop(this.partitions[val]);
    },
    setTop(top) {
      const dom: HTMLDivElement = this.$refs.panelRef;
      dom.style.transform = `translateY(${top}px)`;
      if (this.easing) {
        const distance = this.top - top;
        dom.style.transitionDuration = `${Math.abs(distance)}ms`;
        dom.style.transitionTimingFunction =
          distance < 0 ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      } else {
        dom.style.transitionDuration = null;
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
      this.startTop = this.top;
    },
    /**
     * 在内部list滑动，走系统默认滑动事件
     */
    checkIneffective(e) {
      const offsetY = e.changedTouches[0].pageY - this.startY;
      const isDown = offsetY > 0;

      const scrollListEle = this.$refs.wrapRef.querySelector('.panel-body');
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      return isInScroll && this.isPreventDefault === false && isDown && !this.isScrollToTop(scrollListEle);
    },
    touchMove(e) {
      if (this.checkIneffective(e)) return;

      const moveY = e.changedTouches[0].pageY;
      this.offsetY = moveY - this.startY;
      const top = this.startTop + this.offsetY;

      if (top > this.partitions[0] && top < this.partitions[this.partitions.length - 1]) {
        e.stopPropagation();
        this.setTop(top);
      }
    },
    touchEnd(e) {
      this.easing = true;
      if (this.checkIneffective(e)) return;

      const offsetY = e.changedTouches[0].pageY - this.startY;
      const isUp = offsetY < 0;
      const isDown = offsetY > 0;

      if (Math.abs(offsetY) <= 5) {
        e.stopPropagation();
        return;
      }

      if (isDown && this.mode < this.partitions.length - 1) {
        e.stopPropagation();
        setTimeout(() => {
          const n = this.partitions.findIndex((v) => v > this.top);
          this.setMode(n);
        });
      } else if (isUp && this.mode > 0) {
        e.stopPropagation();
        setTimeout(() => {
          const n = [...this.partitions].reverse().findIndex((v) => v < this.top);
          this.setMode(this.partitions.length - 1 - n);
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
    /**
     * 设置panel的三段高度
     */
    refreshSize() {
      const header = this.$refs.wrapRef.querySelector('.panel-header');
      const footer = this.$refs.wrapRef.querySelector('.panel-footer');
      const headerHeight = header ? header.offsetHeight : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      this.partitions = [0, window.innerHeight * 0.3, window.innerHeight - headerHeight - footerHeight + 50];
    },
  },
  created() {
    this.throttleRefreshSize = throttle(
      () => {
        this.refreshSize();
        this.setMode(this.mode);
      },
      300,
      this,
    );
  },
  mounted() {
    //https://cloud.tencent.com/developer/article/1528620
    /* this.observer = new MutationObserver((mutationsList, observer) => {
      this.refreshSize();
    });
    this.observer.observe(this.$refs.panelRef, { childList: true, subtree: true }); */
    window.addEventListener('resize', this.throttleRefreshSize);
    this.refreshSize();
    this.setMode(1);
  },
  beforeDestroy() {
    // this.observer && this.observer.disconnect();
    window.removeEventListener('resize', this.throttleRefreshSize);
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
    transition-property: transform;
  }
}

.panel-header {
  display: block;
}

.panel-footer {
  position: fixed;
  background: #fff;
  bottom: -50px;
  .panel-footer-placeholder {
    width: 100%;
    height: 100px;
  }
}

.panel-body {
  width: 100%;
  flex-grow: 1;
  overflow: scroll;
}
</style>
