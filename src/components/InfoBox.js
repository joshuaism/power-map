import InfoBoxEdge from "./InfoBoxEdge";

export default function InfoBox({ data, createNode }) {
  if (data.type === "edge") {
    let edgeIds = data.data.id.split(",");
    return (
      <div key={data.data.id}>
        <h2>Edges</h2>
        {edgeIds.map((id) => {
          return <InfoBoxEdge id={id} createNode={createNode} />;
        })}
      </div>
    );
  } else {
    console.log("should not be here after refactor.");
  }
}
