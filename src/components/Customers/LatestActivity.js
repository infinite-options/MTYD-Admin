import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import {
  Table
} from 'react-bootstrap';

const initialState = {
  customerActivity: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_CUSTOMER_ACTIVITY':
      return {
        ...state,
        customerActivity: action.payload,
      }
    default:
      return state
  }
}

function LatestActivity() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.customerId !== '') {
      axios
        .get(`${BASE_URL}customer_lplp`,{
          params: {
            customer_uid: customerContext.state.customerId
          }
        })
        .then((response) => {
          const customerActivity = response.data.result;
          if(customerActivity) {
            // Parse JSON object in items
            for(let index = 0; index < customerActivity.length; index++) {
              customerActivity[index].items = JSON.parse(customerActivity[index].items);
            }
            dispatch({ type: 'FETCH_CUSTOMER_ACTIVITY', payload: customerActivity });
          } else {
            dispatch({ type: 'FETCH_CUSTOMER_ACTIVITY', payload: initialState.customerActivity });
          }
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
  },[customerContext.state.customerId])

  const selectPurchase = (activity) => {
    const payload = {
      purchaseId: activity.purchase_uid,
      paymentId: activity.payment_uid,
    }
    customerContext.dispatch({ type: 'SELECT_PURCHASE', payload: payload });
  }

  return (
    <>
      <Table hover>
        <thead>
          <tr>
            <th> Email </th>
            <th> Phone </th>
            <th> Purchase Id </th>
            <th> Purchase Status </th>
            <th> Meal Plan ID </th>
            <th> Meal Plan Description </th>
            <th> Delivery First Name </th>
            <th> Delivery Last Name </th>
            <th> Delivery Phone </th>
            <th> Payment ID </th>
            <th> Coupon </th>
            <th> Amount Due </th>
            <th> Amount Paid </th>
            <th> Time Paid </th>
            <th> Credit Card </th>
          </tr>
        </thead>
        <tbody>
          {
            state.customerActivity.map(
              (activity) => {
                return (
                  <tr
                    key={activity.purchase_uid}
                    onClick={
                      () => {
                        selectPurchase(activity)
                      }
                    }
                  >
                    <td> {activity.customer_email} </td>
                    <td> {activity.customer_phone_num} </td>
                    <td> {activity.purchase_uid} </td>
                    <td> {activity.purchase_status} </td>
                    <td> {activity.items[0].item_uid} </td>
                    <td> {activity.items[0].name} </td>
                    <td> {activity.delivery_first_name} </td>
                    <td> {activity.delivery_last_name} </td>
                    <td> {activity.delivery_phone_num} </td>
                    <td> {activity.payment_uid} </td>
                    <td> {activity.pay_coupon_id} </td>
                    <td> {activity.amount_due} </td>
                    <td> {activity.amount_paid} </td>
                    <td> {activity.payment_time_stamp} </td>
                    <td> {activity.cc_num} </td>
                  </tr>
                )
              }
            )
          }
        </tbody>
      </Table>
    </>
  );
}

export default LatestActivity;