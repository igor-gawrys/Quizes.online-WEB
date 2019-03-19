<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  async mounted(){
    const loader = this.$loading.show();
    await this.$store.dispatch('me');
    await this.$store.dispatch('quizes');
    loader.hide();
  }
}
</script>

<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.quiz {
      border: 2px solid #c5ccd8;
      border-radius: 0.25rem;
      padding-top:20px;
      padding-bottom:20px;
      margin-top:3px;
}
.quiz:last-child {
   margin-bottom:20px;
}
.quiz:hover{
  cursor:pointer;
}
.delete:hover {
    background-color:rgb(119, 40, 11,0.5);
    color:white;
}
.edit:hover {
    background-color:rgb(232,70,11,0.5);
    color:white;
}
</style>
