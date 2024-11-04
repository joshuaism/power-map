import { GraphCanvas } from "reagraph";
import { useEffect, useState } from "react";
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
    getNames,
    addEdge,
    addEdgeAndNode,
    addNodesAndEdges,
    fillNodeNetwork,
    getEdgeRelationship,
    deleteNode,
  } = useNodeService();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      debounce(
        setCoords({
          x: event.clientX,
          y: event.clientY,
        }),
        700
      );
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);
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
    if (collapsedNodes.includes(String(entity.id))) {
      setCollapsedNodes(
        collapsedNodes.filter((value) => value !== String(entity.id))
      );
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

  function getTooltip() {
    if (tooltip) {
      let label = tooltip.data.label;
      if (tooltip.type === "edge") {
        label = tooltip.data.label;
      } else {
        label = (
          <span>
            {tooltip.data.data.name}
            <br />
            {tooltip.data.data.blurb}
          </span>
        );
      }
      return (
        <div
          id={`${tooltip.type}-${tooltip.id}`}
          style={{
            background: "white",
            border: "solid 1px blue",
            borderRadius: 2,
            padding: 5,
            textAlign: "left",
            position: "fixed",
            top: coords ? coords.y + 10 : 0,
            left: coords ? coords.x : 0,
          }}
        >
          {label}
        </div>
      );
    } else return <div id={`empty-tooltip`}></div>;
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
          onNodePointerOver={(node) => setTooltip({ type: "node", data: node })}
          onNodePointerOut={() => setTooltip(null)}
          onNodeClick={(node) => {
            expandNode(node.data);
          }}
          onNodeDoubleClick={collapseNode}
          collapsedNodeIds={collapsedNodes}
          onEdgePointerOver={(edge) => {
            getEdgeRelationship(edge);
            setTooltip({ type: "edge", data: edge });
          }}
          onEdgePointerOut={() => setTooltip(null)}
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
      {getTooltip()}
    </>
  );
}
