import { useState, useEffect } from "react";

function InfoBoxNode({ id, createNode }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let response = await fetch(`https://littlesis.org/api/entities/${id}`);
        if (response.ok) {
          let json = await response.json();
          console.log(json);
          setApiData(json.data.attributes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    runOnce();
  }, []);

  function NodeComponent({ node }) {
    return (
      <div>
        <h2>{node.name}</h2>
        <p>{node.blurb}</p>
        {node.summary ? <p>summary: {node.summary}</p> : null}

        {node.types.map((type) => {
          return <h3>{type}</h3>;
        })}
      </div>
    );
  }

  return (
    <>
      {apiData ? (
        <NodeComponent node={apiData} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

export default InfoBoxNode;
