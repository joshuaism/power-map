import { GraphCanvas } from "reagraph";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useNodeService from "../hooks/useNodeService";

export default function PowerMap() {
  const {
    nodes,
    edges,
    names,
    tooltip,
    getNames,
    addNodesAndEdges,
    getRelationship,
  } = useNodeService();
  return (
    <>
      <h1>Power Map</h1>
      <Autocomplete
        onKeyUp={getNames}
        onChange={(event, newValue) => {
          console.log(newValue);
          addNodesAndEdges(newValue);
        }}
        disablePortal
        options={names}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Person or Company" />
        )}
      />
      <div style={{ position: "fixed", width: "90%", height: "75%" }}>
        <GraphCanvas
          onNodeClick={addNodesAndEdges}
          onEdgePointerOver={getRelationship}
          edgeArrowPosition="none"
          draggable
          nodes={nodes}
          edges={edges}
        />
      </div>
      <h2 style={{ position: "absolute", bottom: "0", width: "90%" }}>
        {tooltip}
      </h2>
    </>
  );
}
