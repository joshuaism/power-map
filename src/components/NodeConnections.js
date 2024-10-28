import { useState, useEffect } from "react";

function NodeConnections({ id, category, createEdgeAndNode }) {
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

  function ConnectionsComponent({ relationships }) {
    relationships.sort((a, b) => {
      let aCategory = a.attributes.category_id;
      let bCategory = b.attributes.category_id;
      if (aCategory === 5 && bCategory !== 5) {
        return 1;
      } else if (aCategory !== 5 && bCategory === 5) {
        return -1;
      }
      return a.attributes.category_id - b.attributes.category_id;
    });

    return (
      <div>
        {relationships.length === 100 ? (
          <p>100 or more connections</p>
        ) : (
          <p>{relationships.length} connections</p>
        )}
        {relationships.map((relationship) => {
          relationship = relationship.attributes;
          return (
            <>
              <p
                key={relationship.id}
                onClick={() => {
                  if (String(relationship.entity1_id) === String(id)) {
                    createEdgeAndNode(relationship, relationship.entity2_id);
                  } else {
                    createEdgeAndNode(relationship, relationship.entity1_id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {relationship.category_id} <br />
                {relationship.description}
              </p>
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
