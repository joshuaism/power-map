import { useState, useEffect } from "react";

function InfoBoxEdge({ id }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function runOnce() {
      try {
        let response = await fetch(
          `https://littlesis.org/api/relationships/${id}`
        );
        if (response.ok) {
          let json = await response.json();
          console.log("set data for " + id);
          let relationship = populateRelationship(json);
          setApiData(relationship);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    runOnce();
  }, []);

  function populateRelationship(json) {
    let firstEntityName =
      json.data.attributes.entity1_id === json.included[0].id
        ? json.included[0].attributes.name
        : json.included[1].attributes.name;
    let secondEntityName =
      json.data.attributes.entity2_id === json.included[0].id
        ? json.included[0].attributes.name
        : json.included[1].attributes.name;
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
      firstEntityName: firstEntityName,
      secondEntityName: secondEntityName,
      firstEntityId: json.data.attributes.entity1_id,
      secondEntityId: json.data.attributes.entity2_id,
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

  return (
    <>
      {apiData ? (
        // Render your component using the fetched data
        <MyComponent data={apiData} />
      ) : (
        // Render a loading state or placeholder
        <p>Loading...</p>
      )}
    </>
  );
}

const MyComponent = ({ data }) => {
  if (data.category === 5) {
    let description = data.amount
      ? data.description.replace("money", data.amount)
      : data.description;
    return (
      <div>
        <p>{description}</p>
        <p>
          <a href={data.link} target="_blank">
            link
          </a>
        </p>
      </div>
    );
  }
  if (data.category === 3) {
    return (
      <div>
        <p>{data.description}</p>
        <p>
          {data.firstEntityName}: {data.firstEntityDescription}
        </p>
        <p>
          {data.secondEntityName}: {data.secondEntityDescription}
        </p>
        {data.startDate || data.endDate ? (
          <p>
            {data.startDate} - {data.endDate}
          </p>
        ) : null}
        <p>
          <a href={data.link} target="_blank">
            link
          </a>
        </p>
      </div>
    );
  }
  return (
    <div>
      <p>{data.description}</p>
      <p>
        {data.firstEntityName}: {data.firstEntityDescription}
      </p>
      <p>
        {data.secondEntityName}: {data.secondEntityDescription}
      </p>
      <p>{data.amount}</p>
      <p>{data.goods}</p>
      <p>category: {data.category}</p>
      <p>
        <a href={data.link} target="_blank">
          link
        </a>
      </p>
    </div>
  );
};

export default InfoBoxEdge;
