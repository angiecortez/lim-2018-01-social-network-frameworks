<template>
  <div id="app">
    <Navbar />
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar';
import NewPost from './components/NewPost';
export default {
  name: 'app',
  components: {
    Navbar,
    NewPost
  }
};
</script>

<style>
nav {
  margin-bottom: 10px;
}
</style>
