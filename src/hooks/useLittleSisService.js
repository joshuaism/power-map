import { useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 1 second delay between retries
  },
});

function useLittleSisService() {
  async function getEntityRelationships(id, category, callback) {
    let url = `https://littlesis.org/api/entities/${id}/relationships/?sort=amount&page=1`;
    if (category && category > 0 && category <= 12) {
      url = `https://littlesis.org/api/entities/${id}/relationships/?category_id=${category}&sort=amount&page=1`;
    }
    axios
      .get(url)
      .then((response) => {
        if (callback) {
          callback(response.data.data);
        }
      })
      .catch((error) => {
        console.error(`Error fetching relationships for ${id}`, error);
      });
  }

  async function getEntity(id, callback) {
    let url = `https://littlesis.org/api/entities/${id}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.data.attributes) {
          response.data.data.attributes.link = response.data.data.links.self;
        }
        if (callback) {
          callback(response.data.data.attributes);
        }
      })
      .catch((error) => {
        console.error(`Error fetching entity for ${id}`, error);
      });
  }

  async function getRelationship(id, callback) {
    let url = `https://littlesis.org/api/relationships/${id}`;
    axios
      .get(url)
      .then((response) => {
        let relationship = populateRelationship(response.data);
        if (callback) {
          callback(relationship);
        }
      })
      .catch((error) => {
        console.error(`Error fetching relationship for ${id}`, error);
      });
  }

  function populateRelationship(json) {
    let firstEntity =
      json.data.attributes.entity1_id === json.included[0].id
        ? json.included[0].attributes
        : json.included[1].attributes;
    let secondEntity =
      json.data.attributes.entity2_id === json.included[0].id
        ? json.included[0].attributes
        : json.included[1].attributes;
    let amount = json.data.attributes.amount;
    if (amount) {
      amount = amount.toLocaleString(undefined, {
        style: "currency",
        currency: json.data.attributes.currency,
      });
    }
    let options = { month: "short", day: "2-digit", year: "numeric" };
    let startDate = json.data.attributes.start_date;
    if (startDate) {
      startDate = new Date(startDate).toLocaleDateString(undefined, options);
    }
    let endDate = json.data.attributes.end_date;
    if (endDate) {
      endDate = new Date(endDate).toLocaleDateString(undefined, options);
    }
    return {
      firstEntity: firstEntity,
      secondEntity: secondEntity,
      firstEntityDescription: json.data.attributes.description1,
      secondEntityDescription: json.data.attributes.description2,
      category: json.data.attributes.category_id,
      description: json.data.attributes.description,
      amount: amount,
      goods: json.data.attributes.goods,
      startDate: startDate,
      endDate: endDate,
      link: json.data.self,
    };
  }

  async function searchEntitiesByName(name, callback) {
    let url = `https://littlesis.org/api/entities/search?q=${name}`;
    axios
      .get(url)
      .then((response) => {
        if (callback) {
          callback(response.data);
        }
      })
      .catch((error) => {
        console.error(`Error searching entities for ${name}`, error);
      });
  }

  async function getConnections(id, category, callback) {
    let url = `https://littlesis.org/api/entities/${id}/connections/`;
    if (category) {
      url = `https://littlesis.org/api/entities/${id}/connections/?category_id=${category}`;
    }
    axios
      .get(url)
      .then((response) => {
        if (callback) {
          callback(response.data);
        }
      })
      .catch((error) => {
        console.error(`Error fetching connections for ${id}`, error);
      });
  }

  return {
    getEntity,
    getRelationship,
    getEntityRelationships,
    searchEntitiesByName,
    getConnections,
  };
}

export default useLittleSisService;
