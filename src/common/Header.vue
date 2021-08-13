<template>
  <div class="header">
    <p>{{ headerTips }} {{ input }}</p>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState(['headerTips', 'input']),
  },
  mounted(): void {
    this.FAKE_ACTION('june');
  },
  methods: {
    ...mapActions(['FAKE_ACTION']),
  },
};
</script>

<style lang="less">
.header {
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
}
</style>
