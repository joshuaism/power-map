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
        let relationships = response.data.data.map((r) =>
          populateRelationship(r)
        );
        if (callback) {
          callback(relationships);
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
        let firstEntity =
          response.data.data.attributes.entity1_id ===
          response.data.included[0].id
            ? response.data.included[0].attributes
            : response.data.included[1].attributes;
        let secondEntity =
          response.data.data.attributes.entity2_id ===
          response.data.included[0].id
            ? response.data.included[0].attributes
            : response.data.included[1].attributes;
        let relationship = populateRelationship(
          response.data.data,
          firstEntity,
          secondEntity
        );
        if (callback) {
          callback(relationship);
        }
      })
      .catch((error) => {
        console.error(`Error fetching relationship for ${id}`, error);
      });
  }

  function populateRelationship(relationship, firstEntity, secondEntity) {
    let amount = relationship.attributes.amount;
    if (amount) {
      amount = amount.toLocaleString(undefined, {
        style: "currency",
        currency: relationship.attributes.currency,
      });
    }
    let description = relationship.attributes.description;
    if (amount && relationship.attributes.category_id === 5) {
      description = description.replace("money", amount);
    }
    if (amount && relationship.attributes.category_id === 6) {
      description = description.replace("did/do", `did ${amount} in`);
    }
    let options = { month: "short", day: "2-digit", year: "numeric" };
    let startDate = relationship.attributes.start_date;
    if (startDate) {
      startDate = new Date(startDate).toLocaleDateString(undefined, options);
    }
    let endDate = relationship.attributes.end_date;
    if (endDate) {
      endDate = new Date(endDate).toLocaleDateString(undefined, options);
    }
    let lastUpdatedDate = relationship.attributes.updated_at;
    if (lastUpdatedDate) {
      lastUpdatedDate = new Date(lastUpdatedDate).toLocaleDateString(
        undefined,
        options
      );
    }
    return {
      id: relationship.attributes.id,
      firstEntityId: String(relationship.attributes.entity1_id),
      secondEntityId: String(relationship.attributes.entity2_id),
      firstEntity: firstEntity,
      secondEntity: secondEntity,
      firstEntityDescription: relationship.attributes.description1,
      secondEntityDescription: relationship.attributes.description2,
      category: relationship.attributes.category_id,
      description: description,
      amount: amount,
      goods: relationship.attributes.goods,
      startDate: startDate,
      endDate: endDate,
      lastUpdatedDate: lastUpdatedDate,
      link: relationship.self,
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

  async function getOligrapherEdges(id, ids, callback) {
    let url = `https://littlesis.org/oligrapher/get_edges?entity1_id=${id}&entity2_ids=${ids}`;
    axios
      .get(url)
      .then((response) => {
        if (callback) {
          callback(response.data);
        }
      })
      .catch((error) => {
        console.error(`Error fetching edges for ${id}`, error);
      });
  }

  return {
    getEntity,
    getRelationship,
    getEntityRelationships,
    searchEntitiesByName,
    getConnections,
    getOligrapherEdges,
  };
}

export default useLittleSisService;
