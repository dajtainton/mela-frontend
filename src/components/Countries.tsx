import { useState, useEffect } from "react";
import { CountryProps } from "../util/types";
import { useMultiselect } from "../hooks/MultiSelect";
import ReactCountryFlag from "react-country-flag";

export default function Countries() {
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { selected, isSelected, onChange } = useMultiselect([]);
  const apiUrl : string | undefined  = import.meta.env.VITE_API_URL 

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
        `${apiUrl}?search=${searchText}`
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
      <section className="container mx-auto p-8 h-full min-h-screen">
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
          <div className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center text-xl dark:text-white m-4">
            Loading...
          </div>
        ) : null}

        {!countries.length && !isLoading ? (
          <div className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center text-xl dark:text-white m-4">
            No Countries Found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {countries.map((country) => (
            <div key={country.code} className="bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <ul className="grid grid-cols-3 gap-2 dark:text-gray-400">
                  <div className="col-span-2 gap-2 items-center">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {country.name}
                    </h2>
                    <div>Code:{country.code}</div>
                    <div>Flag: 
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1em",
                        }}
                        title={country.name}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <label className="flex items-center cursor-pointer relative">
                      <input
                        id={country.code}
                        type="checkbox"
                        value={country.code}
                        checked={isSelected(country.code)}
                        onChange={onChange}
                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-500"
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </label>
                  </div>
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