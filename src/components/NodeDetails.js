function NodeDetails({ entity, fillNodeNetwork }) {
  return (
    <div>
      <h2
        title={entity.id}
        onClick={() => {
          fillNodeNetwork(entity.id);
        }}
      >
        {entity.name}
      </h2>
      <p>{entity.blurb}</p>
      <p>
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
      </p>
      {entity.summary ? <p>summary: {entity.summary}</p> : null}

      {entity.types.map((type) => {
        return <h3>{type}</h3>;
      })}
    </div>
  );
}

export default NodeDetails;
