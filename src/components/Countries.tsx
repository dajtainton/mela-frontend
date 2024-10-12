import { useState, useEffect } from "react";
import { CountryProps } from "../util/types";
import { useMultiselect } from "../hooks/MultiSelect";

export default function Countries() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { selected, isSelected, onChange } = useMultiselect([]);
  const apiUrl : string | undefined  = import.meta.env.API_URL 

  useEffect(() => {
    const getCountries = async () => {
      try {
        setIsLoading(true);
        
        if (apiUrl) {
          const res = await fetch(apiUrl);
          const data: CountryProps[] = await res.json();
          setCountries(data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    getCountries();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchCountry();
    }, 800)

    return () => clearTimeout(delayDebounceFn)
  }, [searchText])

  async function searchCountry() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/countries?search=${searchText}`
      );
      const data: CountryProps[] = await res.json();
      setCountries(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  function alertCountries() {
    alert(selected);
  }

  return (
    <>
      <section className="container mx-auto p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="max-w-4xl md:flex-1">
            <input
              id="search"
              type="text"
              name="search"
              placeholder="Search for countries by name"
              autoComplete="off"
              className="py-3 px-4 text-gray-600 placeholder-gray-600 w-full shadow rounded outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-800 dark:focus:bg-gray-700 transition-all duration-200"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              required
            />
          </div>
          <button onClick={alertCountries} className="bg-blue-500 hover:bg-blue-700 transition-all duration-200 py-3 px-4 text-white rounded text-base font-semibold" >
            Alert Selected Countries
          </button>
        </div>

        {isLoading ? (
          <div className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl dark:text-white">
            Loading...
          </div>
        ) : null}

        {!countries.length ? (
          <div className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl dark:text-white">
            No Countries Found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {countries.map((country) => (
            <div key={country.code} className="bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg shadow overflow-hidden">
                <div className="p-4">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {country.name}
                </h2>
                <ul className="flex flex-col items-start justify-start gap-2 dark:text-gray-400">
                    <li>Code: {country.code}</li>
                    <li>Name: {country.name}</li>
                    <input
                      id={country.code}
                      type="checkbox"
                      value={country.code}
                      checked={isSelected(country.code)}
                      onChange={onChange}
                    />
                </ul>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
    </>
  );
}