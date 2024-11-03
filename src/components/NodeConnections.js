import { useState, useEffect } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function NodeConnections({ id, category, createEdgeAndNode }) {
  const [relationships, setRelationships] = useState([]);
  const { getEntityRelationships } = useLittleSisService();

  useEffect(() => {
    async function runOnce() {
      console.log(`loading component ${id}`);
      getEntityRelationships(id, category, setRelationships);
    }
    runOnce();
  }, []);

  function ConnectionsComponent({ relationships }) {
    relationships.sort((a, b) => {
      let aCategory = a.category;
      let bCategory = b.category;
      if (aCategory === 5 && bCategory !== 5) {
        return 1;
      } else if (aCategory !== 5 && bCategory === 5) {
        return -1;
      }
      return a.category - b.category;
    });

    return (
      <div>
        {relationships.length === 100 ? (
          <p>100 or more connections</p>
        ) : (
          <p>{relationships.length} connections</p>
        )}
        {relationships.map((relationship) => {
          return (
            <>
              <p
                key={relationship.id}
                onClick={() => {
                  if (String(relationship.firstEntityId) === String(id)) {
                    createEdgeAndNode(
                      relationship,
                      relationship.secondEntityId
                    );
                  } else {
                    createEdgeAndNode(relationship, relationship.firstEntityId);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {relationship.category} <br />
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
