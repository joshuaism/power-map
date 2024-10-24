import InfoBoxEdge from "./InfoBoxEdge";

export default function InfoBox({ data }) {
  if (data.type === "edge") {
    console.log(data.data.id);
    let edgeIds = data.data.id.split(",");
    return (
      <div key={data.data.id}>
        <h2>Edges</h2>
        {edgeIds.map((id) => {
          return <InfoBoxEdge id={id} />;
        })}
      </div>
    );
  } else if (data.type === "node") {
    let node = data.data.data;
    return (
      <>
        <h2>{node.name}</h2>
        <p>{node.blurb}</p>
        {node.summary ? <p>summary: {node.summary}</p> : null}

        {node.types.map((type) => {
          return <h3>{type}</h3>;
        })}
      </>
    );
  } else {
    return <></>;
  }
}
