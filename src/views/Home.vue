<template>
<div>
  <toponavo-header>
  </toponavo-header>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import ToponavoHeader from "@/components/ToponavoHeader";

export default {
  name: "home",
  components: {
    ToponavoHeader
  }
};
</script>
