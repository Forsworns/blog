<template>
  <div id="information">
    <div v-if="lang === 'cn'">
      <p>
        <i class="icon ion-university"></i> 上海交通大学 计算机科学与工程系
        硕士研究生在读 (20-)。
      </p>
      <p>
        <i class="icon ion-briefcase"></i> 英特尔亚太研发中心 数据中心组
        RAS验证实习生 (19-20)。
      </p>
      <p>
        <i class="icon ion-university"></i> 上海交通大学 计算机科学与工程系
        工学学士 (16-20)。
      </p>
      <p>
        <i class="icon ion-university"></i> 上海交通大学 安泰经济与管理学院
        第二学科经济学学士 (16-20)。
      </p>
    </div>
    <div v-else>
      <p>
        <i class="icon ion-university"></i> Shanghai Jiao Tong University,
        Department of Computer Science and Engineering, Pursing MA.SC. (20-).
      </p>
      <p>
        <i class="icon ion-briefcase"></i> Intel (Shanghai Zizhu), DCPAE RAS
        Validation Intern (19-20).
      </p>
      <p>
        <i class="icon ion-university"></i> Shanghai Jiao Tong University,
        Department of Computer Science and Engineering, BEng. (16-20).
      </p>
      <p>
        <i class="icon ion-university"></i> Shanghai Jiao Tong University, Antai
        College of Economics & Management, Second Major. (16-20).
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "information",
  props: ["lang"],
  data() {
    return {};
  },
};
</script>
