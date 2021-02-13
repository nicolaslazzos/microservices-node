import "semantic-ui-css/semantic.min.css";
import "../styles/global.css";

import Header from "../components/header";

import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, user }) => (
  <>
    <Header user={user} />
    <div style={{ padding: 40 }}>
      <Component {...pageProps} user={user} />
    </div>
  </>
);

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  try {
    const client = buildClient(ctx);
    const response = await client.get(`/api/users/currentuser`);

    // if we execute the getInitialProps in the AppComponent (_app.js), the getInitialProps in the Component
    // of the selected page is not executed, so we have to do it manually
    let pageProps = {};

    if (Component?.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, client, response?.data?.user);
    }

    // this object is going to be provided as props in the AppComponent (_app.js)
    return { pageProps, ...response.data };
  } catch (e) {
    return {};
  }
};

export default AppComponent;
