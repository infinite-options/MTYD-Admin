import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import {
  Table
} from 'react-bootstrap';

const initialState = {
  payments: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_PAYMENTS':
      return {
        ...state,
        payments: action.payload,
      }
    default:
      return state
  }
}

function AllPayments() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.purchaseId !== '') {
      axios
        .get(`${BASE_URL}payment_info_history/${customerContext.state.purchaseId}`)
        .then((response) => {
          const paymentInfo = response.data.result;
          // Parse Json object in items
          for(let index = 0; index < paymentInfo.length; index++) {
            paymentInfo[index].items = JSON.parse(paymentInfo[index].items)
          }
          dispatch({ type: 'FETCH_PAYMENTS', payload: paymentInfo});
        })
        .catch((err) => {
          if(err.response) {
            // eslint-disable-next-line no-console
            console.log(err.response);
          }
          // eslint-disable-next-line no-console
          console.log(err);
        })
    }
  },[customerContext.state.purchaseId])

  return (
    <>
      <h5> All Payments </h5>
      <Table striped hover>
        <thead>
          <tr>
            <td> Payment Id </td>
            <td> Meal Plan Description </td>
            <td> Amount Due </td>
            <td> Amount Paid </td>
            <td> Payment Time Stamp </td>
            <td> Payment Type </td>
            <td> Addon </td>
          </tr>
        </thead>
        <tbody>
          {
            state.payments.map(
              (payment) => {
                return (
                  <tr
                    key={payment.payment_uid}
                  >
                    <td> {payment.payment_uid} </td>
                    <td> {payment.items[0].name} </td>
                    <td> {payment.amount_due} </td>
                    <td> {payment.amount_paid} </td>
                    <td> {payment.payment_time_stamp} </td>
                    <td> {payment.payment_type} </td>
                    <td> {payment.info_is_Addon} </td>
                  </tr>
                )
              }
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default AllPayments;