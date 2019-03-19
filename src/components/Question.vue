<template>
  <div class="hello">
  <b-modal ref="updateQuestion" hide-footer title="Edytuj pytanie">
      <div class="d-block text-center">
       <div>
        <textarea class="form-control" placeholder="Treść" v-model="question.content"></textarea>
       </div>
      </div>
      <b-button class="mt-3" variant="outline-warning" block @click="updateQuestion()">Zaktualizuj !</b-button>
  </b-modal>
   <b-modal ref="createAnswer" hide-footer title="Dodaj odpowiedź">
      <div class="d-block text-center">
       <div>
        <input type="text" class="form-control" placeholder="Treść" v-model="answer.content">
        <b-form-checkbox
           v-model="answer.correct"
           class='mt-2'
         >
          Oznacz jako prawidłową odpowiedź
         </b-form-checkbox>
       </div>
      </div>
      <b-button class="mt-3" variant="outline-success" block @click="createAnswer()">Utwórz !</b-button>
  </b-modal>
  <b-modal ref="updateAnswer" hide-footer title="Zaktualizuj odpowiedź">
      <div class="d-block text-center">
       <div>
        <input type="text" class="form-control" placeholder="Treść" v-model="answer.content">
        <b-form-checkbox
           v-model="answer.correct"
           class='mt-2'
         >
          Oznacz jako prawidłową odpowiedź
         </b-form-checkbox>
       </div>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="deleteAnswer(answer)">Skasuj !</b-button>
      <b-button class="mt-3" variant="outline-success" block @click="updateAnswer(answer)">Zaktualizuj !</b-button>
  </b-modal>
    <h1>Pytanie</h1>
    <p>Witaj {{ $store.state.user.full_name }} !</p>
        <div class='row'>
    <div class='col-md-3'></div>
    <div class='col-md-6'>
    <div class='quizes'>
         <div class='quiz' @click="()=>{ $refs.updateQuestion.show() }">
 {{question.content}}
    </div>
     <div class='quiz'>
 Odpowiedzi:
    </div>
    <div v-for="answer in this.question.answers" v-bind:class='checkClasses(answer)' @click="showUpdateAnswer(answer)">
    {{answer.content}}
    </div>
    <div class='quiz edit' @click="()=> { $refs.createAnswer.show() }">
      Stwórz odpowiedź 
    </div>
    <div class='quiz delete' @click="Delete()">
      Skasuj
    </div>
     <div class='quiz' @click="()=>{ $router.back() }">
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
  name: 'Queston',
  data () {
    return {
      question: { },
      answer:{
        content:"",
        correct:false
      }
    }
  },
  created(){
     const loader = this.$loading.show();
     axios.get('auth/questions/'+this.$route.params.question).then((response)=>{
        this.question = response.data.data;
        loader.hide();
     });
  },
  methods:{
    logout(){
       this.$store.dispatch('logout');
    },
    Delete(){
        const loader = this.$loading.show();
        axios.delete("auth/questions/"+this.question.id).then((response)=>{
               alert(response.data.message);
               loader.hide();
               this.$router.back();
        });
    },
    createAnswer(){
        this.$refs.createAnswer.hide();
        const loader = this.$loading.show();
        axios.post("auth/answers",{ content:this.answer.content,correct:this.answer.correct,question_id:this.question.id }).then((response)=>{
               this.answer.content = "";
               this.answer.correct = false;
               axios.get('auth/questions/'+this.$route.params.question).then((response)=>{
                  this.question = response.data.data;
               });
               alert(response.data.message);
               loader.hide();
        });
    },
    showUpdateAnswer(answer){
      this.answer = answer;
      this.$refs.updateAnswer.show();
    },
    deleteAnswer(answer){
        this.$refs.updateAnswer.hide();
        const loader = this.$loading.show();
        axios.delete("auth/answers/"+answer.id).then((response)=>{
               this.answer = { content:"",correct:false };
               axios.get('auth/questions/'+this.$route.params.question).then((response)=>{
                  this.question = response.data.data;
               });
               alert(response.data.message);
               loader.hide();
        });
    },
    updateAnswer(answer){
        this.$refs.updateAnswer.hide();
        const loader = this.$loading.show();
        axios.patch("auth/answers/"+answer.id,{ content:answer.content,correct:answer.correct }).then((response)=>{
               this.answer = { content:"",correct:false };
               axios.get('auth/questions/'+this.$route.params.question).then((response)=>{
                  this.question = response.data.data;
               });
               alert(response.data.message);
               loader.hide();
        });
    },
    updateQuestion(){
        this.$refs.updateQuestion.hide();
        const loader = this.$loading.show();
        axios.patch("auth/questions/"+this.question.id,{ content:this.question.content,order:this.question.order }).then((response)=>{
               axios.get('auth/questions/'+this.$route.params.question).then((response)=>{
                  this.question = response.data.data;
               });
               alert(response.data.message);
               loader.hide();
        });
    },
    checkClasses(answer){
      if(answer.correct){
        return "quiz correct";
      } else {
        return "quiz non-correct";
      }
    }
  }
}
</script>

<style>
.correct {
  background-color:rgb(89, 247, 112,0.5);
}
.non-correct {
  background-color:rgb(140, 43, 11,0.5);
}
</style>
