import InfoBoxEdge from "./InfoBoxEdge";
import InfoBoxNode from "./InfoBoxNode";

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
  } else if (data.type === "node") {
    return (
      <div key={data.data.id}>
        <InfoBoxNode id={data.data.id} createNode={createNode} />
      </div>
    );
  } else {
    return <></>;
  }
}
