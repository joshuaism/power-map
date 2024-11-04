import Graph from "react-vis-network-graph";
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
  } = useNodeService();
  const [selectedData, setSelectedData] = useState("");
  const [network, setNetwork] = useState(null);
  const graphOptions = {
    nodes: {
      shape: "dot",
      size: 20,
      widthConstraint: { maximum: 120 },
      font: {
        strokeWidth: 3,
        strokeColor: "white",
      },
      borderWidth: 2,
      shadow: true,
    },
    edges: {
      arrows: "",
      width: 6,
      shadow: true,
      smooth: {
        type: "continuous",
        forceDirection: "none",
        roundness: 0.2,
      },
    },
    physics: {
      repulsion: {
        centralGravity: 0,
        springConstant: 0.45,
        damping: 1,
      },
      minVelocity: 0.75,
    },
    interaction: { hover: true },
  };

  const events = {
    select: ({ nodes: selectedNodes, edges: selectedEdges }) => {
      if (selectedNodes.length === 1) {
        let node = nodes.find(
          (node) => String(node.id) === String(selectedNodes[0])
        );
        if (node) {
          expandNode(node.data);
        } else {
          network.openCluster(selectedNodes[0]);
        }
        return;
      }
      if (selectedEdges.length === 1) {
        let edge = edges.find(
          (edge) => String(edge.id) === String(selectedEdges[0])
        );
        getEdgeRelationship(edge);
        setSelectedData({ type: "edge", data: edge });
        return;
      }
    },
    doubleClick: ({ nodes: selectedNodes }) => {
      if (selectedNodes.length === 1) {
        network.clusterByConnection(selectedNodes[0]);
        return;
      }
    },
    showPopup: (id) => {
      let edge = edges.find((edge) => String(edge.id) === String(id));
      if (edge) {
        getEdgeRelationship(edge);
        return;
      }
      let node = nodes.find((node) => String(node.id) === String(id));
      if (node) {
        getEntityName(node);
      }
    },
  };

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
          createNode(newValue.data);
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
        <Graph
          graph={{ nodes, edges }}
          options={graphOptions}
          events={events}
          nodes={nodes}
          edges={edges}
          getNetwork={setNetwork}
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
