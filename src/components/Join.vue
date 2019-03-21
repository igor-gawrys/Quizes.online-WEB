<template>
<div class='hello'>
  <div class='question' v-show="join">
     <div class='flex'>
      <h1>Wpisz klucz gry:</h1>
      <div v-show="step_team==1">
      <input type="text" class='join-input' v-model="team.key">
       <button class='join-button' @click="() => { step_team = 2; }">Dalej !</button>
       </div>
        <div v-show="step_team==2">
      <input type="text" class='join-input' v-model="team.name">
       <button class='join-button' @click="joinGame()">Dołącz !</button>
       </div>
     </div>
  </div>
  <div class='question' v-show="waiting">
     <div class='flex'>
       <h2>Oczekujesz na rozpoczęcie gry....</h2>
     </div>
  </div>
 <div class='question' v-if="ask">
      <div class='flex'>
       <ul>
         <li v-for="(answer,index) in questions.data[questions.count].answers"  v-bind:class="answeredClient(answer)" @click="checkAnswerClient(answer)">{{index + 1}}</li>
       </ul>
     </div>
  </div>
  <div class='question' v-if="correct">
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
   <div class='question' v-show="empty">
     <div class='flex'>
     </div>
  </div>
  <img v-if="quiz.cover !=null" v-bind:src="quiz.cover" />
  <img v-else src="/static/images/background.jpg" />
</div>
</template>

<script>
export default {
  name: 'Join',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      step_team:1,
      timer: { },
      team:{
        key:"",
        name:"",
        counter:0
      },
      quiz: { },
      correct:false,
      answer:null,
      ask:false,
      empty:false,
      ended:false,
      waiting:false,
      join:true,
      correct_answered:0,
      questions:{
        count: 0,
        data: []
      }
    }
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
    answeredClient(answer){
     if(this.answer==answer){
       return "answered client-answer";
     } else {
       return "non-answered client-answer";
     }
    },
    checkAnswerClient(answer){
     const loader = this.$loading.show({ color:"white" });
       if(answer !=null) {
        if(answer.correct){
          this.correct_answered++;
            if(this.questions.count !=this.questions.data.length-1){
               this.questions.count++;
                  this.empty = true;
                  this.ask = false;
                  this.team.answer = answer;
                  this.$socket.emit('quiz.answer',this.team)
                  this.sockets.subscribe('quiz.question.'+this.team.key, (data) => {
                        this.questions.data[this.questions.count].answers = data.questions[this.questions.count].answers;
                        this.waiting = false;
                        this.empty = false;
                        this.ask = true;
                        loader.hide();
               });
             } else {
                 console.log("ended");
               this.empty = true;
               this.sockets.subscribe('quiz.ended.'+this.team.key, (data) => {
                 this.empty = false;
                 this.ask = false;
                 this.ended = true;
                 loader.hide();
               });
             }
        } else {
          this.empty = true;
          this.ask = false;
        if(this.questions.count !=this.questions.data.length-1){
           this.sockets.subscribe('quiz.question.'+this.team.key, (data) => {
                        this.questions.data[this.questions.count].answers = data.questions[this.questions.count].answers;
                        this.waiting = false;
                        this.empty = false;
                        this.ask = true;
                        loader.hide();
               });
        } else {
             this.sockets.subscribe('quiz.ended.'+this.team.key, (data) => {
               this.ask = false;
               this.ended = true;
               loader.hide();
              });
        }
        }
      }else{
        alert("Zaznacz odpowiedź !");
      }
    },
    joinGame(){
      const loader = this.$loading.show({ color:"white" });
      this.$socket.emit('quiz.player_connect',this.team);
      this.team_game_client = true;
      this.join = false;
      this.waiting = true;
      this.sockets.subscribe('quiz.started.'+this.team.key, (data) => {
          const loader = this.$loading.show({ color:"white" });
          this.timer = setInterval(() => { this.team.counter++; },1000);
           this.sockets.subscribe('quiz.question.'+this.team.key, (data) => {
              this.questions.data = data.questions;
              this.questions.data[this.questions.count].answers = data.questions[this.questions.count].answers;
              this.waiting = false;
              this.team_game = true;
              this.team_game_client = true;
              this.ask = true;
              loader.hide();
              this.sockets.unsubscribe('quiz.question.'+this.team.key);
           });
      });
      loader.hide();
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
 .question > .flex > ul > button,.btn {
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
 .question > .flex > ul > button:hover,.btn {
   background-color:rgb(0,0,0,0.4);
   cursor:pointer;
 }
 .teams {
   opacity:0.5;
 }
 .join-input {
   padding:2vh;
   background-color:rgb(0,0,0,0.3);
   border:none;
   color:white;
 }
 .join-button {
   background-color:rgb(0,0,0,0.9);
   color:white;
   border:none;
   padding:2vh;
   font-family: 'Roboto', sans-serif;
   margin-top:8px;
 }
 .client-answer {
   background-color:rgb(0,0,0,0.9);
   color:white;
   border:1px dashed white;
   padding:8vh;
   font-family: 'Roboto', sans-serif;
   margin-top:8px;
 }
 .podium > li {
   float:left;
   background-color:rgb(0,0,0,0.9);
   padding-left:2vh;
   padding-right:2vh;
 }
</style>