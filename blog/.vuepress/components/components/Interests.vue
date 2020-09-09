<template>
  <div id="interests">
    <div v-for="(item, idx) in labels" :key="item">
      <i class="icon" :class="icons[idx]"></i>
      {{item}}
    </div>
  </div>
</template>

<script>
export default {
  name: "interests",
  props: ["lang"],
  data() {
    return {
      icons: ["ion-headphone", "ion-film-marker", "ion-bug", "ion-playstation"],
      cn: {
        labels: ["音乐", "动画", "编程", "游戏"],
        contents: [],
      },
      en: {
        labels: ["Music", "Anime", "Programming", "Game"],
        contents: [],
      },
    };
  },
  computed: {
    labels() {
      return this[this.lang].labels;
    },
  },
};
</script>