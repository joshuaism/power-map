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
    getEdgeRelationship,
    getEntityName,
    deleteNode,
  } = useNodeService();
  const [collapsedNodes, setCollapsedNodes] = useState([]);
  const [selectedData, setSelectedData] = useState("");

  function collapseNode(node) {
    if (!collapsedNodes.includes(node.id)) {
      setCollapsedNodes([...collapsedNodes, node.id]);
    }
  }

  function createNode(entity) {
    if (!entity) {
      return;
    }
    let node = nodes.find((node) => node.id === String(entity.id));
    if (node) {
      expandNode(entity);
    } else {
      console.log(
        `node ${entity.id}: ${entity.name} not found. Creating Node.`
      );
      addNodesAndEdges(entity);
      setSelectedData({ type: "node", data: entity });
    }
  }

  function expandNode(entity) {
    setSelectedData({ type: "node", data: entity });
    if (collapsedNodes.includes(entity.id)) {
      setCollapsedNodes(collapsedNodes.filter((value) => value !== entity.id));
    }
    addNodesAndEdges(entity);
  }

  function getInfoBox() {
    if (selectedData) {
      if (selectedData.type === "edge") {
        return <InfoBox data={selectedData} createNode={createNode} />;
      } else {
        return (
          <InfoBoxNode
            key={`Node ${selectedData.data.id}`}
            id={selectedData.data.id}
            entity={selectedData.data}
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
          if (newValue) {
            createNode(newValue.data);
          }
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
          layoutOverrides={
            {
              // clear overrides so dragged nodes react to layout changes like any other node
            }
          }
          onNodePointerOver={getEntityName}
          onNodeClick={(node) => {
            expandNode(node.data);
          }}
          onNodeDoubleClick={collapseNode}
          collapsedNodeIds={collapsedNodes}
          onEdgePointerOver={getEdgeRelationship}
          onEdgeClick={(edge) => {
            getEdgeRelationship(edge);
            setSelectedData({ type: "edge", data: edge });
          }}
          edgeArrowPosition="none"
          draggable
          contextMenu={({ data }) => {
            deleteNode(data.data);
          }}
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
