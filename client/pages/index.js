import buildClient from "../api/build-client";

const App = ({ user }) => {
  return <h1>{user ? "You are signed in!" : "You are not signed in!"}</h1>;
};

App.getInitialProps = async (context) => {
  try {
    const response = await buildClient(context).get(`/api/users/currentuser`);

    return response.data;
  } catch (e) {
    return {};
  }
};

export default App;
