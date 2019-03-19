<template>
<div class='hello'>
 <div class='question' v-show="options">
     <div class='flex'>
       <h1>Wybierz typ gry:</h1>
       <button class="icon-options" @click="()=> { options = false; ask = true; }">Samodzielna</button>
       <button class="icon-options teams">Zespołowa</button>
     </div>
  </div>
 <div class='question' v-show="ask">
     <div class='flex'>
       <h1>{{questions.data[questions.count].content}}</h1>
       <ul>
         <li  v-for="answer in questions.data[questions.count].answers" v-bind:class="answered(answer)" @click="toAnswer(answer)">{{answer.content}}</li>
         <button @click="checkAnswer()">Sprawdź !</button>
       </ul>
     </div>
  </div>
  <div class='question' v-show="correct">
     <div class='flex'>
     <h1 v-for="answer in correctAnswers">{{answer.content}}</h1>
     </div>
  </div>
  <div class='question' v-show="ended">
     <div class='flex'>
     <h1>Gratulację ukończyłeś quiz !</h1>
     <p>{{correct_answered}} / {{questions.data.length}} <p/>
     </div>
  </div>
  <img v-if="quiz.cover !=null" v-bind:src="quiz.cover" />
  <img v-else src="/static/images/background.jpg" />
</div>
</template>

<script>
export default {
  name: 'QuizShow',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      quiz: { },
      correct:false,
      answer:null,
      ask:false,
      ended:false,
      options:true,
      correct_answered:0,
      questions:{
        count: 0,
        data: []
      }
    }
  },
  created(){
    const loader = this.$loading.show({ color:"white" });
    axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
        this.quiz = response.data.data;
         axios.get('auth/questions/'+this.$route.params.quiz).then((response)=>{
           this.questions.data = this.quiz.questions;
           this.questions.data[0].answers = response.data.data.answers;
           this.options = true;
         });
        loader.hide();
     });
  },
  computed:{
    correctAnswers(){
      const answers = [];
        this.questions.data[this.questions.count].answers.filter((answer)=>{
           if(answer.correct){
              answers.push(answer);
           }
        });
      return answers;
    }
  },
  methods:{
    answered(answer){
     if(this.answer==answer){
       return "answered";
     } else {
       return "non-answered";
     }
    },
    toAnswer(answer){
       this.answer = answer;
    },
    checkAnswer(){
      if(this.answer !=null) {
        if(this.answer.correct){
          this.correct_answered++;
            if(this.questions.count !=this.questions.data.length-1){
               this.questions.count++;
               const loader = this.$loading.show({ color:"white" });
               axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
                 this.quiz = response.data.data;
                 axios.get('auth/questions/'+this.$route.params.quiz).then((response)=>{
                  this.questions.data = this.quiz.questions;
                  this.questions.data[this.questions.count].answers = response.data.data.answers;
                  this.ask = true;
                  });
                  loader.hide();
               });
             } else {
               this.ask = false;
               this.ended = true;
             }
        } else {
          alert("Twoja odpowiedź nie jest poprawna :(");
          this.correct = true;
          this.ask = false;
          setTimeout(()=>{
             this.correct = false;
             if(this.questions.count !=this.questions.data.length-1){
               this.questions.count++;
               const loader = this.$loading.show({ color:"white" });
               axios.get('auth/quizes/'+this.$route.params.quiz).then((response)=>{
                 this.quiz = response.data.data;
                 axios.get('auth/questions/'+this.$route.params.quiz).then((response)=>{
                  this.questions.data = this.quiz.questions;
                  this.questions.data[this.questions.count].answers = response.data.data.answers;
                  this.ask = true;
                  });
                  loader.hide();
               });
             } else {
               this.ended = true;
             }
          },3000);
        }
      }else{
        alert("Zaznacz odpowiedź !");
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
   height:100vh;
   width:100%;
   position:fixed;
   top:0;
   right:0;
   z-index: -1;
 }
 .question {
   height:100vh;
   width:100%;
   position:absolute;
   top:0;
   right:0;
   background-color:rgb(0,0,0,0.8);
   z-index:1;
   color:white;
   font-family: 'Roboto', sans-serif;
 }
 .question > .flex {
    height: 100vh;
    padding: 0;
    margin: 0;
    text-align:center;
    margin-top:40vh;
 }
 .question > .flex > ul > li{
   display:block;
 }
 .question > .flex > ul > li.answered{
  color:green;
 }
  .question > .flex > ul > li:hover{
   cursor:pointer;
 }
 .question > .flex > ul > button {
   background-color:rgb(0,0,0,0.9);
   color:white;
   border:1px dashed white;
   padding:10px;
   padding-left:8vh;
   padding-right:8vh;
   font-family: 'Roboto', sans-serif;
   margin-top:8px;
 }
 .icon-options {
   background-color:rgb(0,0,0,0.9);
   color:white;
   border:1px dashed white;
   padding:8vh;
   font-family: 'Roboto', sans-serif;
   margin-top:8px;
 }
 .icon-options:hover {
   background-color:rgb(0,0,0,0.4);
   cursor:pointer;
 }
 .question > .flex > ul > button:hover {
   background-color:rgb(0,0,0,0.4);
   cursor:pointer;
 }
 .teams {
   opacity:0.5;
 }
</style>