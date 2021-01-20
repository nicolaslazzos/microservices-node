import React from "react";
import axios from "axios";
import { TextInput, Button } from "evergreen-ui";

const SignUp = () => {
  const [data, setData] = React.useState({ email: "", password: "" });

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("/api/users/signup", data);
    } catch (e) {}
  };

  return (
    <form onSubmit={onSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          alignItems: "flex-end",
        }}
      >
        <TextInput
          type="text"
          name="email"
          placeholder="johndoe@gmail.com"
          width="100%"
          style={{ marginBottom: 10 }}
          onChange={onChange}
        />

        <TextInput
          type="password"
          name="password"
          placeholder="*************"
          width="100%"
          style={{ marginBottom: 10 }}
          onChange={onChange}
        />
        <Button appearance="primary" type="submit">
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SignUp;
