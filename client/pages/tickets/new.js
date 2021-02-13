import React from "react";
import Router from "next/router";
import { Header, Button, Form, Input, Message } from "semantic-ui-react";

import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({ title: "", price: 0 });
  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/tickets",
    body: data,
    onSuccess: () => Router.push("/")
  });

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await doRequest();
    setLoading(false);
  };

  const onBlur = () => {
    const value = parseFloat(data.price);

    if (!isNaN(value)) return;

    setData({ ...data, price: value.toFixed(2) });
  };

  return (
    <div style={styles.container}>
      <Header as="h2">Create a Ticket</Header>
      <Form onSubmit={onSubmit} style={styles.form} error={!!errors?.errors?.length}>
        <Form.Field
          label="Title"
          type="text"
          name="title"
          placeholder="Good Faith - World Tour 2021"
          control={Input}
          onChange={onChange}
          error={errors?.title}
        />
        <Form.Field
          label="Price"
          type="number"
          name="price"
          placeholder="20"
          onBlur={onBlur}
          control={Input}
          onChange={onChange}
          error={errors?.price}
        />
        <Message error list={errors?.errors} />
        <Button type="submit" primary loading={loading}>
          Save
        </Button>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: { width: 400 }
};

export default NewTicket;
