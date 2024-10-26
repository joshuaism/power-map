import { useState, useEffect } from "react";

function NodeConnections({ id, createNode }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let response = await fetch(
          `https://littlesis.org/api/entities/${id}/relationships/?page=1`
        );
        if (response.ok) {
          let json = await response.json();
          setApiData(json.data);
        }
      } catch (error) {
        console.error(`Error fetching relationships for ${id}`, error);
      }
    }
    runOnce();
  }, []);

  async function getNode(nodeId) {
    try {
      let response = await fetch(
        `https://littlesis.org/api/entities/${nodeId}`
      );
      if (response.ok) {
        let json = await response.json();
        let node = json.data;
        createNode({
          id: node.id,
          label: node.attributes.name,
          data: node.attributes,
        });
      }
    } catch (error) {
      console.error(`Error fetching node: ${nodeId}`, error);
    }
  }

  function ConnectionsComponent({ relationships }) {
    return (
      <div>
        {relationships.map((relationship) => {
          relationship = relationship.attributes;
          return (
            <>
              <p
                onClick={() => {
                  if (String(relationship.entity1_id) === String(id)) {
                    getNode(relationship.entity2_id);
                  } else {
                    getNode(relationship.entity1_id);
                  }
                }}
              >
                {relationship.description}
              </p>
              <p>{relationship.category_id}</p>
            </>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {apiData ? (
        <ConnectionsComponent relationships={apiData} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

export default NodeConnections;
