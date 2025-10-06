let infiniteScroll;

// Botones
headerSearchButton.addEventListener("click", () => location.hash = "#search=" + headerSearchInput.value);
trendingPreviewBtn.addEventListener("click", () => location.hash = "#trends");
homeBtn.addEventListener("click", () => location.hash = "#home");
headerBackButton.addEventListener("click", () => history.back());

// Navigator
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith("#trends")) {
    trendPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    moviePage();
  } else if (location.hash.startsWith("#category=")) {
    categoryPage();
  } else {
    homePage();
  }

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }
}

// ========== PAGES ==========
function homePage() {
  headerContainer.classList.remove("header-container--long");
  headerContainer.style.background = "";
  homeBtn.classList.add("inactive");
  headerBackButton.classList.add("inactive");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  headerSearchForm.classList.remove("inactive");

  trendingPreviewContainer.classList.remove("inactive");
  likedMoviesSection.classList.remove("inactive");
  categoriesPreviewContainer.classList.remove("inactive");
  genericListContainer.classList.add("inactive");
  movieDetailContainer.classList.add("inactive");

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}

function categoryPage() {
  headerContainer.classList.remove("header-container--long");
  headerContainer.style.background = "";
  homeBtn.classList.remove("inactive");
  headerBackButton.classList.remove("inactive");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  headerSearchForm.classList.add("inactive");

  trendingPreviewContainer.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewContainer.classList.add("inactive");
  genericListContainer.classList.remove("inactive");
  movieDetailContainer.classList.add("inactive");

  const [_, categoryData] = location.hash.split("=");
  const [categoryId, categoryName] = categoryData.split("-");
  headerCategoryTitle.innerHTML = categoryName + " Movies";

  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function moviePage() {
  headerContainer.classList.add("header-container--long");
  headerContainer.style.background = "";
  homeBtn.classList.remove("inactive");
  headerBackButton.classList.remove("inactive");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  headerSearchForm.classList.add("inactive");

  trendingPreviewContainer.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewContainer.classList.add("inactive");
  genericListContainer.classList.add("inactive");
  movieDetailContainer.classList.remove("inactive");

  const [_, movieId] = location.hash.split("=");
  getMovieById(movieId);
}

function searchPage() {
  headerContainer.classList.remove("header-container--long");
  headerContainer.style.background = "";
  homeBtn.classList.remove("inactive");
  headerBackButton.classList.remove("inactive");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  headerSearchForm.classList.remove("inactive");

  trendingPreviewContainer.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewContainer.classList.add("inactive");
  genericListContainer.classList.remove("inactive");
  movieDetailContainer.classList.add("inactive");

  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query);
  infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendPage() {
  headerContainer.classList.remove("header-container--long");
  headerContainer.style.background = "";
  homeBtn.classList.remove("inactive");
  headerBackButton.classList.remove("inactive");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  headerSearchForm.classList.add("inactive");

  trendingPreviewContainer.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewContainer.classList.add("inactive");
  genericListContainer.classList.remove("inactive");
  movieDetailContainer.classList.add("inactive");

  headerCategoryTitle.innerHTML = "Tendencias";
  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}
