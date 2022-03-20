const url = `https://cs-steam-api.herokuapp.com`;
const display = document.querySelector("#display");
const menu = document.querySelector(".menu");
const dp = document.querySelector(".card-grid");

let loading = false;

let value = "";
document.querySelector(".uList").addEventListener("click", (e) => {
  value = e.target.innerHTML;
  renderGame();
});

document.getElementById("btn-search").addEventListener("click", () => {
  renderGame();
});

async function getAllGame() {
  if (loading) return;
  dp.innerHTML = `<h1>Loading...</h1>`;
  let filterNameKey = document.getElementById("search").value;
  let urlFilterName = "";
  let urlGenresList = "";
  if (filterNameKey) {
    urlFilterName += `${filterNameKey}`;
  }
  if (value) {
    urlGenresList += `&genres=${value}`;
  }
  loading = true;
  const response = await fetch(
    url + `/games?q=${urlFilterName}${urlGenresList}&limit=20`
  );
  const data = await response.json();
  loading = false;
  return data;
}

const renderGame = async () => {
  try {
    const src = await getAllGame();
    const cardGrid = display.children[1];
    cardGrid.innerHTML = "";
    src.data.forEach((game) => {
      const x = document.createElement("div");
      x.className = "card";
      x.innerHTML = `<div onClick="appDetail(${game.appid})"><div class="card-header card-image">
        <img src="${game.header_image}" alt="" />
      </div>
      <div class="card-header">${game.name}</div>
      <div class="card-body">$${game.price}</div>
      <div class="card-footer">
        <button class="btn">Buy this game</button>
        <button class="btn btn-outline">Add to WishList</button>
      </div></div>`;
      cardGrid.appendChild(x);
    });
  } catch (error) {
    console.log(error);
  }
};
renderGame();

//================================= GENRES LIST=======================================
async function getGenresList() {
  const response = await fetch(url + `/genres?limit=29`);
  const data = await response.json();
  return data;
}
const renderList = async () => {
  try {
    const src = await getGenresList();
    const ulMenu = menu.children[0];
    src.data.forEach((genres) => {
      const x = document.createElement("li");
      x.innerHTML = `${genres.name}`;
      ulMenu.appendChild(x);
    });
  } catch (error) {
    console.log(error);
  }
};
renderList();
//========================= CLICK GAME ===================================
async function appDetail(id) {
  const response = await fetch(url + `/single-game/${id}`);
  const data = await response.json();
  const cardGrid = display.children[1];
  let date = new Date(data.data.release_date).toDateString();
  cardGrid.innerHTML = "";
  let numBtn = "";
  for (let i = 0; i < data.data.genres.length; i++) {
    numBtn += `<button>${data.data.genres[i]}</button>`;
  }
  cardGrid.innerHTML = `<div class="display-detail" style="background-image: url(${data.data.background})">
  <div id="container-detail">
    <div class="main-detail">
      <h2 class="name-detail">
      ${data.data.name}
      </h2>
      <div class="box-description">
        <div class="header-image">
          <img
            src="${data.data.header_image}"
            alt="Image Team Fortress Classic"
          />
        </div>
        <div class="description-detail">
          <p class="description">
          ${data.data.description}
          </p>
          <p class="releas-date">RELEASE DATE: ${date}</p>
          <p class="developer">DEVELOPER: ${data.data.developer}</p>
          <p class="price">PRICE: ${data.data.price}$</p>
        </div>
      </div>
    </div>
    <div class="tag">
      <p>Popular user-defined tags for this product:</p>
      <div class="btn-tag">
        ${numBtn}
      </div>
    </div>
  </div>
</div>`;
  console.log(id);
}
