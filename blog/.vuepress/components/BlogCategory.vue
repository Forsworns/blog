<template>
  <div id="BlogCategory">
    <el-row id="checker">
      <el-row id="checkbox">
        <el-checkbox-group
          v-model="wantedAttrsArray"
          @change="handleCheck"
          size="small"
        >
          <el-checkbox-button
            v-for="attr in allAttrs"
            :label="attr"
            :key="attr"
            >{{ attr }}</el-checkbox-button
          >
        </el-checkbox-group>
      </el-row>
      <el-row id="tags">
        <el-tag
          v-for="attr in wantedAttrs"
          :key="attr"
          closable
          :disable-transitions="false"
          type="success"
          effect="light"
          @close="handleClose(attr)"
        >
          {{ attr }}
        </el-tag>
        <el-input
          class="input-new-attr"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveAttrInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button
          v-else
          class="button-new-attr"
          size="small"
          @click="showInput"
          >+ 标签</el-button
        >
      </el-row>
    </el-row>

    <el-row id="blogs">
      <Timeline :blogs="wantedBlogs" prefix="/zh/blogs/"></Timeline>
    </el-row>
  </div>
</template>

<script>
import Timeline from "./components/blogs/Timeline.vue";
import blogs from "../../zh/blogs/blogs.json";

export default {
  name: "BlogCategory",
  data() {
    return {
      wantedBlogs: [],
      wantedAttrsArray: [],
      wantedAttrs: new Set([]),
      allAttrs: new Set(),
      inputVisible: false,
      inputValue: "",
    };
  },
  created() {
    blogs.forEach((blog) => {
      if (blog.hasOwnProperty("attrs")) {
        blog.attrs.forEach((attr) => this.allAttrs.add(attr));
      }
    });
  },
  components: {
    Timeline,
  },
  methods: {
    computeLink(date) {
      return `${date.split("/").join("")}/`;
    },
    handleClose(attr) {
      if (this.wantedAttrs.has(attr)) {
        this.wantedAttrs.delete(attr);
        this.wantedAttrsArray.splice(this.wantedAttrsArray.indexOf(attr), 1);
      }
      this.updateBlogs();
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveAttrInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let attr = this.inputValue;
      if (attr && !this.wantedAttrs.has(attr)) {
        this.wantedAttrs.add(attr);
        this.wantedAttrsArray.push(attr);
      }
      this.inputVisible = false;
      this.inputValue = "";
      this.updateBlogs();
    },
    handleCheck() {
      this.wantedAttrs = new Set(this.wantedAttrsArray);
      this.updateBlogs();
    },
    updateBlogs() {
      let wantedAttrsSet = new Set(this.wantedAttrs);
      this.wantedBlogs = blogs.filter((blog) => {
        // old blogs are without attributes
        if (blog.hasOwnProperty("attrs")) {
          // check if intersection exist between wanted attrs and blog attrs
          let intersect = blog.attrs.filter((attr) => wantedAttrsSet.has(attr));
          return intersect.length > 0;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-attr {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-attr {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
#checker {
  #checkbox {
    margin-bottom: 10px;
  }
  margin-bottom: 30px;
}
</style>
