import { useState, useEffect } from "react";

function InfoBoxEdge({ id }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let response = await fetch(
          `https://littlesis.org/api/relationships/${id}`
        );
        if (response.ok) {
          let json = await response.json();
          console.log("set data for " + id);
          setApiData(json.data.attributes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    runOnce();
  }, []);

  return (
    <>
      {apiData ? (
        // Render your component using the fetched data
        <MyComponent data={apiData} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

const MyComponent = ({ data }) => {
  return (
    <div>
      <p>{data.description}</p>
      {/* Render other components based on data */}
    </div>
  );
};

export default InfoBoxEdge;
