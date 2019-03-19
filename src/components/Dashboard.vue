<template>
  <div class="hello">
  <b-modal ref="createQuiz" hide-footer title="Dodaj quiz">
      <div class="d-block text-center">
       <div>
        <input type="text" class="form-control" placeholder="Tytuł" v-model="quiz.title">
       </div>
      </div>
      <b-button class="mt-3" variant="outline-success" block @click="createQuiz()">Utwórz !</b-button>
  </b-modal>
    <h1>{{ msg }}</h1>
    <p>Witaj {{ $store.state.user.full_name }} !</p>
    <div class='row'>
    <div class='col-md-3'></div>
    <div class='col-md-6'>
    <div class='quizes'>
    <div class='quiz' v-for="quiz in $store.state.quizes" @click="()=>{ $router.push({name:'Quiz',params:{ quiz:quiz.id }}) }">
   {{quiz.title}}
    </div>
     <div class='quiz' @click="()=>{  $refs.createQuiz.show() }">
   Dodaj quiz
    </div>
    </div>
    </div>
      <div class='col-md-3'></div>
    </div>
        <ul>
      <li>
        <a
          href="#logout"
          @click="logout()"
        >
         Wyloguj się
        </a>
      </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      msg: 'Panel zarządzania !',
      quiz:{
        title:""
      }
    }
  },
  methods:{
    logout(){
       this.$store.dispatch('logout');
    },
    createQuiz(){
      const loader = this.$loading.show();
      axios.post('auth/quizes',{ title:this.quiz.title }).then((response)=>{
          this.quiz.title = "";
          this.$store.dispatch('quizes');
          this.$refs.createQuiz.hide();
          loader.hide();
      });
    }
  }
}
</script>