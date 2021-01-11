import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import {
  Breadcrumb, Container, Row, Col, Form
} from 'react-bootstrap';

import { CustomerContext } from './customerContext';
import LatestActivity from './LatestActivity';
import DeliveryInfo from './DeliveryInfo';
import WeeklyMealSelections from './WeeklyMealSelections';
import AllPayments from './AllPayments';

const initialState = {
  customers: [],
  customerId: '',
  purchaseId: '',
  paymentId: '',
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_CUSTOMERS':
      return {
        ...state,
        customers: action.payload,
      }
    case 'SELECT_CUSTOMER':
      return {
        ...state,
        customerId: action.payload,
        purchaseId: '',
        paymentId: '',
      }
    case 'SELECT_PURCHASE':
      return {
        ...state,
        purchaseId: action.payload.purchaseId,
        paymentId: action.payload.paymentId,
      }
    default:
      return state
  }
}

function Customers() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get(`${BASE_URL}customer_infos`)
      .then((response) => {
        if(response.status === 200) {
          const customers_api = response.data.result;
          dispatch({ type: 'FETCH_CUSTOMERS', payload: customers_api });
        }
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

  const selectCustomer = (customer) => {
    dispatch({ type: 'SELECT_CUSTOMER', payload: customer });
  }

  return (
    <div>
      <CustomerContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
          <Breadcrumb.Item active> Customers </Breadcrumb.Item>
        </Breadcrumb>
        <Container
          style={{
            maxWidth: 'inherit',
          }}
        >
          <Row>
            <Col>
              <Form>
                <Form.Group as={Row}>
                  <Form.Label column sm='2'>
                    Customers
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control
                      as='select'
                      value={state.customerId}
                      onChange={
                        (event) => selectCustomer(event.target.value)
                      }
                    >
                      <option value="" hidden> Choose customer </option>
                      {
                        state.customers.map(
                          (customer) => (
                            <option
                              key={customer.customer_uid}
                              value={customer.customer_uid}
                            >
                              {`${customer.customer_first_name} ${customer.customer_last_name} ${customer.customer_email}`}
                            </option>
                          )
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
              <LatestActivity />
            </Col>
          </Row>
          <Row>
            <Col md='4' lg='2'>
              <span> Purchase Id: {state.purchaseId} </span>
              <DeliveryInfo />
            </Col>
            <Col md='8' lg='10'>
              <Row>
                <Col>
                  <WeeklyMealSelections />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AllPayments />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </CustomerContext.Provider>
    </div>
  )
}

export default Customers;
