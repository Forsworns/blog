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
import blogs from "../../zh/blogs/blogs.json"

export default {
  name: "BlogTimeline",
  data() {
    return {
      blogs: blogs
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