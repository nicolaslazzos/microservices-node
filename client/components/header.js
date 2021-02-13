import React from "react";
import { Segment, Header, Button, Image } from "semantic-ui-react";

const logo = require('../images/ticket-logo.png')

const HeaderComponent = ({ user }) => {
  return (
    <Segment style={styles.container}>
      <a href="/">
        <div style={styles.logo}>
          <Image src={logo} avatar />
          <Header as="h2" style={styles.title}>
            GitTix
          </Header>
        </div>
      </a>
      <div style={styles.actions}>
        {!!user && (
          <Button href="/orders" basic color="green" style={styles.button}>
            My Orders
          </Button>
        )}
        {!!user && (
          <Button href="/tickets/new" color="green" style={styles.button}>
            Sell Tickets
          </Button>
        )}
        {!!user && (
          <Button href="/auth/signout" color="red" style={styles.button}>
            Sign Out
          </Button>
        )}
        {!user && (
          <Button href="/auth/signin" primary style={styles.button}>
            Sign In
          </Button>
        )}
        {!user && (
          <Button href="/auth/signup" primary style={styles.button}>
            Sign Up
          </Button>
        )}
      </div>
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
    justifyContent: "space-between",
    borderRadius: 0,
    margin: 0
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  button: { marginLeft: 10 },
  title: { margin: 0, marginLeft: 5 },
  logo: { display: "flex", flexDirection: "row" }
};

export default HeaderComponent;
