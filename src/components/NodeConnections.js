import { useState, useEffect } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function NodeConnections({ id, category, createEdgeAndNode }) {
  const [relationships, setRelationships] = useState([]);
  const { getEntityRelationships } = useLittleSisService();

  useEffect(() => {
    async function runOnce() {
      getEntityRelationships(id, category, setRelationships);
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
      {relationships ? (
        <ConnectionsComponent relationships={relationships} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

export default NodeConnections;
