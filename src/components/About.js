export default function About() {
  return (
    <div style={{ margin: "auto", maxWidth: "500px" }}>
      <h1>About Power Map</h1>
      <h3>
        Power Map is a visual tool for exploring connections in the{" "}
        <a href="https://littlesis.org" target="_blank">
          littlesis.org
        </a>{" "}
        database
      </h3>
      <h3>How To Use</h3>
      <p>
        Type the name of a powerful person or organization to get the drop down
        populated, then select a name from the dropdown. At this point the map
        will be populated with that entity's node and up to 15-30 of their
        connections. From there you can click on nodes shown in the map to
        expand their connections. Additional connections can be searched in the
        sidebar and added to the map when clicked on. Double clicking a node
        will collapse that node and it's connections. Single clicking a node
        will expand it. Right clicking on a node will delete the node from the
        Power Map.
      </p>
      <h3>Why?</h3>
      <p>
        Power Map is all about exploration and doesn't require as much prior
        knowledge about targets to get started in understanding the connections
        between the rich and powerful as littlesis.org's{" "}
        <a href="https://littlesis.org/oligrapher/" target="_blank">
          oligrapher
        </a>{" "}
        does.
      </p>
    </div>
  );
}
