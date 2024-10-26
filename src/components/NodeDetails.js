import { useState, useEffect } from "react";

function NodeDetails({ id }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let response = await fetch(`https://littlesis.org/api/entities/${id}`);
        if (response.ok) {
          let json = await response.json();
          if (json.data.attributes) {
            json.data.attributes.link = json.data.links.self;
          }
          setApiData(json.data.attributes);
        }
      } catch (error) {
        console.error(`Error fetching node details for ${id}`, error);
      }
    }
    runOnce();
  }, []);

  function NodeComponent({ node }) {
    return (
      <div>
        <h2>{node.name}</h2>
        <p>{node.blurb}</p>
        <p>
          <a href={node.link} target="_blank">
            source
          </a>
          &nbsp;&nbsp;
          <a
            href={`https://joshuaism.github.io/react-fec-client?name=${node.name}&from_year=1980`}
            target="_blank"
          >
            fec search
          </a>
        </p>
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

export default NodeDetails;
