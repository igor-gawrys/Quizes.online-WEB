<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li>
        <a
          href="/login"
          @click="()=>{ $router.push({name:'Dashboard',params:{}}) }"
        >
          Zaloguj się
        </a>
      </li>
    <h2>Social Teams</h2>
      <li>
        <a
          href="https://socialteams.pl"
          target="_blank"
        >
          Social Teams
        </a>
      </li>
        <li>
        <a
          href="https://socialler.pl"
          target="_blank"
        >
         Socialler
        </a>
      </li>
       <li>
        <a
          href="https://lookyourfriend.pl"
          target="_blank"
        >
         Lookyourfriend
        </a>
      </li>
       <li>
        <a
          href="https://multinotify.pl"
          target="_blank"
        >
         Multinotify
        </a>
      </li>
       <li>
        <a
          href="https://id.socialler.eu"
          target="_blank"
        >
         Social ID
        </a>
      </li>
    </ul>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Witaj strona główna jeszcze nie gotowa zaloguj się !'
    }
  }
}
</script>

