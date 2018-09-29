<template>
  <div>
    <toponavo-header></toponavo-header>
    <b-container class="mx-auto" style="width: 60%; margin-top: 20px;">

    <b-tabs pills>
  <b-tab title="About" active>
    <br> 
    <h2>About toponavo</h2>
    Toponavo is a mapping service. 
    Check out our github page <a href="#">here</a>!
  </b-tab>
  <b-tab title="The map editor" >
    <br>I'm the second tab content
  </b-tab>
  <b-tab title="disabled" disabled>
    <br>Disabled tab!
  </b-tab>
 
</b-tabs>
     </b-container>
    </div>
</template>

<script>
import ToponavoHeader from '@/components/ToponavoHeader'

export default {
  name: 'example',
  components: {
    ToponavoHeader
  }
}
</script>
