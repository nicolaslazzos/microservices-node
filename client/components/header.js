import React from "react";
import { Segment, Header as Header } from "semantic-ui-react";

const HeaderComponent = ({ title }) => {
  return (
    <Segment style={styles.container}>
      <Header as="h3">{title}</Header>
    </Segment>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 0,
  },
};

export default HeaderComponent;
