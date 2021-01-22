import React from "react";
import Router from "next/router";
import { Header, Button, Form, Input, Message } from "semantic-ui-react";

import useRequest from "../../hooks/use-request";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({ email: "", password: "" });
  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/users/signup",
    body: data,
    onSuccess: () => Router.push("/"),
  });

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await doRequest();
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Header as="h2">Sign Up</Header>
      <Form
        onSubmit={onSubmit}
        style={styles.form}
        error={!!errors?.errors?.length}
      >
        <Form.Field
          label="Email"
          type="text"
          name="email"
          placeholder="johndoe@gmail.com"
          control={Input}
          onChange={onChange}
          error={errors?.email}
        />
        <Form.Field
          label="Password"
          type="password"
          name="password"
          placeholder="************"
          control={Input}
          onChange={onChange}
          error={errors?.password}
        />
        <Message error list={errors?.errors} />
        <Button type="submit" primary loading={loading}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: { width: 400 },
};

export default SignUp;
