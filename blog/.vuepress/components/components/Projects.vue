<template>
  <div id="projects">
    <p v-for="(item,idx) in projects" :key="idx">
      <b>&sdot;</b>
      {{item}}
    </p>
  </div>
</template>

<script>
export default {
  name: "projects",
  data() {
    return {
      cn: {
        projects: [
          "CoVIS会议数据可视化系统",
          "3D模型转换大师",
          "GEB: 虚拟现实数学课堂",
          "基于Python和Vue的网络信息管理系统开发",
        ],
      },
      en: {
        projects: [
          "CoVis: a conference statistics visualization analysis system",
          "GEB: a virtual reality mathmatical classroom",
          "Voxel World Master",
          "Network information management system development",
        ],
      },
    };
  },
  computed: {
    projected() {
      return this[this.lang].projects;
    },
  },
};
</script>