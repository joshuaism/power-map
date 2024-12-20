import { useState } from "react";
import useLittleSisService from "../hooks/useLittleSisService";

function useNodeService() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [names, setNames] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const {
    getRelationship,
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
      element.attributes.link = element.links.self;
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
    let edge = {
      id: String(relationship.id),
      source: String(relationship.firstEntityId),
      target: String(relationship.secondEntityId),
      label: "connection",
      size: 4,
      fill: getEdgeColor(relationship.category),
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
    return {
      id: String(data.connected_relationship_ids),
      source: String(sourceId),
      target: String(data.id),
      label: "connection",
      size: 4,
      fill: getEdgeColor(data.connected_category_id),
    };
  }

  function getEdgeColor(category) {
    let color = "#76957E";
    if (category === 1) color = "#69951E";
    if (category === 2) color = "#F9CFF2";
    if (category === 3) color = "#E09F3E";
    if (category === 4) color = "#7C98B3";
    if (category === 5) color = "#DEDBCA";
    if (category === 7) color = "#C7403B";
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
    console.log(`Get connections for ${target.id}: ${target.name}`);

    if (target.types[0].toUpperCase() === "PERSON") {
      populateConnections(target, 1, 4, 8);
    } else {
      populateConnections(target, 1, 6, 10);
    }
    setExpandedNodes([...expandedNodes, target.id]);
  }

  async function populateConnections(target, cat1, cat2, cat3) {
    getConnections(target.id, cat1, (response) => {
      let connections = [];
      connections.push(...response.data);
      getConnections(target.id, cat2, (response) => {
        connections.push(...response.data);
        getConnections(target.id, cat3, (response) => {
          connections.push(...response.data);
          if (connections.length < 5) {
            getConnections(target.id, null, (response) => {
              connections.push(...response.data);
              createEdgesAndNodes(target, connections);
              return;
            });
          }
          createEdgesAndNodes(target, connections);
        });
      });
    });
  }

  async function getEdgeRelationship(target) {
    if (target.label === "connection") {
      getRelationship(target.id, (relationship) => {
        let newEdges = edges.map((edge) => {
          if (String(edge.id) === String(relationship.id)) {
            let newEdge = {
              id: String(relationship.id),
              source: edge.source,
              target: edge.target,
              label: relationship.description,
              size: 4,
              fill: getEdgeColor(relationship.category),
            };
            return newEdge;
          }
          return edge;
        });
        setEdges(newEdges);
      });
    }
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
          element.attributes.link = element.links.self;
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

  function deleteNode(entity) {
    // verify object is entity
    if (!entity.types) {
      return;
    }
    if (
      entity.types[0].toUpperCase() !== "PERSON" &&
      entity.types[0].toUpperCase() !== "ORGANIZATION"
    ) {
      return;
    }
    // start removing node
    let newNodes = nodes.filter(
      (node) => String(node.id) !== String(entity.id)
    );
    let newEdges = edges.filter(
      (edge) =>
        String(edge.source) !== String(entity.id) &&
        String(edge.target) !== String(entity.id)
    );
    let newExpandedNodes = expandedNodes.filter(
      (id) => String(id) !== String(entity.id)
    );
    console.log(newExpandedNodes);
    setEdges(newEdges);
    setNodes(newNodes);
    setExpandedNodes(newExpandedNodes);
  }

  return {
    nodes,
    edges,
    names,
    getNames,
    addEdge,
    addEdgeAndNode,
    fillNodeNetwork,
    addNodesAndEdges,
    getEdgeRelationship,
    deleteNode,
  };
}

export default useNodeService;
