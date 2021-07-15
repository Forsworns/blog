<template>
  <div id="publications">
    <p v-for="(item, idx) in papers" :key="idx">[{{ idx + 1 }}] {{ item }}</p>
  </div>
</template>

<script>
export default {
  name: "publications",
  props: ["lang"],
  data() {
    return {
      papers: [
        "Peihao Yang, Linghe Kong*, Meikang Qiu, Xue Liu, Guihai Chen. “Compressed Imaging Reconstruction with Sparse Random Projection”. ACM Transactions on Multimedia Computing Communications and Applications (TOMM), accepted.",
        "Peihao Yang, Linghe Kong*, Xiao-Yang Liu, Xin Yuan, Guihai Chen. “Shearlet Enhanced Snapshot Compressive Imaging”. IEEE Transactions on Image Processing (TIP), Vol. 29, pp. 6466-6481, 2020.",
        "Peihao Yang, Linghe Kong*, Guihai Chen, Jianhong Shi, Guihua Zeng. “Cloud based Sparse Random Projection for Compressed Imaging”. IEEE SmartCloud, Tokyo, Japan, 2019. (Best Paper Award)",
      ],
    };
  },
};
</script>
