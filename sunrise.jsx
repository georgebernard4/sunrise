const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("lat=41.8268&lng=-71.4025");
  const [lat,  setLat] = useState(41.8268);
  const [long, setLong] = useState(-71.4025);
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://api.sunrise-sunset.org/json?query=lat=41.8268&lng=-71.4025",
    {
      results: []
    }
  );
  
  return (
    <Fragment>
      <form
        onSubmit={event => {
          let NewURL = `lat=${lat}&lng=${long}`
          setQuery(NewURL);
          doFetch("https://api.sunrise-sunset.org/json?query=${query}");
          event.preventDefault();
        }}
      >
        <label>Latitude</label>
        <input
          type="number"
          value={lat}
          onChange={event => setLat(event.target.value)}
        />

        <label>Longitude</label>
        <input
          type="number"
          value={long}
          onChange={event => setLong(event.target.value)}
        />


        <button type="submit">Find Sunrise and Sunset</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          <li>Sunrise: {data.results.sunrise}</li>
          <li>Sunset:  {data.results.sunset}</li>
        </ul>
      )}
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
