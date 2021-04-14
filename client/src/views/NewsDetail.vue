<template>
  <div class="container">
    <the-header goback="true" :chatTitle="category"></the-header>
    <ul class="media-list">
      <li class="media" v-for="article in articles" :key="article">
        <div class="media-left">
          <a v-bind:href="article.url" target="_blank">
            <img
              class="media-object"
              v-bind:alt="article.description"
              v-bind:src="article.image"
            />
          </a>
          <div class="aaa">
            <h4 class="media-heading">
              <a v-bind:href="article.url" target="_blank">{{
                article.title
              }}</a>
              <i class="author">{{ article.source.name }}</i>
            </h4>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";
export default {
  components: { TheHeader },

  created() {
    this.category = this.$route.params.category;
    axios
      .get(
        "https://gnews.io/api/v4/top-headlines?country=tw&topic=" +
          this.category +
          "&token=fce657bd48580e505cecf51d6a24d4fb"
      )
      .then((response) => {
        console.log(response);
        this.articles = response.data.articles;
      });
  },
  data() {
    return {
      currentTab: 2,
      articles: [],
      category: " ",
    };
  },
};
</script>
<style scoped>
.media-object {
  width: 128px;
  padding: 10px;
}
.media {
  background-color: black;
  border-top: 1px solid lightgrey;
  padding-top: 10px;
  padding: 20px;
}
.author {
  padding-left: 1rem;
  color: red;
}
.media-heading {
  display: inline-block;
  padding-left: 1rem;
  text-align: center;
}
</style>
