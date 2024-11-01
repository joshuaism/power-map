import { useState, useEffect } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function NodeDetails({ id }) {
  const [entity, setEntity] = useState(null);
  const { getEntity } = useLittleSisService();

  useEffect(() => {
    async function runOnce() {
      getEntity(id, setEntity);
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
          &nbsp;&nbsp;
          {node.types[0] === "Organization" ? (
            <a
              href={`https://joshuaism.github.io/react-fec-client?employer=${node.name}`}
              target="_blank"
            >
              fec employee search
            </a>
          ) : null}
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
      {entity ? (
        <NodeComponent node={entity} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

export default NodeDetails;
