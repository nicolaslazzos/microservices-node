import axios from "axios";

const buildClient = ({ req }) => {
  // if is executed in the server, we react out directly to the ingress-service
  // else, if is executed in the browser, we react out to the current domain

  if (typeof window === "undefined") {
    // if the request is made in the server, we need to pass the headers coming from the web

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req?.headers,
    });
  } else {
    return axios;
  }
};

export default buildClient;
