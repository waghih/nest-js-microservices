import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Orders from './container/Orders';
import NewOrder from "./container/Orders/Create";
import ShowOrder from "./container/Orders/Show";
import { SnackbarProvider } from 'notistack';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  return (
    <SnackbarProvider maxSnack={1}>
      <Router forceRefresh>
        <div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/orders" />} />
            <Route exact path="/orders/new" component={NewOrder} />
            <Route exact path="/orders/:id" component={ShowOrder} />
            <Route exact path="/orders" component={Orders} />
          </Switch>
        </div>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
