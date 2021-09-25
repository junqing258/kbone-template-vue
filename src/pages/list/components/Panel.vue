<template>
  <div class="wrap" ref="wrapRef">
    <div
      class="panel"
      :class="[easing ? 'easing' : '']"
      :style="{ transform: `translate(0, ${top}px)` }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <van-skeleton v-if="loading" title :row="5" />
      <template v-else>
        <div class="panel-header">
          <slot name="header" />
        </div>
        <div class="panel-body">
          <slot name="body" />
        </div>
      </template>
    </div>
    <div class="panel-footer">
      <slot name="footer" />
      <div class="panel-footer-placeholder"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { debounce } from '@/utils/util';

export default defineComponent({
  name: 'DrawerPanel',
  props: {
    loading: Boolean,
  },
  setup: () => {
    return {
      partitions: [0],
      top: window.innerHeight * 0.3,
      mode: 1,
      easing: false,
    };
  },
  methods: {
    setMode(val) {
      this.mode = val;
      this.setTop(this.partitions[val]);
    },
    setTop(top) {
      const dom: HTMLDivElement = this.$refs.wrapRef.querySelector('.panel');
      const distance = this.top - top;
      dom.style.transitionDuration = this.easing ? `${Math.abs(distance * 2)}ms` : '0ms';
      dom.style.transitionTimingFunction = this.easing ? 'cubic-bezier(0.16, 1, 0.3, 1)' : null;

      this.top = top;
    },
    touchStart(e) {
      this.easing = false;
      this.isPreventDefault = this.mode !== 0;
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.startTarget = e.target;

      if (this.checkIneffective(e)) {
        e.preventDefault();
      }
    },
    touchMove(e) {
      if (this.easing) return;
      if (this.checkIneffective(e)) return;

      if (typeof this.startY !== 'number') {
        this.startY = e.changedTouches[0].pageY;
      }

      const offsetY = e.changedTouches[0].pageY - this.startY;
      const top = this.top + offsetY;
      if (top >= this.partitions[0] && top <= this.partitions[this.partitions.length - 1]) {
        // e.preventDefault();
        console.log('===', top);
        this.setTop(top);
      }
    },
    touchEnd(e) {
      if (this.easing) return;
      this.easing = true;

      if (this.checkIneffective(e)) return;

      const offsetY = e.changedTouches[0].pageY - this.startY;
      const isUp = offsetY < 0;
      const isDown = offsetY > 0;

      if (Math.abs(offsetY) <= 50 && Math.abs(offsetY) > 0) {
        this.setMode(this.mode);
        return;
      }

      if (isDown && this.mode < this.partitions.length - 1) {
        e.preventDefault();
        const n = this.partitions.findIndex((v) => v > this.top);
        setTimeout(() => {
          this.setMode(n);
        });
      } else if (isUp && this.mode > 0) {
        e.preventDefault();
        const n = [...this.partitions].reverse().findIndex((v) => v < this.top);
        setTimeout(() => {
          this.setMode(this.partitions.length - 1 - n);
        });
      }
    },
    /**
     * class="preset-scroll"直接穿透到内部，执行系统默认滑动事件
     */
    checkPreset(e) {
      const presetScrolls = this.$refs.wrapRef.querySelectorAll('.preset-scroll');
      if (presetScrolls && presetScrolls.length > 0) {
        for (var ele of presetScrolls) {
          if (ele.contains(e.target) /* && (!this.startTarget || ele.contains(this.startTarget)) */) return true;
        }
      }
    },
    /**
     * 在内部list滑动，执行系统默认滑动事件
     */
    checkIneffective(e) {
      const offsetY = e.changedTouches[0].pageY - this.startY;
      const isDown = offsetY > 0;

      const scrollListEle = this.$refs.wrapRef.querySelector('.panel-body');
      const isInScroll = scrollListEle.contains(this.startTarget) && scrollListEle.contains(e.target);
      return this.isPreventDefault === false && isInScroll && isDown && !this.isScrollToTop(scrollListEle);
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
      const gHeight = document.documentElement.clientHeight;
      const header = this.$refs.wrapRef.querySelector('.panel-header');
      const footer = this.$refs.wrapRef.querySelector('.panel-footer');
      const body = this.$refs.wrapRef.querySelector('.panel-body');
      const headerHeight = header ? header.offsetHeight : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      body.style.height = gHeight - headerHeight - footerHeight + 'px';
      this.partitions = [0, gHeight * 0.3, gHeight - headerHeight - footerHeight + 50];
    },
  },
  created() {
    this.refreshSizeAndMode = debounce((m) => {
      this.refreshSize();
      this.setMode(Number.isInteger(m) ? m : this.mode);
    }, 300);
  },
  mounted() {
    window.addEventListener('resize', this.refreshSizeAndMode);
    const panel = this.$refs.wrapRef.querySelector('.panel');
    this.observer = new MutationObserver(this.refreshSizeAndMode);
    this.observer.observe(panel, { childList: true, subtree: true });
    // this.refreshSizeAndMode(1);
  },
  beforeDestroy() {
    this.observer && this.observer.disconnect();
    window.removeEventListener('resize', this.refreshSizeAndMode);
  },
});
</script>

<style lang="less">
.wrap {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.panel {
  position: fixed;
  width: 100vw;
  background: #f1f2f7;
  border-radius: 20px 20px 0 0;
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
  /* px-to-viewport-ignore-next */
  bottom: -50px;
  .panel-footer-placeholder {
    width: 100%;
    /* px-to-viewport-ignore-next */
    height: 100px;
  }
}
.panel-body {
  width: 100%;
  flex-grow: 1;
}

.van-skeleton {
  position: relative;
  top: 20vw;
}
.van-skeleton__row,
.van-skeleton__title {
  height: 5vw;
  background-color: #06c584;
}
</style>
