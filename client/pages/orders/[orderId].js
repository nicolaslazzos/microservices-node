import React from "react";
import Router from "next/router";
import { Card, Image, Button, Message, Progress } from "semantic-ui-react";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "../../hooks/use-request";

const OrderDetails = ({ user, order }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [progress, setProgress] = React.useState(100);

  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/payments",
    body: { orderId: order.id },
    onSuccess: () => Router.push("/")
  });

  React.useEffect(async () => {
    const init = new Date(order.expiresAt) - new Date();

    if (init <= 0) {
      setProgress(0);
    } else {
      const interval = setInterval(() => {
        const left = new Date(order.expiresAt) - new Date();

        const percent = left > 0 ? (left * 100) / init : 0;

        setProgress(Math.round(percent));
      }, 1000);

      return () => {
        interval && clearInterval(interval);
      };
    }
  }, []);

  React.useEffect(() => {
    if (errors?.all?.length) {
      setError(true);

      setTimeout(() => setError(false), 5000);
    }
  }, [errors]);

  const setColor = () => {
    if (progress > 50) {
      return { success: true };
    } else if (progress <= 50 && progress > 0) {
      return { warning: true };
    } else {
      return { error: true };
    }
  };

  const onPayPress = () => {
    const button = document.getElementById(`pyament_button_${order.id}`).children[0];
    button.click();
  };

  const onSubmit = async ({ id }) => {
    setLoading(true);
    await doRequest({ token: id });
    setLoading(false);
  };

  const renderOrder = (order) => {
    if (!order) return null;

    const expired = progress === 0;

    return (
      <Card key={order.id}>
        <Image
          src="https://cdn.dribbble.com/users/1572277/screenshots/7351549/media/69a47a5517f2ab3fea00ef819c29103a.png?compress=1&resize=400x300"
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{order.ticket.title}</Card.Header>
          <Card.Meta>
            <span className="date">Order ID: {order.id}</span>
          </Card.Meta>
          <Card.Description>Price: U$D {order.ticket.price}</Card.Description>
          <br />
          <Card.Description>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Card.Description>

          {error && <Message error list={errors?.all} />}
        </Card.Content>
        {order.status !== "complete" && (
          <Card.Content extra>
            <Progress style={expired ? {} : { marginBottom: 10 }} percent={progress} progress {...setColor()}>
              {expired && "Order Expired"}
            </Progress>
            {!expired && (
              <Button loading={loading} basic color="green" onClick={onPayPress}>
                Pay
              </Button>
            )}
          </Card.Content>
        )}
      </Card>
    );
  };

  return (
    <div style={styles.container}>
      {renderOrder(order)}
      <div id={`pyament_button_${order.id}`} style={{ display: "none" }}>
        <StripeCheckout
          token={onSubmit}
          stripeKey="pk_test_51IJT7YJvtsXgcw4mtyaNvsAdu3DNKX1jt62ZLrQov6HZmg45x1az6FD9zJAykhfY7bfsYbg7BrMh0vLxIynQgrIp00MpJQe4PJ"
          email={user.email}
          amount={order.ticket.price * 100}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

OrderDetails.getInitialProps = async (context, client, user) => {
  try {
    const { orderId } = context.query;

    const res = await client.get(`/api/orders/${orderId}`);

    return { order: res.data };
  } catch (e) {
    return {};
  }
};

export default OrderDetails;
