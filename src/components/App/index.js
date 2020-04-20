import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import Products from '../Products';

import {
  GlobalStyles,
  Header,
  Content,
  NavOpenButton,
  Nav,
  NavItems,
  NavItem,
  Logo,
  NavCloseWrapper,
  NavCloseButton,
} from './styles';

export default function App() {
  const [navActive, setNavActive] = useState(false);

  return (
    <>
      <GlobalStyles />

      <Router>
        <Header>
          <Logo>
            <h2>Restaurant</h2>
          </Logo>

          <NavOpenButton navActive={navActive} onClick={() => setNavActive(true)}><i className="fas fa-bars" /></NavOpenButton>

          <Nav active={navActive}>
            <NavCloseWrapper navActive={navActive}>
              <NavCloseButton onClick={() => setNavActive(false)}>
                <i className="fas fa-times" />
              </NavCloseButton>
            </NavCloseWrapper>
            <NavItems>
              <NavItem>
                <NavLink activeClassName="active" exact to="/" onClick={() => setNavActive(false)}>Order</NavLink>
              </NavItem>
              
            </NavItems>
          </Nav>
        </Header>

        <Content>
          <Switch>
        

            <Route exact path="/">
              <Products />
            </Route>
          </Switch>
        </Content>
      </Router>
    </>
  );
}
