import { GraphCanvas } from "reagraph";
import { useState } from "react";
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
  const [collapsedNodes, setCollapsedNodes] = useState([]);

  function collapseNode(node) {
    if (!collapsedNodes.includes(node.id)) {
      setCollapsedNodes([...collapsedNodes, node.id]);
    }
  }

  function expandNode(node) {
    if (collapsedNodes.includes(node.id)) {
      setCollapsedNodes(collapsedNodes.filter((value) => value !== node.id));
    }
    addNodesAndEdges(node);
  }

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
          onNodeClick={(node) => expandNode(node)}
          onNodeDoubleClick={(node) => collapseNode(node)}
          collapsedNodeIds={collapsedNodes}
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
