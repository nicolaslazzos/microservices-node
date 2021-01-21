import React from "react";
import Router from "next/router";
import { Header, Button, Form, Input } from "semantic-ui-react";

import useRequest from "../../hooks/use-request";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({ email: "", password: "" });
  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/users/signup",
    body: data,
    onSuccess: () => Router.push('/')
  });

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await doRequest();
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Header as="h2">Sign Up</Header>
      <Form onSubmit={onSubmit} style={{ width: 400 }}>
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
        <Button type="submit" primary loading={loading}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
