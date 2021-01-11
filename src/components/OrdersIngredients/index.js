import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { formatTime } from '../../helperFuncs';
import {
  Breadcrumb, Container, Row, Col, Form, Table
} from 'react-bootstrap';

const initialState = {
  ordersData: [],
  selectedDate: '',
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_ORDERS':
      return {
        ...state,
        ordersData: action.payload,
      }
    case 'CHANGE_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      }
    default:
      return state;
  }
}

function OrdersIngredients() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getOrderDates = () => {
    const orderDates = state.ordersData.map((orderItem) => formatTime(orderItem.d_menu_date));
    const orderDatesUnique = orderDates.filter((elt, index) => orderDates.indexOf(elt) === index);
    orderDatesUnique.sort();
    return orderDatesUnique;
  }

  const getOrderData = () => {
    const curOrders = state.ordersData.filter((order) => formatTime(order.d_menu_date) === state.selectedDate);
    return curOrders;
  }

  // Fetch orders
  useEffect(() => {
    axios
      .get(`${BASE_URL}Orders_by_Items_total_items`)
      .then((response) => {
        const ordersApi = response.data.result;
        dispatch({ type: 'FETCH_ORDERS', payload: ordersApi});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  },[])

  // Change date 
  const changeDate = (newDate) => {
    dispatch({ type: 'CHANGE_DATE', payload: newDate })
  }

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
                    value={state.selectedDate}
                    onChange={
                      (event) => {
                        changeDate(event.target.value);
                      }
                    }
                  >
                    <option value="" hidden>Choose date</option>
                    {
                      getOrderDates().map(
                        (date) => (
                          <option value={date} key={date}>
                            {date}
                          </option>
                        ),
                      )
                    }
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
                  <th> Meal Name </th>
                  <th> Quantity </th>
                </tr>
              </thead>
              <tbody>
                {
                  getOrderData().map(
                    (order, orderIndex) => {
                      return (
                        <tr
                          key={orderIndex}
                        >
                          <td> {order.d_menu_date} </td>
                          <td> {order.jt_name} </td>
                          <td> {order['sum(jt_qty)']} </td>
                        </tr>
                      );
                    }
                  )
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default OrdersIngredients;
