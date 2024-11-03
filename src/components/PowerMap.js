import { GraphCanvas } from "reagraph";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";
import useNodeService from "../hooks/useNodeService";
import InfoBox from "./InfoBox";
import InfoBoxNode from "./InfoBoxNode";

export default function PowerMap() {
  const {
    nodes,
    edges,
    names,
    tooltip,
    getNames,
    addEdge,
    addEdgeAndNode,
    addNodesAndEdges,
    fillNodeNetwork,
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
    if (!psuedoNode) {
      return;
    }
    let node = nodes.find((node) => node.id === String(psuedoNode.id));
    if (node) {
      expandNode(node);
    } else {
      console.log(
        `node ${psuedoNode.id}: ${psuedoNode.label} not found. Creating Node.`
      );
      addNodesAndEdges(psuedoNode);
      setSelectedData({ type: "node", data: psuedoNode });
    }
  }

  function expandNode(node) {
    setSelectedData({ type: "node", data: node });
    if (collapsedNodes.includes(node.id)) {
      setCollapsedNodes(collapsedNodes.filter((value) => value !== node.id));
    }
    addNodesAndEdges(node);
  }

  function getInfoBox() {
    if (selectedData) {
      if (selectedData.type === "edge") {
        return <InfoBox data={selectedData} createNode={createNode} />;
      } else {
        return (
          <InfoBoxNode
            key={`Node ${selectedData.data.data.id}`}
            id={selectedData.data.data.id}
            createEdgeAndNode={createEdgeAndNode}
            fillNodeNetwork={fillNodeNetwork}
          />
        );
      }
    }
  }

  function createEdgeAndNode(relationship, nodeId) {
    let edge = edges.find((edge) => edge.id === String(relationship.id));
    let node = nodes.find((node) => node.id === String(nodeId));
    if (edge && node) {
      return;
    }
    if (node) {
      addEdge(relationship);
    } else {
      addEdgeAndNode(relationship, nodeId);
    }
  }

  return (
    <>
      <h1>Power Map</h1>
      <Autocomplete
        style={{ position: "fixed", bottom: "80%" }}
        onKeyUp={debounce(getNames, 400)}
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
          bottom: 0,
          width: "70%",
          height: "80%",
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
        {getInfoBox()}
      </div>
      <h2 style={{ position: "fixed", bottom: "0", width: "90%" }}>
        {tooltip}
      </h2>
    </>
  );
}
