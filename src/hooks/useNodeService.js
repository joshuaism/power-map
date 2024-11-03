import { useState } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function useNodeService() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [names, setNames] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [tooltip, setTooltip] = useState("");
  const {
    getRelationship: getMyRelationship,
    getEntity,
    searchEntitiesByName,
    getConnections,
    getOligrapherEdges,
  } = useLittleSisService();

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

  function addEdge(relationship) {
    let color = "#76957E";
    if (relationship.category_id === 4) color = "#7C98B3";
    if (relationship.category_id === 8) color = "#536B78";
    let edge = {
      id: String(relationship.id),
      source: String(relationship.entity1_id),
      target: String(relationship.entity2_id),
      label: "connection",
      size: 4,
      fill: color,
    };
    setEdges([...edges, edge]);
  }

  async function addEdgeAndNode(relationship, nodeId) {
    getEntity(nodeId, (response) => {
      let node = createNode(response);
      setNodes([...nodes, node]);
      addEdge(relationship);
    });
  }

  async function fillNodeNetwork(nodeId) {
    if (nodes.find((node) => node.id === nodeId)) {
      fillMissingEdges(nodeId);
    } else {
      getEntity(nodeId, (response) => {
        let node = createNode(response);
        fillMissingEdges(nodeId);
        setNodes([...nodes, node]);
      });
    }
  }

  async function fillMissingEdges(nodeId) {
    // uses the oligrapher endpoint to fill missing edges between existing nodes
    let ids = nodes.map((val) => val.id);
    getOligrapherEdges(nodeId, ids, (response) => {
      let newEdges = [];
      response.forEach((edge) => {
        if (edges.find((e) => e.id === String(edge.id))) {
          // edge exists, do nothing
          return;
        }
        if (edge.label.includes(" contribution")) {
          // edge is a contribution
          // these are mostly noise
          console.log(`did not add ${edge.label}: (${edge.url})`);
          return;
        }
        let newEdge = {
          id: String(edge.id),
          source: String(edge.node1_id),
          target: String(edge.node2_id),
          label: "connection",
          size: 4,
          //fill: color, unknowable due to api deficiency
        };
        newEdges.push(newEdge);
      });
      setEdges([...edges, ...newEdges]);
    });
  }

  function createEdge(sourceId, data) {
    let color = getEdgeColor(data.connected_category_id);
    return {
      id: String(data.connected_relationship_ids),
      source: String(sourceId),
      target: String(data.id),
      label: "connection",
      size: 4,
      fill: color,
    };
  }

  function getEdgeColor(category) {
    let color = "#76957E";
    if (category === 4) color = "#7C98B3";
    if (category === 8) color = "#536B78";
    return color;
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
    console.log(`Get connections for ${target.id}: ${target.label}`);

    getConnections(target.id, 8, (response) => {
      let connections = [];
      connections.push(...response.data);
      getConnections(target.id, 4, (response) => {
        connections.push(...response.data);
        getConnections(target.id, 1, (response) => {
          connections.push(...response.data);
          if (connections.length < 8) {
            getConnections(target.id, null, (response) => {
              let allconnections = response.data;
              createEdgesAndNodes(target.data, allconnections);
              return;
            });
          }
          createEdgesAndNodes(target.data, connections);
        });
      });
    });
    setExpandedNodes([...expandedNodes, target.id]);
  }

  async function getRelationship(target) {
    if (target.label === "connection") {
      getMyRelationship(target.id, (relationship) => {
        let newEdges = edges.map((edge) => {
          if (String(edge.id) === String(relationship.id)) {
            let color = getEdgeColor(relationship.category);
            let newEdge = {
              id: String(relationship.id),
              source: edge.source,
              target: edge.target,
              label: relationship.description,
              size: 4,
              fill: color,
            };
            return newEdge;
          }
          return edge;
        });
        setEdges(newEdges);
        setTooltip(relationship.description);
      });
    } else {
      setTooltip(target.label);
    }
  }

  function getEntityName(target) {
    setTooltip(target.label);
  }

  async function getNames(target) {
    let val = target.target._valueTracker.getValue();
    if (val) {
      searchEntitiesByName(val, (response) => {
        let nameMap = new Map();
        names.forEach((element) => {
          nameMap.set(element.id, element);
        });
        response.data.forEach((element) => {
          nameMap.set(element.attributes.id, {
            label: element.attributes.name,
            id: element.attributes.id,
            data: element.attributes,
          });
        });
        let newNames = [...nameMap.values()];
        setNames(newNames);
      });
    }
  }

  return {
    nodes,
    edges,
    tooltip,
    names,
    getNames,
    addEdge,
    addEdgeAndNode,
    fillNodeNetwork,
    addNodesAndEdges,
    getRelationship,
    getEntityName,
  };
}

export default useNodeService;
