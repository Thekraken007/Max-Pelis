const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
  },
});

function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies; 

  if (item){
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList()

  if (likedMovies[movie.id]){
    delete likedMovies[movie.id];
  }
  else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
  getLikedMovies();
}

// Lazy Loader
const lazyLoader = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

// ================= CREATE MOVIES =================
// ================= CREATE MOVIES =================
function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
  if (clean) container.innerHTML = "";

  movies.forEach(movie => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.dataset.movieId = movie.id; // Agregar ID para identificar la película

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(lazyLoad ? "data-img" : "src", "https://image.tmdb.org/t/p/w300" + movie.poster_path);
    movieImg.addEventListener("click", () => location.hash = "#movie=" + movie.id);
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", "https://static.vecteezy.com/system/resources/thumbnails/042/236/044/small_2x/ai-generated-popcorn-in-striped-box-isolated-on-transparent-background-png.png");
    });

    const likeButton = document.createElement("button");
    likeButton.classList.add("likeButton");
    const likedMovies = likedMoviesList();
    if (likedMovies[movie.id]) {
      likeButton.classList.add("likeButton--liked");
    } else {
      likeButton.classList.remove("likeButton--liked");
    }

    likeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      likeButton.classList.toggle("likeButton--liked");
      likeMovie(movie);
      updateLikeButtons(movie.id);
    });

    if (lazyLoad) lazyLoader.observe(movieImg);

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(likeButton);
    container.appendChild(movieContainer);
  });
}

// Nueva función para actualizar todos los botones de "like" de una película
function updateLikeButtons(movieId) {
  const likedMovies = likedMoviesList();
  const isLiked = likedMovies[movieId];
  document.querySelectorAll(`.likeButton`).forEach(button => {
    const parentContainer = button.closest(".movie-container");
    if (parentContainer && parentContainer.dataset.movieId == movieId) {
      if (isLiked) {
        button.classList.add("likeButton--liked");
      } else {
        button.classList.remove("likeButton--liked");
      }
    }
  });
  getLikedMovies();
}

// Modificar likeMovie para aceptar updateLikeButtons
function likeMovie(movie) {
  const likedMovies = likedMoviesList();

  if (likedMovies[movie.id]) {
    delete likedMovies[movie.id];
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

// ================= CREATE CATEGORIES =================
function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach(category => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    categoryTitle.textContent = category.name;

    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// ================= API CALLS =================
let maxPage;
let page = 1;

async function getTrendingMoviesPreview() {
  const { data } = await api.get("/trending/movie/day");
  createMovies(data.results, trendingPreviewMovieList, { lazyLoad: false, clean: true });
}

async function getCategoriesPreview() {
  const { data } = await api.get("/genre/movie/list");
  createCategories(data.genres, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api.get("/discover/movie", { params: { with_genres: id } });
  maxPage = data.total_pages;
  page = 1;
  createMovies(data.results, genericListContainer, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 15 && page < maxPage) {
      page++;
      const { data } = await api.get("/discover/movie", { params: { with_genres: id, page } });
      createMovies(data.results, genericListContainer, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api.get("/search/movie", { params: { query } });
  maxPage = data.total_pages;
  page = 1;
  createMovies(data.results, genericListContainer, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 15 && page < maxPage) {
      page++;
      const { data } = await api.get("/search/movie", { params: { query, page } });
      createMovies(data.results, genericListContainer, { lazyLoad: true, clean: false });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await api.get("/trending/movie/day");
  maxPage = data.total_pages;
  page = 1;
  createMovies(data.results, genericListContainer, { lazyLoad: true, clean: true });
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 15 && page < maxPage) {
    page++;
    const { data } = await api.get("/trending/movie/day", { params: { page } });
    createMovies(data.results, genericListContainer, { lazyLoad: true, clean: false });
  }
}

async function getMovieById(id) {
  const { data: movie } = await api.get("/movie/" + id);
  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

  posterBg.style.backgroundImage = `url(${movieImgUrl})`;
  moviePoster.src = movieImgUrl;

  movieDetailTitle.textContent = movie.title;
  movieDetailScore.textContent = `${movie.vote_average} ⭐`;
  movieDetailDescription.textContent = movie.overview;

  createCategories(movie.genres, movieGenresContainer);

  getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
  const { data } = await api.get(`/movie/${id}/recommendations`);
  createMovies(data.results, relatedMoviesContainer, { lazyLoad: true, clean: true });
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likeMovies, {lazyLoad: true, clean: true})
}