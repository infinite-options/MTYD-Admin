import { useEffect, useReducer } from 'react';
import axios from 'axios';
import {
  Row, Col, Table, Modal, Form, Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, 
} from '@fortawesome/free-solid-svg-icons';

const initialState = {
  mealPlans: [],
  editingPlan: false,
  editedPlan: {
    item_uid: '',
    item_desc: '',
    info_headline: '',
    payment_frequency: '',
    info_footer: '',
    item_photo: '',
    num_items: '',
    info_weekly_price: '',
    item_price: '',
    shipping: '',
  },
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_PLANS':
      return {
        ...state,
        mealPlans: action.payload,
      }
    case 'TOGGLE_EDIT_PLAN':
      return {
        ...state,
        editingPlan: !state.editingPlan,
        editedPlan: action.payload,
      }
    case 'EDIT_PLAN':
      return {
        ...state,
        editedPlan: action.payload,
      }
    default:
      return state;
  }
}

function Plans() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleEditPlan = (initialPlan) => {
    dispatch({ type:'TOGGLE_EDIT_PLAN', payload: initialPlan})
  }

  const editPlan = (property, value) => {
    const newEditedPlan= {
      ...state.editedPlan,
      [property]: value,
    }
    dispatch({ type: 'EDIT_PLAN', payload: newEditedPlan});
  }

  const saveMealPlan = () => {
    axios
      .put('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Edit_Meal_Plan',state.editedPlan)
      .then(() => {
        const planIndex = state.mealPlans.findIndex((plan) => plan.item_uid === state.editedPlan.item_uid);
        const newMealPlans = [...state.mealPlans];
        newMealPlans[planIndex] = state.editedPlan;
        dispatch({ type:'TOGGLE_EDIT_PLAN', payload: initialState.editedPlan})
        dispatch({ type: 'FETCH_PLANS', payload: newMealPlans});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  // Fetch Plans
  useEffect(() => {
    axios
      .get('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/plans',{
        params: {
          business_uid: '200-000001'
        }
      })
      .then((response) => {
        const plansApiResult = response.data.result;
        // for(const index in plansApiResult) {
        //   for(const property in plansApiResult[index]) {
        //     plansApiResult[index][property] = plansApiResult[index][property].toString();
        //   }
        // }
        dispatch({ type: 'FETCH_PLANS', payload: plansApiResult});
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  },[]);

  return (
    <>
      <Row>
        <Col>
          <h5>
            Meal Plans
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th> Plan </th>
                <th> Plan Description </th>
                <th> Payment Frequency </th>
                <th> In Short </th>
                <th> Picture </th>
                <th> Number of Meals </th>
                <th> Weekly Price </th>
                <th> Plan Price </th>
                <th> Meal Shipping </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {
                state.mealPlans.map(
                  (mealPlan) => {
                    return (
                      <tr key={mealPlan.item_uid}>
                        <td> {mealPlan.item_desc} </td>
                        <td> {mealPlan.info_headline} </td>
                        <td> {mealPlan.payment_frequency} </td>
                        <td> {mealPlan.info_footer} </td>
                        <td>
                          <img
                            style={{
                              maxWidth: '200px',
                              height: 'auto',
                            }}
                            src={mealPlan.item_photo}
                            alt="Meal Plan Picture"
                          />
                        </td>
                        <td> {mealPlan.num_items} </td>
                        <td> {mealPlan.info_weekly_price} </td>
                        <td> {mealPlan.item_price} </td>
                        <td> {mealPlan.shipping} </td>
                        <td>
                          <button
                            className={'icon-button'}
                            onClick={
                              () => {
                                toggleEditPlan(mealPlan);
                              }
                            }
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                            />
                          </button>
                        </td>
                      </tr>
                    )
                  }
                )
              }
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal
        show={state.editingPlan}
        onHide={() => toggleEditPlan(initialState.editedPlan)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Edit Meal Plan </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> Plan </Form.Label>
              <Form.Control
                value={state.editedPlan.item_desc}
                onChange={
                  (event) => {
                    editPlan('item_desc',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Plan Description </Form.Label>
              <Form.Control
                value={state.editedPlan.info_headline}
                onChange={
                  (event) => {
                    editPlan('info_headline',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Payment Frequency </Form.Label>
              <Form.Control
                value={state.editedPlan.payment_frequency}
                onChange={
                  (event) => {
                    editPlan('payment_frequency',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> In Short </Form.Label>
              <Form.Control
                value={state.editedPlan.info_footer}
                onChange={
                  (event) => {
                    editPlan('info_footer',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Picture URL </Form.Label>
              <Form.Control
                value={state.editedPlan.item_photo}
                onChange={
                  (event) => {
                    editPlan('item_photo',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Number of Meals </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.num_items}
                onChange={
                  (event) => {
                    editPlan('num_items',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Weekly Price </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.info_weekly_price}
                onChange={
                  (event) => {
                    editPlan('info_weekly_price',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Plan Price </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.item_price}
                onChange={
                  (event) => {
                    editPlan('item_price',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Meal Shipping </Form.Label>
              <Form.Control
                type='number'
                value={state.editedPlan.shipping}
                onChange={
                  (event) => {
                    editPlan('shipping',event.target.value);
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => toggleEditPlan(initialState.editedPlan)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={
              () => saveMealPlan()
            }
          >
            Save Meal Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Plans;