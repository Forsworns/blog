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
        mail: "yangpeihao AT sjtu DOT edu DOT cn",
        cv: "我的简历",
        cvRoute: "/cv_cn.pdf",
        mottos: [
          "没有人会漫无目的地旅行，那些迷路者是希望迷路",
          "现在虽然是太空时代，人类早就可以做太空船去月球，但永远无法探索别人内心的宇宙。",
          "一万年太久，只争朝夕。",
          "苟利国家生死以，岂因祸福避趋之。",
          "现实过得不顺吗 定定望向这画中昙花",
          "个个也探问爱恋不老的秘方 难道抱著残像可百世流芳",
          "我们仰望着同一片天空却看着不同的地方。",
          "在某一天的早晨，我察觉到那曾经如此真切的情感，就这样干干净净地消失殆尽。",
          "它还在那儿。一动不动。而在别的地方，村庄、小河、山坡上，到处都沐浴着灿烂的阳光。苦楝树下那片可怜的小小的紫色花朵，仿佛就是我，永远都在阴影中，永远。",
          "有做得到的事,也有做不得的事。",
          "人与人之间是无法完全相互了解的。",
          "天之涯，地之角，知交半零落。一壶浊酒尽余欢，今宵别梦寒。",
          "我去旅行，是因为我决定了要去，并不是因为对风景的兴趣。",
          "原来是生命，而非死亡，才是没有止境的。",
          "“一生一世。”他说，在五十三年七个月零十一天以来的日日夜夜，弗洛伦蒂诺一直都准备好了答案。",
          "大风吹来了，我们随风飘荡，在风尘中遗忘的清白脸庞。",
          "走不完的长巷，原来也就那么长；跑不完的操场，原来小成这样。",
          "雨伞弄丢在下雨天 还没回应手机也没电 久别重逢却赶时间。",
          "顽童大了别再追问，可以任我走怎么又随着大队走，人群是那么像羊群。",
          "灵气大概早被污染，谁为了生活不变。",
          "差不多冬至一早一晚还是有雨，当初的坚持现已令你很怀疑。",
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
        mail: "yangpeihao AT sjtu DOT edu DOT cn",
        cv: "My Curriculum Vitae",
        cvRoute: "/cv_en.pdf",
        mottos: [
          "In the midst of the life, we are in death.",
          "So we beat on, boats against the current, borne back ceaselessly into the past.",
          "Whenever you feel like criticizing any one, just remember that all the people in this world haven't had the advantages that you've had.",
          "Get busy living or get busy dying.",
          "I watched her go after she planted her love in the top sail. And from the top sail an iris bloomed. It was pretty in May but it died in June.",
          "See all I need is a whisper, in a world that only shouts",
          `We laughed and kept saying"see you soon",but inside we both knew we'd never see each other again.`,
          "I'm at a payphone trying to call home, all of my change I spent on you. Where have the times gone?",
          "Who's gonna rock you when the sun won't let you sleep? Who's waking up to drive you home when you're drunk and all alone? Who's gonna walk you through the dark side of the morning?",
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