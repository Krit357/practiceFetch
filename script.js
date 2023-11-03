const pokeName = document.querySelector("#poke-name");
const pokeForm = document.querySelector("#poke-form");
const resetBtn = document.querySelector("#btn-reset");
const selectedType1 = document.querySelector("#poketype1");
const selectedType2 = document.querySelector("#poketype2");
const formInput = document.querySelector("#form-input");
const totalPokemon = document.querySelector("#total-pokemon");
const header = document.querySelector("#header");

console.log(formInput.value);

// totalPokemon.innerHTML = `Total pokemon ${pokemonList.length}`;

const allReset = () => {
  selectedType1.value = "all";
  selectedType2.value = "all";
  formInput.value = "";
};

header.addEventListener("click", async (e) => {
  allReset();
  fetchPokemon();
});

selectedType1.addEventListener("change", () => {
  fetchPokemon();
});

selectedType2.addEventListener("change", () => {
  fetchPokemon();
});

const resetForm = async () => {
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetchPokemon();
    allReset();
  });
};

resetForm();

// const fetchData = async () => {
//   const res = await fetch("https://pokeapi.co/api/v2/pokemon/");
//   const data = await res.json();
//   console.log(data);
// };
// fetchData()

const fetchPokemonByName = async (pokemonName) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Cannot fetch API");
    }

    const data = await res.json();
    displayPokemon([data]);
  } catch (err) {
    throw new Error("failed");
  }
  totalPokemon.innerHTML = `Total pokemon: 1`;
};
pokeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const pokeSearch = pokeForm.elements.pokeName.value;

  if (pokeSearch.trim() !== "") {
    fetchPokemonByName(pokeSearch);
  }

  allReset();
});

const fetchPokemon = async () => {
  try {
    const container = [];
    for (let i = 1; i <= 150; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      container.push(fetch(url));
    }
    const res = await Promise.all(container);

    const dataArr = await Promise.all(res.map((res) => res.json()));
    // console.log(dataArr);

    const selectedType1Value = selectedType1.value;
    const selectedType2Value = selectedType2.value;

    const pokemonList = dataArr.filter((data) => {
      selectedType1Value === "all"
        ? (selectedType2.disabled = true)
        : (selectedType2.disabled = false);

      if (selectedType1Value === "all") {
        return true;
      } else {
        if (selectedType2Value === "all") {
          return data.types.some(
            (pokeType) => pokeType.type.name === selectedType1Value
          );
        } else {
          return (
            data.types.some(
              (pokeType) => pokeType.type.name === selectedType1Value
            ) &&
            data.types.some(
              (pokeType) => pokeType.type.name === selectedType2Value
            )
          );
        }
      }
    });

    const totalPokemonCount = pokemonList.length;

    totalPokemon.innerHTML = `Total pokemon ${totalPokemonCount}`;

    console.log(pokemonList.length);
    displayPokemon(pokemonList);
  } catch (err) {
    throw new Error("cannot fetch data");
  }
};

const displayPokemon = (pokemonList) => {
  if (pokemonList.length > 0) {
    const pokemonString = pokemonList.map(
      (poke) =>
        `
        <li class="poke-li">
      <img class="poke-image" src="${poke.sprites.front_default}" />
      <h2 class="poke-name">${poke.id}. ${poke.name}</h2>
      <p class='poke-types'>${poke.types
        .map((type) => type.type.name)
        .join(", ")}</p> 
      </li>
  `
    );
    pokeName.innerHTML = pokemonString.join("");
  } else {
    pokeName.innerHTML = "<h1>There is no pokemon that you search</h1>";
  }
};
fetchPokemon();
