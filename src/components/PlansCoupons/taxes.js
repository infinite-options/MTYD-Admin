import { useEffect, useReducer } from 'react';
// import axios from 'axios';
import {
  Row, Col, Table,
} from 'react-bootstrap';

const initialState = {
  taxDates: [],
  editingTaxDate: false,
  editedTaxDate: {},
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_TAXES':
      return {
        ...state,
        taxDates: action.payload,
      }
    default:
      return state;
  }
}

function Taxes () {
  // eslint-disable-next-line
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch Taxes
  useEffect(() => {
    // axios
    //   .get('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/coupons')
    //   .then((response) => {
    //     const couponsApiResult = response.data.result;
    //     dispatch({ type: 'FETCH_COUPONS', payload: couponsApiResult});
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       // eslint-disable-next-line no-console
    //       console.log(err.response);
    //     }
    //     // eslint-disable-next-line no-console
    //     console.log(err);
    //   });
    // const taxApiResult = [
    //   {
    //     id: '1',
    //     delivery_date: '2020-12-26',
    //     tax_rate: '8'
    //   },
    //   {
    //     id: '2',
    //     delivery_date: '2021-01-02',
    //     tax_rate: '8'
    //   }
    // ];
    // dispatch({ type: 'FETCH_TAXES', payload: taxApiResult })
  },[])

  return (
    <>
      <Row
        style={{
          marginTop: '4rem'
        }}
      >
        <Col>
          <h5>
            Tax Rate
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th> Delivery Date </th>
                <th> Tax Rate </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> 2020-12-26 </td>
                <td> 8 </td>
              </tr>
              <tr>
                <td> 2020-01-02 </td>
                <td> 8 </td>
              </tr>
              {/* {
                state.taxDates.map(
                  (date) => {
                    return (
                      <tr
                        key={date.id}
                      >
                        <td> {date.delivery_date} </td>
                        <td> {date.tax_rate} </td>
                      </tr>
                    )
                  }
                )
              } */}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}

export default Taxes;