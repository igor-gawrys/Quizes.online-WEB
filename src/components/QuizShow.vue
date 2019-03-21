<template>
<div class='hello'>
 <div class='question' v-show="options">
     <div class='flex'>
       <h1>Wybierz typ gry:</h1>
       <button class="icon-options" @click="()=> { options = false; ask = true; }">Samodzielna</button>
       <button class="icon-options teams" @click="playTeams()">Zespołowa</button>
     </div>
  </div>
  <div class='question' v-show="teams">
     <div class='flex'>
       <h2>Twój klucz gry to: {{quiz.key}}</h2>
       <h2>Gracze:</h2>
        <ul>
         <li  v-for="player in quiz.players">{{player.name}}</li>
         <button @click="startGame()">Rozpocznij grę !</button>
       </ul>
     </div>
  </div>
 <div class='question' v-show="ask">
     <div class='flex' v-if="!team_game">
       <h1>{{questions.data[questions.count].content}}</h1>
       <ul>
         <li  v-for="answer in questions.data[questions.count].answers" v-bind:class="answered(answer)" @click="toAnswer(answer)">{{answer.content}}</li>
         <button @click="checkAnswer()">Sprawdź !</button>
       </ul>
     </div>
      <div class='flex' v-if="team_game">
       <h2>{{answered_players}}</h2>
       <h1>{{questions.data[questions.count].content}}</h1>
       <ul>
         <li  v-for="answer in questions.data[questions.count].answers"  >{{answer.content}}</li>
         <button @click="nextQueston()">Następne pytanie !</button>
       </ul>
     </div>
  </div>
  <div class='question' v-show="correct">
     <div class='flex'>
     <h1 v-for="answer in correctAnswers">{{answer.content}}</h1>
     </div>
  </div>
  <div class='question' v-show="ended">
     <div class='flex' v-if="!team_game || team_game_client">
     <h1>Gratulację ukończyłeś quiz !</h1>
     <p>{{correct_answered}} / {{questions.data.length}} <p/>
     </div>
      <div class='flex' v-if="team_game && !team_game_client">
     <h1>Gratulację ukończyliście quiz !</h1>
     <p>Ranking:<p/>
     <ul>
       <li v-for="(player,index) in sortPlayers" >{{index + 1}}.{{player.name}} ({{player.points}})</li>
    </ul>
     <button class="btn" @click="() => { ended = false; podium = true; }">PODIUM</button>
     </div>
  </div>
  <div class='question' v-show="podium">
   <div class='flex' v-if="podium">
    <h1>PODIUM !</h1>
    <div class='row'>
     <div class="col-md-3"></div>
     <div class="col-md-3">
    <ul class='podium'>
      <li style="height:5vh" v-if="sortPlayers[2]">{{sortPlayers[2].name}} ({{sortPlayers[2].points}})</li>
      <li style="height:10vh" v-if="sortPlayers[0]">{{sortPlayers[0].name}} ({{sortPlayers[0].points}})</li>
      <li style="height:5vh" v-if="sortPlayers[1]">{{sortPlayers[2].name}} ({{sortPlayers[2].points}})</li>
    </ul>
    </div>
     <div class="col-md-3"></div>
    </div>
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
      step_team:1,
      answered_players:0,
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
      ended:false,
      podium:false,
      options:true,
      teams:false,
      team_game:false,
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
         axios.get('auth/questions/'+this.quiz.questions[0].id).then((response)=>{
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
    },
    sortPlayers(){
      let players = this.quiz.players.slice(0);
      players.sort(function(a,b) {
        return a.points - b.points;
      });
      return players;
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
                 axios.get('auth/questions/'+this.quiz.questions[this.questions.count].id).then((response)=>{
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
                 axios.get('auth/questions/'+this.quiz.questions[this.questions.count].id).then((response)=>{
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
    },
    startGame(){
        this.$socket.emit('quiz.started',this.quiz)
        this.ask = true;
        this.teams = false;
        this.$socket.emit('quiz.question',this.quiz)
    },
    playTeams(){
      const loader = this.$loading.show({ color:"white" });
      this.$socket.emit('quiz.connect',this.quiz)
      this.sockets.subscribe('quiz.key.'+this.quiz.id, (data) => {
           this.team_game = true;
           this.options = false;
           this.teams = true;
           this.quiz = data;
           loader.hide();
           this.sockets.subscribe('players.'+this.quiz.key, (data) => {
              this.quiz = data;
           });
          this.sockets.subscribe('quiz.answered.'+this.quiz.key,(data) => {
            this.answered_players++;
          });
          this.sockets.unsubscribe('quiz.key.'+this.quiz.id);
      });
    },
    nextQueston(){
       const loader = this.$loading.show({ color:"white" });
       if(this.questions.count !=this.questions.data.length-1){
        this.answered_players = 0;
        this.ask = false;
        this.correct = true;
        setTimeout(()=>{
             this.correct = false;
             this.questions.count++;
               axios.get('auth/questions/'+this.quiz.questions[this.questions.count].id).then((response)=>{
                  this.questions.data = this.quiz.questions;
                  this.questions.data[this.questions.count].answers = response.data.data.answers;
                  this.ask = true;
                  this.$socket.emit('quiz.question',this.quiz);
                  });
          },3000);
        loader.hide();
       }else{
           this.ask = false;
           this.ended = true;
           this.$socket.emit('quiz.ended',this.quiz);
           this.sockets.subscribe('quiz.players.'+this.quiz.key, (data) => {
              this.quiz.players = data;
           });
           loader.hide();
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