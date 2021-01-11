import { useContext, useEffect, useReducer } from 'react';
import { CustomerContext } from './customerContext';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import PropTypes from 'prop-types';
import {
  Table
} from 'react-bootstrap';

function MealSelectionRow ({data}) {
  const numItems = data['group_concat(jt_name)'].length;
  const mealSelectionRows = [];
  for (let itemIndex=0; itemIndex < numItems; itemIndex++) {
    mealSelectionRows.push(
      <tr>
        <td> {data.d_menu_date} </td>
        <td> {data['group_concat(jt_name)'][itemIndex]} </td>
        <td> {data['group_concat(jt_qty)'][itemIndex]} </td>
      </tr>
    )
  }
  return (
    <>
      {mealSelectionRows}
    </>
  )
}

MealSelectionRow.propTypes = {
  data: PropTypes.object,
}

const initialState = {
  mealSelections: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_MEAL_SELECTIONS':
      return {
        ...state,
        mealSelections: action.payload,
      }
    default:
      return state
  }
}

function WeeklyMealSelections() {
  const customerContext = useContext(CustomerContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(customerContext.state.purchaseId !== '') {
      axios
        .get(`${BASE_URL}Orders_by_Purchase_Id_with_Pid/${customerContext.state.purchaseId}`)
        .then((response) => {
          const mealSelections = response.data.result;
          // Parse Json object in sub properties
          for(let index = 0; index < mealSelections.length; index++) {
            // Convert name and qty to lists
            const nameList = mealSelections[index]['group_concat(jt_name)']
            const qtyList = mealSelections[index]['group_concat(jt_qty)']
            if(nameList !== 'SKIP') {
              mealSelections[index]['group_concat(jt_name)'] = nameList.split(',');
              mealSelections[index]['group_concat(jt_qty)'] = qtyList.split(',');
            } else {
              mealSelections[index]['group_concat(jt_name)'] = ['SKIP'];
              mealSelections[index]['group_concat(jt_qty)'] = ['N/A'];
            }
          }
          dispatch({ type: 'FETCH_MEAL_SELECTIONS', payload: mealSelections });
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
      <h5> Weekly Meal Selections </h5>
      <Table striped hover>
        <thead>
          <tr>
            <td> Menu Day </td>
            <td> Meal Name </td>
            <td> Total </td>
          </tr>
        </thead>
        <tbody>
          {
            state.mealSelections.map(
              (mealSelection,mealSelectionIndex) => {
                return (
                  <MealSelectionRow key={mealSelectionIndex} data={mealSelection}/>
                )
              }
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default WeeklyMealSelections;