// SearchParams.jsx
import { useContext, useDeferredValue, useMemo, useState, useTransition } from "react";
import { AdoptedPetContext } from "./App";

import { useQuery } from "@tanstack/react-query";
import fetchSearch from "./fetchSearch";

import Results from "./Results";
import useBreedList from "./useBreedList";

const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];

const SearchParams = () => {
  const [requestParams, setRequestParams] = useState({
    location: "",
    animal: "",
    breed: "",
  });
  const [animal, setAnimal] = useState("");
  const [breeds] = useBreedList(animal);
  const { adoptedPet } = useContext(AdoptedPetContext);
  const [isPending, startTransition] = useTransition();

  const results = useQuery(["search", requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];
  const deferredPets = useDeferredValue(pets);
  const renderedPets = useMemo(
    () => <Results pets={deferredPets} />,
    [deferredPets]
  );

  // replace <Results /> line
  {
    renderedPets;
  }

  return (
    <div className="my-0 mx-auto w-11/12">
      <form
        className="mb-10 flex flex-col items-center justify-center rounded-lg bg-gray-200 p-10 shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            breed: formData.get("breed") ?? "",
            location: formData.get("location") ?? "",
          };
          startTransition(() => {
            setRequestParams(obj);
          })
          
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input
          type="text"
          className="search-input"
          name="location"
          id="location"
          placeholder="Location"
          />
        </label>
        <label htmlFor="animals">
          Animal
          <select
            id="animal"
            className="search-input"
            value={animal}
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>
        <label htmlFor="breed">
          Breed
          <select
           className="search-input grayed-out-disabled"
           id="breed"
           disabled={!breeds.length === 0}
           name="breed"
           >
            <option />
            {breeds.map((breed) => (
              <option key={breed}>{breed}</option>
            ))}
          </select>
        </label>

        {
          isPending ? (
            <div className="mini loading-pane">
              <h2 className="loader">🌀</h2>
            </div>
          ) : (
            <button>submit</button>
          )
        }

      </form>
      {renderedPets}
    </div>
  );
};

export default SearchParams;
