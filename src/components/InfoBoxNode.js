import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import NodeDetails from "./NodeDetails";
import NodeConnectionsTab from "./NodeConnectionsTab";

function InfoBoxNode({ id, createEdgeAndNode, fillNodeNetwork }) {
  const [openTab, setOpenTab] = useState("Details");

  return (
    <div>
      <TabContext value={openTab}>
        <TabList
          onChange={(event, newValue) => {
            setOpenTab(newValue);
          }}
        >
          <Tab label="Details" value="Details" />
          <Tab label="Connections" value="Connections" />
        </TabList>
        <TabPanel value="Details">
          <NodeDetails id={id} fillNodeNetwork={fillNodeNetwork} />
        </TabPanel>
        <TabPanel value="Connections">
          <NodeConnectionsTab id={id} createEdgeAndNode={createEdgeAndNode} />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default InfoBoxNode;
