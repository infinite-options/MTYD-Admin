import { useEffect, useReducer } from 'react';
import axios from 'axios';
import {
  Breadcrumb, Form, Container, Row, Col, Table, Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faSave
} from '@fortawesome/free-solid-svg-icons';

const initialState = {
  mealData: [],
  meaureUnitsData: [],
  ingredientsData: [],
  selectedMeal: '',
  mealIngredients: [],
  editedMealIngredients: [],
  newIngredient: {
    ingredient_desc: '',
    package_size: '',
    ingredient_measure_id: '',
    ingredient_cost: '',
  },
  newMeasureUnit: {
    type: '',
    recipe_unit: '',
    conversion_ratio: '',
    common_unit: '',
  },
}

function reducer (state, action) {
  switch(action.type) {
    case 'FETCH_MEALS':
      return {
        ...state,
        mealData: action.payload,
      };
    case 'FETCH_MEASURE_UNITS':
      return {
        ...state,
        meaureUnitsData: action.payload,
      }
    case 'FETCH_INGREDIENTS':
      return {
        ...state,
        ingredientsData: action.payload,
      }
    case 'SELECT_MEAL':
      return {
        ...state,
        selectedMeal: action.payload,
      };
    case 'FETCH_MEAL_INGREDIENTS':
      return {
        ...state,
        mealIngredients: action.payload,
        editedMealIngredients: action.payload,
      };
    case 'EDIT_MEAL_INGREDIENTS':
      return {
        ...state,
        editedMealIngredients: action.payload,
      };
    case 'EDIT_NEW_INGREDIENT':
      return {
        ...state,
        newIngredient: action.payload,
      }
    case 'EDIT_NEW_MEASURE_UNIT':
      return {
        ...state,
        newMeasureUnit: action.payload,
      }
    default:
      return state;
  }
}

function EditMealRecipe() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateMeals = () => {
    axios
      .get('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals')
      .then((response) => {
        const mealApiResult = response.data.result;
        dispatch({ type: 'FETCH_MEALS', payload: mealApiResult });
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

  // Fetch meals
  useEffect(() => {
    updateMeals();
  }, []);

  // Fetch all measure units
  useEffect(() => {
    axios
      .get('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/measure_unit')
      .then((response) => {
        const measureUnitApiResult = response.data.result;
        dispatch({ type: 'FETCH_MEASURE_UNITS', payload: measureUnitApiResult });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch all ingredients
  useEffect(() => {
    axios
      .get('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/ingredients')
      .then((response) => {
        const ingredientApiResult = response.data.result;
        dispatch({ type: 'FETCH_INGREDIENTS', payload: ingredientApiResult });
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response);
        }
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, []);

  // Fetch meal ingredients
  useEffect(() => {
    if(state.selectedMeal !== '') {
      axios
        .get(`https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Ingredients_Recipe_Specific/${state.selectedMeal}`)
        .then((response) => {
          const mealIngredients = response.data.result;
          dispatch({ type: 'FETCH_MEAL_INGREDIENTS', payload: mealIngredients });
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
    // Call when changing meal: state.selectedMeal
    // Or to retrieve recipe_uids of just added meals: state.mealData
  },[state.selectedMeal,state.mealData])

  const editNewIngredient = (property,value) => {
    const newIngredient = {
      ...state.newIngredient,
      [property]: value,
    }
    dispatch({ type: 'EDIT_NEW_INGREDIENT', payload: newIngredient })
  }

  const saveNewIngredient = () => {
    axios
      .post('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/ingredients',state.newIngredient)
      .then((response) => {
        // eslint-disable-next-line
        console.log(response)
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

  const editNewMeasureUnit = (property,value) => {
    let newMeasureUnit = {};
    // Property is property changed, value is new value of that property
    if (property === 'type') {
      const measurementTypeCommonUnitMap = {
        volume: 'L',
        mass: 'kg',
        length: 'cm',
        each: 'ea',
      }
      newMeasureUnit = {
        ...state.newMeasureUnit,
        type: value,
        common_unit: measurementTypeCommonUnitMap[value],
      }
    } else {
      newMeasureUnit = {
        ...state.newMeasureUnit,
        [property]: value,
      };
    }
    dispatch({ type: 'EDIT_NEW_MEASURE_UNIT', payload: newMeasureUnit })
  }

  const saveNewMeasureUnit = () => {
    axios
      .post('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/measure_unit',state.newMeasureUnit)
      .then((response) => {
        const newMeasureUnitId = response.data.measure_unit_uid;
        const allMeasureUnits = state.meaureUnitsData;
        allMeasureUnits.push({
          measure_unit_uid: newMeasureUnitId,
          ...state.newMeasureUnit
        })
        dispatch({ type: 'EDIT_NEW_MEASURE_UNIT', payload: initialState.newMeasureUnit });
        dispatch({ type: 'FETCH_MEASURE_UNITS', payload: allMeasureUnits });
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

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Edit Meal Recipes </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col>
            <h5>
              Edit Meal Recipes
            </h5>
          </Col>
        </Row>
        <Row>
          <Col sm="8">
            <Form>
                <Form.Group as={Row}>
                  <Form.Label column sm="2">
                    Recipe For
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      value={state.selectedMeal}
                      onChange={
                        (event) => {
                            const newMealId = event.target.value;
                            dispatch({ type: 'SELECT_MEAL', payload: newMealId });
                        }
                      }
                    >
                      <option value="" hidden>Select a Meal</option>
                      {
                        state.mealData.map(
                          (meal) => (
                            <option value={meal.meal_uid} key={meal.meal_uid}>
                              {meal.meal_name}
                            </option>
                          ),
                        )
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Form>
          </Col>
          <Col
            sm="4"
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              disabled={!state.selectedMeal}
              onClick={
                () => {
                  const newRecipe = [...state.editedMealIngredients];
                  newRecipe.push({
                    ingredient_uid: '',
                    recipe_ingredient_qty: '',
                    measure_unit_uid: '',
                  });
                  dispatch({ type: 'EDIT_MEAL_INGREDIENTS', payload: newRecipe });
                }
              }
            >
              Add Ingredient
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped hover>
              <thead>
                <tr>
                  <th> Ingredient </th>
                  <th> Quanity </th>
                  <th> Units </th>
                  <th> Actions </th>
                </tr>
              </thead>
              <tbody>
                {
                  state.editedMealIngredients.map(
                    (ingredient, ingredientIndex) => {
                      return (
                        <tr key={ingredientIndex}>
                          <td>
                            <Form.Control
                              as='select'
                              value={ingredient.ingredient_uid}
                              onChange={
                                (event) => {
                                  const newRecipe = [...state.editedMealIngredients];
                                  const newIngredientId = event.target.value;
                                  const newIngredientInfo = state.ingredientsData
                                      .filter((allIngredients) => allIngredients.ingredient_uid === newIngredientId)[0];
                                  newRecipe[ingredientIndex] = {
                                    ...newRecipe[ingredientIndex],
                                    ...newIngredientInfo,
                                  };
                                  dispatch({ type: 'EDIT_MEAL_INGREDIENTS', payload: newRecipe });
                                }
                              }
                            >
                              <option value="" hidden>Select an Ingredient</option>
                              {
                                state.ingredientsData.map(
                                  (allIngredients) => (
                                    <option
                                      value={allIngredients.ingredient_uid}
                                      key={allIngredients.ingredient_uid}
                                    >
                                      {allIngredients.ingredient_desc}
                                    </option>
                                  )
                                )
                              }
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={ingredient.recipe_ingredient_qty}
                              onChange={
                                (event) => {
                                  const newRecipe = [...state.editedMealIngredients];
                                  const newQuantity = event.target.value;
                                  newRecipe[ingredientIndex] = {
                                    ...newRecipe[ingredientIndex],
                                    recipe_ingredient_qty: newQuantity,
                                  };
                                  dispatch({ type: 'EDIT_MEAL_INGREDIENTS', payload: newRecipe });
                                }
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              as='select'
                              value={ingredient.measure_unit_uid}
                              onChange={
                                (event) => {
                                  const newRecipe = [...state.editedMealIngredients];
                                  const newMeasureUnitId = event.target.value;
                                  const newMeasureUnitInfo = state.meaureUnitsData
                                      .filter((allMeasureUnits) => allMeasureUnits.measure_unit_uid === newMeasureUnitId)[0];
                                  newRecipe[ingredientIndex] = {
                                    ...newRecipe[ingredientIndex],
                                    ...newMeasureUnitInfo,
                                  };
                                  dispatch({ type: 'EDIT_MEAL_INGREDIENTS', payload: newRecipe });
                                }
                              }
                            >
                              <option value="" hidden>Select a Measure Unit</option>
                              {
                                state.meaureUnitsData.map(
                                  (allMeasureUnits) => (
                                    <option
                                      value={allMeasureUnits.measure_unit_uid}
                                      key={allMeasureUnits.measure_unit_uid}
                                    >
                                      {allMeasureUnits.recipe_unit}
                                    </option>
                                  )
                                )
                              }
                            </Form.Control>
                          </td>
                          <td>
                            <button
                                className={'icon-button'}
                                onClick={
                                  () => {
                                    const removeIngredient = () => {
                                      const newRecipe = [...state.editedMealIngredients];
                                      newRecipe.splice(ingredientIndex,1);
                                      dispatch({ type: 'EDIT_MEAL_INGREDIENTS', payload: newRecipe });
                                      updateMeals();
                                    }
                                    if(ingredient.recipe_uid) {
                                      // Already in database, API call to remove
                                      axios
                                        .delete('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/Delete_Recipe_Specific',{
                                          params: {
                                            recipe_uid: ingredient.recipe_uid,
                                          }
                                        })
                                        .then(() => {
                                          removeIngredient();
                                        })
                                        .catch((err) => {
                                          if(err.response) {
                                            // eslint-disable-next-line no-console
                                            console.log(err.response)
                                          }
                                          // eslint-disable-next-line no-console
                                          console.log(err)
                                        })
                                    } else {
                                      // Not in database, directly remove
                                      removeIngredient();
                                    }
                                  }
                                }
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                              />
                            </button>
                            <button
                              className={'icon-button'}
                              onClick={
                                () => {
                                  if(ingredient.recipe_uid) {
                                    // Case for Editing ingredient
                                    const object = {
                                      qty: ingredient.recipe_ingredient_qty.toString(),
                                      id: ingredient.ingredient_uid,
                                      measure: ingredient.measure_unit_uid,
                                      meal_id: ingredient.recipe_meal_id,
                                      recipe_uid: ingredient.recipe_uid,
                                    };
                                    axios
                                      .post('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/update_recipe',object)
                                      .then(() => {
                                        updateMeals();
                                      })
                                      .catch((err) => {
                                        if(err.response) {
                                          // eslint-disable-next-line no-console
                                          console.log(err.response)
                                        }
                                        // eslint-disable-next-line no-console
                                        console.log(err)
                                      })
                                  } else {
                                    // Case for Adding ingredient
                                    const object = {
                                      qty: ingredient.recipe_ingredient_qty.toString(),
                                      id: ingredient.ingredient_uid,
                                      measure: ingredient.measure_unit_uid,
                                      meal_id: state.selectedMeal,
                                    };
                                    axios
                                      .post('https://ht56vci4v9.execute-api.us-west-1.amazonaws.com/dev/api/v2/add_new_ingredient_recipe',object)
                                      .then((response) => {
                                        // eslint-disable-next-line
                                        console.log(response)
                                        updateMeals();
                                      })
                                      .catch((err) => {
                                        if(err.response) {
                                          // eslint-disable-next-line no-console
                                          console.log(err.response)
                                        }
                                        // eslint-disable-next-line no-console
                                        console.log(err)
                                      })
                                  }
                                }
                              }
                            >
                              <FontAwesomeIcon
                                icon={faSave}
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
        <Row
          style={{
            marginTop: '4rem'
          }}
        >
          <Col>
            <h5>
              Create New Ingredient
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th> Ingredient </th>
                  <th> Package Size </th>
                  <th> Package Unit </th>
                  <th> Package Cost </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      type="text"
                      value={state.newIngredient.ingredient_desc}
                      onChange={
                        (event) => {
                          editNewIngredient('ingredient_desc',event.target.value);
                        }
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={state.newIngredient.package_size}
                      onChange={
                        (event) => {
                          editNewIngredient('package_size',event.target.value);
                        }
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      as='select'
                      value={state.newIngredient.ingredient_measure_id}
                      onChange={
                        (event) => {
                          editNewIngredient('ingredient_measure_id',event.target.value);
                        }
                      }
                    >
                      <option value=''> Select a Unit </option>
                      {
                        state.meaureUnitsData.map(
                          (allMeasureUnits) => (
                            <option
                              value={allMeasureUnits.measure_unit_uid}
                              key={allMeasureUnits.measure_unit_uid}
                            >
                              {allMeasureUnits.recipe_unit}
                            </option>
                          )
                        )
                      }
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={state.newIngredient.ingredient_cost}
                      onChange={
                        (event) => {
                          editNewIngredient('ingredient_cost',event.target.value);
                        }
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row
        >
          <Col>
            <Button
              onClick={()=>saveNewIngredient()}
            >
              Save New Ingredient
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '4rem'
          }}
        >
          <Col>
            <h5>
              Create New Measure Unit
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th> Type </th>
                  <th> Unit Name </th>
                  <th> Conversion Ratio </th>
                  <th> Base Unit </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      as='select'
                      value={state.newMeasureUnit.type}
                      onChange={
                        (event) => {
                          editNewMeasureUnit('type',event.target.value);
                        }
                      }
                    >
                      <option value=''> Select a Type </option>
                      <option value='mass'> Mass </option>
                      <option value='volume'> Volume </option>
                      <option value='length'> Length </option>
                      <option value='each'> Each </option>
                    </Form.Control>
                  </td>
                  <td>
                    <Row>
                      <Col sm='10'>
                        <Form.Control
                          type="text"
                          value={state.newMeasureUnit.recipe_unit}
                          onChange={
                            (event) => {
                              editNewMeasureUnit('recipe_unit',event.target.value);
                            }
                          }
                        />
                      </Col>
                      <Col sm='2'>
                        =
                      </Col>
                    </Row>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={state.newMeasureUnit.conversion_ratio}
                      onChange={
                        (event) => {
                          editNewMeasureUnit('conversion_ratio',event.target.value);
                        }
                      }
                    />
                  </td>
                  <td>
                    {state.newMeasureUnit.common_unit}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => saveNewMeasureUnit()}
            >
              Save Measure Unit
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EditMealRecipe;