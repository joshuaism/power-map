import { useState, useEffect } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function InfoBoxEdge({ id, createNode }) {
  const [relationship, setRelationship] = useState(null);
  const { getRelationship } = useLittleSisService();

  useEffect(() => {
    async function runOnce() {
      getRelationship(id, setRelationship);
    }
    runOnce();
  }, []);

  function EdgeComponent({ data }) {
    if (data.category === 3) {
      return (
        <div>
          <p>{data.description}</p>
          <Entity
            entity={data.firstEntity}
            description={data.firstEntityDescription}
          />
          <Entity
            entity={data.secondEntity}
            description={data.secondEntityDescription}
          />
          {data.startDate || data.endDate ? (
            <p>
              {data.startDate} - {data.endDate}
            </p>
          ) : null}
          <p>
            <a href={data.link} target="_blank">
              link
            </a>
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>{data.description}</p>
        <Entity
          entity={data.firstEntity}
          description={data.firstEntityDescription}
        />
        <Entity
          entity={data.secondEntity}
          description={data.secondEntityDescription}
        />
        <p>{data.amount}</p>
        <p>{data.goods}</p>
        <p>category: {data.category}</p>
        <p>
          <a href={data.link} target="_blank">
            link
          </a>
        </p>
      </div>
    );
  }

  function Entity({ entity, description }) {
    return (
      <p
        onClick={() =>
          createNode({
            id: entity.id,
            label: entity.name,
            data: entity,
          })
        }
      >
        {entity.name}: {description}
      </p>
    );
  }

  return (
    <>
      {relationship ? (
        // Render your component using the fetched data
        <EdgeComponent data={relationship} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

export default InfoBoxEdge;
