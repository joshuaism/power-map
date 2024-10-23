import { useState } from "react";

function useNodeService() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [names, setNames] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [tooltip, setTooltip] = useState("");

  function createEdgesAndNodes(parentNode, array) {
    let nodeMap = new Map();
    nodes.forEach((element) => {
      nodeMap.set(element.id, element);
    });
    let edgeMap = new Map();
    edges.forEach((element) => {
      edgeMap.set(element.id, element);
    });
    nodeMap.set(parentNode.id, createNode(parentNode));
    array.forEach((element) => {
      let node = createNode(element.attributes);
      let edge = createEdge(parentNode.id, element.attributes);
      nodeMap.set(node.id, node);
      edgeMap.set(edge.id, edge);
    });
    let newNodes = [...nodeMap.values()];
    let newEdges = [...edgeMap.values()];
    setNodes(newNodes);
    setEdges(newEdges);
  }

  function createEdge(sourceId, data) {
    let color = "#76957E";
    if (data.connected_category_id === 4) color = "#7C98B3";
    if (data.connected_category_id === 8) color = "#536B78";
    return {
      id: String(data.connected_relationship_ids),
      source: String(sourceId),
      target: String(data.id),
      label: "connection",
      size: 4,
      fill: color,
    };
  }

  function createNode(data) {
    return {
      id: String(data.id),
      label: data.name ? String(data.name) : String(data.label),
      fill: data.types[0] === "Person" ? "#66B3BA" : "#9AB87A",
      data: data,
    };
  }

  async function addNodesAndEdges(target) {
    if (!target) {
      return;
    }
    if (expandedNodes.includes(target.id)) {
      return;
    }
    try {
      console.log(`Get connections for ${target.id}: ${target.label}`);
      let response = await fetch(
        `https://littlesis.org/api/entities/${target.id}/connections/?category_id=8`
      );
      if (response.ok) {
        let json = await response.json();
        let response2 = await fetch(
          `https://littlesis.org/api/entities/${target.id}/connections/?category_id=4`
        );
        if (response2.ok) {
          let json2 = await response2.json();
          let allData = json.data;
          allData.push(...json2.data);
          console.log(
            `Found ${allData.length} close connections for ${target.label}`
          );
          if (allData.length < 8) {
            let response3 = await fetch(
              `https://littlesis.org/api/entities/${target.id}/connections/`
            );
            if (response.ok) {
              let json3 = await response3.json();
              allData = json3.data;
              console.log(
                `Found ${allData.length} total connections for ${target.label}`
              );
            }
          }
          createEdgesAndNodes(target.data, allData);
          setExpandedNodes([...expandedNodes, target.id]);
        }
      }
    } catch {
      setTooltip("Network Error: Please try again after a brief pause.");
    }
  }

  async function getRelationship(target) {
    try {
      let response = await fetch(
        `https://littlesis.org/api/relationships/${target.id}`
      );
      if (response.ok) {
        let json = await response.json();
        setTooltip(json.data.attributes.description);
      }
    } catch {
      console.log(`Failed to get relationship for id: ${target.id}`);
    }
  }

  function getEntityName(target) {
    setTooltip(target.label);
  }

  async function getNames(target) {
    let val = target.target._valueTracker.getValue();
    if (val) {
      try {
        let response = await fetch(
          `https://littlesis.org/api/entities/search?q=${val}`
        );
        if (response.ok) {
          let nameMap = new Map();
          names.forEach((element) => {
            nameMap.set(element.id, element);
          });
          let json = await response.json();
          json.data.forEach((element) => {
            nameMap.set(element.attributes.id, {
              label: element.attributes.name,
              id: element.attributes.id,
              data: element.attributes,
            });
          });
          let newNames = [...nameMap.values()];
          setNames(newNames);
        }
      } catch {
        console.log("No luck fetching search string");
      }
    }
  }

  return {
    nodes,
    edges,
    tooltip,
    names,
    getNames,
    addNodesAndEdges,
    getRelationship,
    getEntityName,
  };
}

export default useNodeService;
