<template>
  <div id="Timeline">
    <el-timeline v-for="(blog, idx) in blogs" :key="idx">
      <el-timeline-item :timestamp="blog.date" placement="top">
        <el-card>
          <router-link :to="`${prefix}${computeLink(blog.date)}`">
            <h4>{{ blog.title }}</h4>
          </router-link>
          <p>{{ blog.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    blogs: {
      type: Array,
      required: true,
    },
    prefix: {
      type: String,
      default: "",
    },
  },
  methods: {
    computeLink(date) {
      return `${date.split("/").join("")}/`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
