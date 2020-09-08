<template>
  <div id="about-me">
    <el-container>
      <el-container>
        <el-aside width="40%">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
      <el-container>
        <div v-if="lang==='cn'">
          {{cn.name}}
          {{cn.city}}
          {{cn.mail}}
          <router-link :to="{path:cn.cvRoute}">{{cn.cv}}</router-link>
          <el-tabs v-model="activeName">
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-person-add"></i> 个人信息
              </span>
              个人信息
              <i class="icon ion-university"></i>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-ribbon-a"></i> 奖项列表
              </span>
              奖项列表
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-fork-repo"></i> 项目列表
              </span>
              项目列表
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-folder"></i> 论文列表
              </span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-coffee"></i> 社会服务
              </span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="icon ion-heart"></i> 兴趣爱好
              </span>
              <i class="icon ion-headphone"></i>
              <i class="icon ion-film-marker"></i>
              <i class="icon ion-bug"></i>
              <i class="icon ion-playstation"></i>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-else>
          {{en.name}}
          {{en.city}}
          {{en.mail}}
          <router-link :to="{path:en.cvRoute}">{{en.cv}}</router-link>
          <el-tabs v-model="activeName">
            <el-tab-pane label="Information">Information</el-tab-pane>
            <el-tab-pane label="Honor">Honors</el-tab-pane>
            <el-tab-pane label="Projects">Projects</el-tab-pane>
            <el-tab-pane label="Publications">Publications</el-tab-pane>
            <el-tab-pane label="Services">Services</el-tab-pane>
            <el-tab-pane label="Interests">Interests</el-tab-pane>
          </el-tabs>
        </div>
      </el-container>
      <el-footer>{{motto}}</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "AboutMe",
  props: ["lang"], // cn/en
  data() {
    return {
      activeName: "",
      cn: {
        name: "杨培灏",
        city: "上海",
        mail: "yangpeihao@sjtu.edu.cn",
        cv: "我的简历",
        cvRoute: "/cv_cn.pdf",
        mottos: ["没有人会漫无目的地旅行，那些迷路者是希望迷路。"],
      },
      en: {
        name: "Peihao Yang",
        city: "Shanghai, China",
        mail: "yangpeihao@sjtu.edu.cn",
        cv: "My Curriculum Vitae",
        cvRoute: "/cv_en.pdf",
        mottos: ["In the midst of the life, we are in death."],
      },
      publications: {
        selected: [],
        all: [],
      },
    };
  },
  computed: {
    motto() {
      console.log(this.lang);
      let idx = Math.floor(Math.random() * this[this.lang].mottos.length);
      return this[this.lang].mottos[idx];
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 15px;
}
</style>