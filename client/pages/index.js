import Link from "next/link";
import { Card, Image, Button } from "semantic-ui-react";

const placeholder = require("../images/ticket-placeholder.png");

const App = ({ user, tickets }) => {
  const renderTicket = (ticket) => {
    return (
      <Card key={ticket.id}>
        <Image src={placeholder} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{ticket.title}</Card.Header>
          <Card.Description>Price: U$D {ticket.price}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <Button basic color="green">
              View
            </Button>
          </Link>
        </Card.Content>
      </Card>
    );
  };

  return <Card.Group>{tickets?.map(renderTicket)}</Card.Group>;
};

App.getInitialProps = async (context, client, user) => {
  try {
    const res = await client.get("/api/tickets");

    return { tickets: res.data };
  } catch (e) {
    return {};
  }
};

export default App;
