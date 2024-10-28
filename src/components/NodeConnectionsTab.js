import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import NodeConnections from "./NodeConnections";

function NodeConnectionsTab({ id, createNode }) {
  const [category, setCategory] = useState(0);

  return (
    <>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Category
      </InputLabel>
      <NativeSelect
        defaultValue={category}
        onChange={(event) => setCategory(event.target.value)}
        inputProps={{
          name: "category",
          id: "uncontrolled-native",
        }}
      >
        <option value={0}>All Categories</option>
        <option value={1}>Executive Roles</option>
        <option value={2}>Schools Attended</option>
        <option value={3}>Offices Held</option>
        <option value={4}>Family Members</option>
        <option value={5}>Donations</option>
        <option value={6}>Business Relations</option>
        <option value={7}>Lobbying</option>
        <option value={8}>Social Relations</option>
        <option value={9}>Professional Relations</option>
        <option value={10}>Shareholder Roles</option>
        <option value={11}>Related Companies</option>
        <option value={12}>Uncategorized Relations</option>
      </NativeSelect>
      <NodeConnections
        key={`${id} ${category}`}
        id={id}
        category={category}
        createNode={createNode}
      />
    </>
  );
}

export default NodeConnectionsTab;
