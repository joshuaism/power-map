import { GraphCanvas } from "reagraph";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useNodeService from "../hooks/useNodeService";
import InfoBox from "./InfoBox";

export default function PowerMap() {
  const {
    nodes,
    edges,
    names,
    tooltip,
    getNames,
    addNodesAndEdges,
    getRelationship,
    getEntityName,
  } = useNodeService();
  const [collapsedNodes, setCollapsedNodes] = useState([]);
  const [selectedData, setSelectedData] = useState("");

  function collapseNode(node) {
    if (!collapsedNodes.includes(node.id)) {
      setCollapsedNodes([...collapsedNodes, node.id]);
    }
  }

  function createNode(psuedoNode) {
    let node = nodes.find((node) => node.id === String(psuedoNode.id));
    if (node) {
      expandNode(node);
    } else {
      console.log(
        `node ${psuedoNode.id}: ${psuedoNode.label} not found. Creating Node.`
      );
      addNodesAndEdges(psuedoNode);
      // TODO: create InfoBoxNode that is populated by node id
      //setSelectedData({ type: "node", data: node });
    }
  }

  function expandNode(node) {
    setSelectedData({ type: "node", data: node });
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
          createNode(newValue);
        }}
        disablePortal
        options={names}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Person or Company" />
        )}
      />
      <div
        style={{
          float: "left",
          position: "fixed",
          width: "70%",
          height: "100%",
        }}
      >
        <GraphCanvas
          onNodePointerOver={getEntityName}
          onNodeClick={expandNode}
          onNodeDoubleClick={collapseNode}
          collapsedNodeIds={collapsedNodes}
          onEdgePointerOver={getRelationship}
          onEdgeClick={(edge) => {
            getRelationship(edge);
            setSelectedData({ type: "edge", data: edge });
          }}
          edgeArrowPosition="none"
          draggable
          nodes={nodes}
          edges={edges}
        />
      </div>
      <div
        style={{
          float: "right",
          width: "30%",
          height: "100%",
        }}
      >
        <InfoBox data={selectedData} createNode={createNode} />
      </div>
      <h2 style={{ position: "fixed", bottom: "0", width: "90%" }}>
        {tooltip}
      </h2>
    </>
  );
}
