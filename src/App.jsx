import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import CreateMenu from './components/CreateMenu';
import EditMeal from './components/EditMeal';
import CreateMeal from './components/CreateMeal';
import EditMealRecipe from './components/EditMealRecipe';
import PlansCoupons from './components/PlansCoupons';
import Zones from './components/Zones';
import OrdersIngredients from './components/OrdersIngredients';
import Customers from './components/Customers';
import GoogleAnalytics from './components/GoogleAnalytics';
import Notifications from './components/Notifications'

import './App.css'

function App() {
  // Store nav bar as variable, then put above pages
  // Allow for easier integration with log in when needed
  //  and avoid reloading nav bar when switching between routes
  const navBar = <NavBar />;
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            {navBar}
            <Home />
          </Route>
          <Route path="/create-menu">
            {navBar}
            <CreateMenu />
          </Route>
          <Route path="/edit-meal">
            {navBar}
            <EditMeal />
          </Route>
          <Route path="/create-meal">
            {navBar}
            <CreateMeal />
          </Route>
          <Route path='/edit-meal-recipe'>
            {navBar}
            <EditMealRecipe />
          </Route>
          <Route path='/plans-coupons'>
            {navBar}
            <PlansCoupons />
          </Route>
          <Route path='/zones'>
            {navBar}
            <Zones />
          </Route>
          <Route path='/order-ingredients'>
            {navBar}
            <OrdersIngredients />
          </Route>
          <Route path='/customers'>
            {navBar}
            <Customers />
          </Route>
          <Route path='/google-analytics'>
            {navBar}
            <GoogleAnalytics />
          </Route>
          <Route path='/notifications'>
            {navBar}
            <Notifications />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
