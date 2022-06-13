<template>
  <div id="interests">
    {{ description }}
    <p>
      <img src="/selfie.png" class="selfie" />
    </p>
  </div>
</template>

<script>
export default {
  name: "interests",
  props: ["lang"],
  data() {
    return {
      cn: {
        description: `
          业余时间我是一名拉拉肥，你可以在最终幻想14国服陆行鸟大区找到我 :) 
        `,
      },
      en: {
        description: `
          In my spare time, I am a Lalafell in Final Fantasy XIV. Thank you, Yoshi-P!
        `,
      },
    };
  },
  computed: {
    description() {
      return this[this.lang].description;
    },
  },
};
</script>


<style lang="scss" scoped>
div {
  text-align: center;
}
.selfie {
  width: 60%;
  height: 60%;
}
</style>