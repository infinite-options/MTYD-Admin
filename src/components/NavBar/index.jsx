import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

function NavBar() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Meal To Your Door</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse animation="false">
          <Nav className="mr-auto" style={{ marginLeft: '3%' }}>
            <NavDropdown title="Meals & Menus">
              <NavDropdown.Item
                href="/create-menu"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                }}
              >
                Create / Edit Menus
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/edit-meal"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'honeydew',
                }}
              >
                Edit Meals
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/create-meal"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                }}
              >
                Create Meals
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/edit-meal-recipe"
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  backgroundColor: 'honeydew',
                }}
              >
                Edit Meal Recipes
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              href="/plans-coupons"
            >
              Plans & Coupons
            </Nav.Link>

            <Nav.Link
              href="/order-ingredients"
            >
              Orders & Ingredients
            </Nav.Link>

            <Nav.Link
              href="/customers"
            >
              Customers
            </Nav.Link>

            <Nav.Link
              href="/google-analytics"
            >
              Google Analytics
            </Nav.Link>

            <Nav.Link
              href="/notifications"
            >
              Notifications
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/zones"> Zones </Nav.Link>
            <Nav.Link href="/">Profile</Nav.Link>
            <Nav.Link href="/">
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
