import { useState, useEffect } from "react";

function NodeConnections({ id, category, createNode }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let url = `https://littlesis.org/api/entities/${id}/relationships/?sort=amount&page=1`;
        if (category > 0 && category <= 12) {
          url = `https://littlesis.org/api/entities/${id}/relationships/?category_id=${category}&sort=amount&page=1`;
        }
        let response = await fetch(url);
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
                key={relationship.id}
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
