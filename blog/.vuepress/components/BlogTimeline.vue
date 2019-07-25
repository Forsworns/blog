<template>
  <div id="BlogTimeline">
    <el-timeline v-for="blog in blogs">
      <el-timeline-item :timestamp="blog.date" placement="top">
        <el-card>
          <router-link :to="computeLink(blog.date)">
            <h4>{{blog.title}}</h4>
          </router-link>
          <p>{{blog.content}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

export default {
  name: "BlogTimeline",
  data() {
    return {
      blogs: [
        {
          date: "2019/07/21",
          title: "第一篇博客",
          content: "这是一篇平平无奇的初始博客。"
        }
      ]
    };
  },
  methods: {
    computeLink(date) {
      return `${date.split("/").join("")}/`;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>