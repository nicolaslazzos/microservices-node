import React from "react";
import Router from "next/router";
import { Message, Icon } from "semantic-ui-react";

import useRequest from "../../hooks/use-request";

const SignOut = () => {
  const [errors, doRequest] = useRequest({
    method: "post",
    url: "/api/users/signout",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  React.useEffect(() => {
    doRequest();
  }, []);

  return (
    <Message icon positive>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
        We are signing you out...
      </Message.Content>
    </Message>
  );
};

export default SignOut;
