<template>
  <div id="services">
    <p v-for="(item,idx) in services" :key="idx">
      <b>&sdot;</b>
      {{item}}
    </p>
  </div>
</template>

<script>
export default {
  name: "services",
  props: ["lang"],
  data() {
    return {
      cn: {
        services: [
          "义务献血爱心志愿者，2018/2019",
          "SJTU港澳台学生暑期交流活动志愿者，2018",
          "上海市永丰村、闵行区启智特殊教育学校长期爱心辅导志愿者，2018",
          "共青团山西大学委员会优秀学生团干，2014",
        ],
      },
      en: {
        services: [],
      },
    };
  },
  computed: {
    services() {
      return this[this.lang].services;
    },
  },
};
</script>