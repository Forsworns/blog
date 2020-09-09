<template>
  <div id="about-me">
    <el-row type="flex" align="middle" justify="center">
      <el-col :span="8">
        <img src="/cartoon.jpg" class="avatar" />
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="6">{{nameL}}</el-col>
          <el-col :span="18">{{name}}</el-col>
        </el-row>

        <el-row>
          <el-col :span="6">{{cityL}}</el-col>
          <el-col :span="18">{{city}}</el-col>
        </el-row>

        <el-row>
          <el-col :span="6">{{mailL}}</el-col>
          <el-col :span="18">{{mail}}</el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <a :href="cvRoute">{{cv}}</a>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="(item, idx) in labels" :key="item">
            <span slot="label">
              <i class="icon" :class="icons[idx]"></i>
              {{item}}
            </span>
            <component :is="component" :lang="lang"></component>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row>
      <el-col>{{motto}}</el-col>
    </el-row>
  </div>
</template>

<script>
import Information from "./components/Information";
import Honors from "./components/Honors";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Services from "./components/Services";
import Interests from "./components/Interests";

export default {
  name: "AboutMe",
  props: ["lang"], // cn/en
  components: {
    Information,
    Honors,
    Projects,
    Publications,
    Services,
    Interests,
  },
  data() {
    return {
      activeTab: "",
      icons: [
        "ion-person-add",
        "ion-ribbon-a",
        "ion-fork-repo",
        "ion-folder",
        "ion-coffee",
        "ion-heart",
      ],
      components: [
        "Information",
        "Honors",
        "Projects",
        "Publications",
        "Services",
        "Interests",
      ],
      cn: {
        nameL: "姓名：",
        name: "杨培灏",
        cityL: "居住地：",
        city: "上海",
        schoolL: "",
        mailL: "邮箱",
        mail: "yangpeihao@sjtu.edu.cn",
        cv: "我的简历",
        cvRoute: "/cv_cn.pdf",
        mottos: [
          "没有人会漫无目的地旅行，那些迷路者是希望迷路。",
          "一万年太久，只争朝夕。",
          "苟利国家生死以，岂因祸福避趋之",
        ],
        labels: [
          "个人信息",
          "奖项列表",
          "项目列表",
          "论文列表",
          "社会服务",
          "兴趣爱好",
        ],
      },
      en: {
        nameL: "Name:",
        name: "Peihao Yang",
        cityL: "Location:",
        city: "Shanghai, China",
        mailL: "Mail:",
        mail: "yangpeihao@sjtu.edu.cn",
        cv: "My Curriculum Vitae",
        cvRoute: "/cv_en.pdf",
        mottos: [
          "In the midst of the life, we are in death.",
          "Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind.",
        ],
        labels: [
          "Information",
          "Honors",
          "Projects",
          "Publications",
          "Services",
          "Interests",
        ],
      },
    };
  },
  computed: {
    motto() {
      let idx = Math.floor(Math.random() * this[this.lang].mottos.length);
      return this[this.lang].mottos[idx];
    },
    name() {
      return this[this.lang].name;
    },
    city() {
      return this[this.lang].city;
    },
    mail() {
      return this[this.lang].mail;
    },
    nameL() {
      return this[this.lang].nameL;
    },
    cityL() {
      return this[this.lang].cityL;
    },
    mailL() {
      return this[this.lang].mailL;
    },
    cv() {
      return this[this.lang].cv;
    },
    cvRoute() {
      return this[this.lang].cvRoute;
    },
    labels() {
      return this[this.lang].labels;
    },
    component() {
      return this.components[this.activeTab];
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 15px;
}

.avatar {
  width: 100px;
  height: 100px;
}
</style>