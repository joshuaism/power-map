function NodeDetails({ entity, fillNodeNetwork }) {
  return (
    <div style={{ overflowY: "auto", maxHeight: "77vh" }}>
      <h2
        title={entity.id}
        onClick={() => {
          fillNodeNetwork(entity.id);
        }}
      >
        {entity.name}
      </h2>
      <h4>{entity.blurb}</h4>
      <h4>
        <a href={entity.link} target="_blank">
          source
        </a>
        &nbsp;&nbsp;
        <a
          href={`https://joshuaism.github.io/react-fec-client?name=${entity.name}&from_year=1980`}
          target="_blank"
        >
          fec search
        </a>
        &nbsp;&nbsp;
        {entity.types[0] === "Organization" ? (
          <a
            href={`https://joshuaism.github.io/react-fec-client?employer=${entity.name}`}
            target="_blank"
          >
            fec employee search
          </a>
        ) : null}
      </h4>
      {entity.summary ? (
        <p style={{ textAlign: "left", width: "95%" }}>
          summary: {entity.summary}
        </p>
      ) : null}

      {entity.types.map((type) => {
        return <h3>{type}</h3>;
      })}
    </div>
  );
}

export default NodeDetails;
