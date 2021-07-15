<template>
  <Timeline :blogs="blogs"></Timeline>
</template>

<script>
import Timeline from "./components/blogs/Timeline.vue";
import blogs from "../../zh/blogs/blogs.json";
blogs.reverse();

export default {
  name: "BlogTimeline",
  created() {
    this.blogs = blogs;
  },
  data() {
    return {
      blogs,
    };
  },
  components: { Timeline },
};
</script>

<style lang="scss" scoped></style>
