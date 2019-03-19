<template>
  <div class="hello">
  <b-modal ref="updateQuiz" hide-footer title="Edytuj quiz">
      <div class="d-block text-center">
       <div>
        <input type="text" class="form-control" placeholder="Tytuł" v-model="quiz.title">
       </div>
      </div>
      <b-button class="mt-3" variant="outline-warning" block @click="updateQuiz()">Zaktualizuj !</b-button>
  </b-modal>
   <b-modal ref="createQuestion" hide-footer title="Stwórz pytanie">
      <div class="d-block text-center">
       <div>
        <textarea class="form-control" placeholder="Treść" v-model="question.content"></textarea>
       </div>
      </div>
      <b-button class="mt-3" variant="outline-warning" block @click="createQuestion()">Stwórz !</b-button>
  </b-modal>
    <h1>Quiz {{this.quiz.title}} !</h1>
    <p>Witaj {{ $store.state.user.full_name }} !</p>
        <div class='row'>
    <div class='col-md-3'></div>
    <div class='col-md-6'>
    <div class='quizes'>
         <div class='quiz' v-for="question in quiz.questions" @click="()=>{ $router.push({name:'Question',params:{ question: question.id }}) }">
   {{question.content.substr(0,20)}}......
    </div>
    <div class='quiz' @click="$refs.createQuestion.show()">
   Dodaj pytanie
    </div>
    <div class='quiz delete' @click="deleteQuiz()">
    Skasuj
    </div>
    <div class='quiz edit' @click="()=>{ $refs.updateQuiz.show() }">
    Edycja
    </div>
    <div class='quiz' @click="()=>{ $router.push({name:'QuizShow',params:{ question: quiz.id }}) }">
    Pokaż
    </div>
     <div class='quiz' @click="()=>{ $router.push({name:'Dashboard',params:{}}) }">
   <= wróć
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
  name: 'Grade',
  data () {
    return {
      quiz: { },
      question:{
        content:""
      }
    }
  },
  created(){
    const loader = this.$loading.show();
     axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
        this.quiz = response.data.data;
        loader.hide();
     });
  },
  methods:{
    logout(){
       this.$store.dispatch('logout');
    },
    deleteGrade(){
      const loader = this.$loading.show();
      if(confirm("Czy jesteś pewien że chcesz usunąć ?")){
       axios.delete('auth/grades/'+this.grade.id).then((response)=>{
         this.$store.dispatch('grades');
         loader.hide();
         this.$router.back();
       });
      }
    },
    createQuestion(){
        this.$refs.createQuestion.hide();
        const loader = this.$loading.show();
         axios.post('auth/questions',{content:this.question.content,quiz_id:this.quiz.id}).then((response)=>{
            axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
              this.quiz = response.data.data;
            });
           alert(response.data.message);
           loader.hide();
        });
    },
    updateQuiz(){
      this.$refs.updateQuiz.hide();
      const loader = this.$loading.show();
      axios.patch('auth/quizes/'+this.quiz.id,{ title:this.quiz.title }).then((response)=>{
        axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
           this.quiz = response.data.data;
           loader.hide();
        });
          this.$store.dispatch('quizes');
          loader.hide();
      });
    }
  }
}
</script>

