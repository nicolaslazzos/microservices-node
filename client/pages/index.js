import Link from "next/link";
import { Card, Image, Button } from "semantic-ui-react";

const App = ({ user, tickets }) => {
  const renderTicket = (ticket, index) => {
    return (
      <Card key={ticket.id}>
        <Image
          src="https://cdn.dribbble.com/users/1572277/screenshots/7351549/media/69a47a5517f2ab3fea00ef819c29103a.png?compress=1&resize=400x300"
          wrapped
          ui={false}
        />
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

  return <Card.Group>{tickets.map(renderTicket)}</Card.Group>;
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
