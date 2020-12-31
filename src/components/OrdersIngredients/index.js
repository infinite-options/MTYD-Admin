import {
  Breadcrumb, Container, Row, Col, Form, Table
} from 'react-bootstrap';

function OrdersIngredients() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Orders & Ingredients </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    as="select"
                  >
                    <option value="" hidden>Choose date</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped hover>
            <thead>
                <tr>
                  <th> Menu Date </th>
                  <th> Menu Category </th>
                  <th> Meal Category </th>
                  <th> Meal Type </th>
                  <th> Meal Category </th>
                  <th> Meal ID </th>
                  <th> Meal Name </th>
                  <th> Default Meal </th>
                  <th> Extra Meal Price </th>
                  <th> Total </th>
                </tr>
              </thead>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default OrdersIngredients;
