import { useState, useEffect } from "react";
import "./App.css";

export default function MemeoryGame() {
  const [numberOfPokemons, setNumberOfPokemons] = useState(10);
  const [pokemonArray, setPokemonArray] = useState([]);
  const [set, setSet] = useState(new Set());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  function handleNumberOfPokemons(n) {
    setNumberOfPokemons(n);
    reset()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
        const data = await response.json();
        let tempArray = data.results;
        tempArray = await Promise.all(
          tempArray.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const datas = await response.json();
            return { ...pokemon, imageUrl: datas.sprites.front_default };
          })
        );
        setPokemonArray(tempArray.slice(0, numberOfPokemons));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [numberOfPokemons]);

  function runGame(pokemon) {
    const tempSet = new Set([...set]);
    tempSet.add(pokemon);
    if (tempSet.size !== set.size) {
      increaseScore();
      setSet(tempSet);
      handleShuffle();
    } else {
      console.log("gameover");
      setBestScore(bestScore > score ? bestScore : score);
      setSet(new Set());
      setScore(0);
    }
  }

  function increaseScore() {
    setScore(score + 1);
  }

  function reset() {
    setSet(new Set());
    setBestScore(0)
    setScore(0);
  }
  
  function handleShuffle() {
    const array = [...pokemonArray];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setPokemonArray(array);
  }

  return (
    <>
      <div className="header">
        <h1>Memory Game</h1>
      </div>
      <div className="number-of-cards">
        <h3>Choose the number of cards:</h3>
        <button onClick={() => handleNumberOfPokemons(5)}>5</button>
        <button onClick={() => handleNumberOfPokemons(10)}>10</button>
        <button onClick={() => handleNumberOfPokemons(40)}>20</button>
      </div>
      <div className="game-manager">
        <div className="current-score">
          <h3>score: {score}</h3>
        </div>
        <div className="best-score">
          <h3>best score: {bestScore}</h3>
        </div>
        <div className="reset" onClick={reset}>
          <h3>reset</h3>
        </div>
      </div>
      <div className="cards-container">
        {pokemonArray.map((pokemon) => {
          return (
            <div
              onClick={() => runGame(pokemon)}
              key={pokemon.name}
              className="card"
            >
              <img src={pokemon.imageUrl} alt={pokemon.name} />
              <p>{pokemon.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
