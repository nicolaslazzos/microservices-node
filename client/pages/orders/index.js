import React from "react";
import Link from "next/link";
import { Card, Image, Button } from "semantic-ui-react";

const placeholder = require("../../images/ticket-placeholder.png");

const OrdersList = ({ user, orders }) => {
  const renderOrder = (order) => {
    return (
      <Card key={order.id}>
        <Image src={placeholder} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{order.ticket.title}</Card.Header>
          <Card.Meta>
            <span className="date">Order ID: {order.id}</span>
          </Card.Meta>
          <Card.Description>Price: U$D {order.ticket.price}</Card.Description>
          <br />
          <Card.Description>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
            <Button basic color="green">
              View
            </Button>
          </Link>
        </Card.Content>
      </Card>
    );
  };

  return <Card.Group>{orders?.map(renderOrder)}</Card.Group>;
};

OrdersList.getInitialProps = async (context, client, user) => {
  try {
    const res = await client.get(`/api/orders`);

    return { orders: res.data };
  } catch (e) {
    return {};
  }
};

export default OrdersList;
