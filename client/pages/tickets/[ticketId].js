import React from "react";
import Router from "next/router";
import { Card, Image, Button, Message } from "semantic-ui-react";

import useRequest from "../../hooks/use-request";

const placeholder = require("../../images/ticket-placeholder.png");

const TicketDetails = ({ user, ticket }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/orders",
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      console.log(order);
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    }
  });

  React.useEffect(() => {
    if (errors?.all?.length) {
      setError(true);

      setTimeout(() => setError(false), 5000);
    }
  }, [errors]);

  const onSubmit = async () => {
    setLoading(true);
    await doRequest();
    setLoading(false);
  };

  const renderTicket = (ticket) => {
    if (!ticket) return null;

    return (
      <Card key={ticket.id}>
        <Image src={placeholder} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{ticket.title}</Card.Header>
          <Card.Meta>
            <span className="date">Ticket ID: {ticket.id}</span>
          </Card.Meta>
          <Card.Description>Price: U$D {ticket.price}</Card.Description>

          {error && <Message error list={errors?.all} />}
        </Card.Content>
        <Card.Content extra>
          <Button loading={loading} basic color="green" onClick={onSubmit}>
            Purchase
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return <div style={styles.container}>{renderTicket(ticket)}</div>;
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

TicketDetails.getInitialProps = async (context, client, user) => {
  try {
    const { ticketId } = context.query;

    const res = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: res.data };
  } catch (e) {
    return {};
  }
};

export default TicketDetails;
