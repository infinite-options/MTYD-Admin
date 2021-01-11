import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { formatTime } from '../../helperFuncs';
import {
  Breadcrumb, Form, Button, Container, Row, Col, Table, Modal,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faSave
} from '@fortawesome/free-solid-svg-icons';

const initialState = {
  menuData: [],
  menuDate: '',
  editedMenu: [],
  mealData: [],
  showAddMeal: false,
  newMeal: {
    menu_date: '',
    default_meal: 'FALSE',
    meal_cat: '',
    meal_uid: '',
    menu_category: '',
    menu_type: '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_MENU':
      return {
        ...state,
        menuData: action.payload,
      };
    case 'CHANGE_DATE':
      return {
        ...state,
        menuDate: action.payload,
        newMeal: {
          ...state.newMeal,
          menu_date: action.payload,
        }
      };
    case 'FETCH_MEALS':
      return {
        ...state,
        mealData: action.payload,
      };
    case 'EDIT_MENU':
      return {
        ...state,
        editedMenu: action.payload,
      };
    case 'TOGGLE_ADD_MENU_ITEM':
      return {
        ...state,
        showAddMeal: !(state.showAddMeal),
        newMeal: {
          ...initialState.newMeal,
          // Date hould be YYYY-MM-DD for date input
          menu_date: state.menuDate.slice(0,10),
        }
      };
    case 'EDIT_NEW_MEAL_MENU':
      return {
        ...state,
        newMeal: action.payload,
      };
    default:
      return state;
  }
}

function CreateMenu() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getMenuDates = () => {
    const menuDates = state.menuData.map((menuItem) => formatTime(menuItem.menu_date));
    const menuDatesUnique = menuDates.filter((elt, index) => menuDates.indexOf(elt) === index);
    menuDatesUnique.sort();
    return menuDatesUnique;
  };

  const getMenuData = (date) => {
    const curMenu = state.menuData.filter((item) => formatTime(item.menu_date) === date);
    return curMenu;
  };

  const getMealsByCategory = (category) => {
    const mealList = state.mealData.filter((meal) => meal.meal_category === category);
    return mealList;
  };

  const getMealTypes = () => {
    const menuTypes = state.menuData.map((menuItem) => menuItem.menu_type);
    const menuTypesUnique = menuTypes.filter((elt, index) => menuTypes.indexOf(elt) === index);
    return menuTypesUnique;
  };

  const getMealCategories = () => {
    const mealCategories = state.menuData.map((menuItem) => menuItem.meal_cat);
    const mealCategoriesUnique = mealCategories.filter(
      (elt, index) => mealCategories.indexOf(elt) === index,
    );
    return mealCategoriesUnique;
  };

  const getMenuCategories = () => {
    const menuCategories = state.menuData.map((menuItem) => menuItem.menu_category);
    const menuCategoriesUnique = menuCategories.filter(
      (elt, index) => menuCategories.indexOf(elt) === index,
    );
    return menuCategoriesUnique;
  };

  const updateMenu = () => {
    axios
      .get(`${BASE_URL}menu`)
      .then((response) => {
        if(response.status === 200) {
          const fullMenu = response.data.result;
          if(fullMenu !== undefined) {
            dispatch({ type: 'FETCH_MENU', payload: fullMenu });
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          // eslint-disable-next-line no-console
          console.log(err.response)
        }
        // eslint-disable-next-line no-console
        console.log(err)
      });
  }

  // Fetch menu
  useEffect(() => {
    updateMenu();
  }, []);

  // Fetch meals
  useEffect(() => {
    axios
      .get(`${BASE_URL}meals`)
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
  }, []);

  // Change Date
  const changeDate = (newDate) => {
    dispatch({ type: 'CHANGE_DATE', payload: newDate });
    const curMenu = getMenuData(newDate);
    dispatch({ type: 'EDIT_MENU', payload: curMenu });
  };

  // Toggle Add Menu modal
  const toggleAddMenu = () => {
    dispatch({ type: 'TOGGLE_ADD_MENU_ITEM' });
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Create or Edit Menu </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Row>
          <Col sm="6">
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Date
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    value={state.menuDate}
                    onChange={(event) => changeDate(event.target.value)}
                  >
                    <option value="" hidden>Choose date</option>
                    {
                      getMenuDates().map(
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
          <Col
            sm={{ span: 3, offset: 3 }}
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="primary"
              onClick={toggleAddMenu}
            >
              Add Menu Item
            </Button>
          </Col>
          {/* 
            Don't need save all button for now, if activated, remove offset in add menu item
          <Col
            sm="3"
            style={{
              textAlign: 'right',
            }}
          >
            <Button variant="primary">Save</Button>
          </Col> */}
        </Row>
        <Row>
          <Col>
            <Table striped hover>
              <thead>
                <tr>
                  <th> Meal Type </th>
                  <th> Meal </th>
                  <th> Meal Category </th>
                  <th> Menu Category </th>
                  <th> Default Meal </th>
                  <th> Actions </th>
                </tr>
              </thead>
              <tbody>
                {
                  state.editedMenu.map(
                    (mealMenu, mealMenuIndex) => {
                      const otherMealCategories = getMealsByCategory(mealMenu.meal_category);
                      return (
                        <tr key={`${mealMenuIndex} ${mealMenu.menu_uid}`}>
                          <td>
                            {mealMenu.menu_type}
                          </td>
                          <td>
                            <Form>
                              <Form.Control
                                as="select"
                                value={mealMenu.meal_uid}
                                onChange={
                                  (event) => {
                                    const newMenu = [...state.editedMenu];
                                    const newMealId = event.target.value;
                                    const newMealInfo = state.mealData
                                      .filter((meal) => meal.meal_uid === newMealId)[0];
                                    newMenu[mealMenuIndex] = {
                                      ...newMenu[mealMenuIndex],
                                      ...newMealInfo,
                                      menu_meal_id: newMealId,
                                    };
                                    dispatch({ type: 'EDIT_MENU', payload: newMenu });
                                  }
                                }
                              >
                                {
                                  otherMealCategories.map(
                                    (meal) => (
                                      <option value={meal.meal_uid} key={meal.meal_uid}>
                                        {meal.meal_name}
                                      </option>
                                    ),
                                  )
                                }
                              </Form.Control>
                            </Form>
                          </td>
                          <td>
                            {mealMenu.meal_cat}
                          </td>
                          <td>
                            {mealMenu.menu_category}
                          </td>
                          <td>
                            <Form>
                              <Form.Control
                                as="select"
                                value={mealMenu.default_meal}
                                onChange={
                                  (event) => {
                                    const newMenu = [...state.editedMenu];
                                    const newDefaultMeal = event.target.value;
                                    newMenu[mealMenuIndex] = {
                                      ...newMenu[mealMenuIndex],
                                      default_meal: newDefaultMeal,
                                    };
                                    dispatch({ type: 'EDIT_MENU', payload: newMenu });
                                  }
                                }
                              >
                                <option value="FALSE"> FALSE </option>
                                <option value="TRUE"> TRUE </option>
                              </Form.Control>
                            </Form>
                          </td>
                          <td>
                            <button
                              className={'icon-button'}
                              onClick={
                                () => {
                                  axios
                                    .delete(`${BASE_URL}menu`,{
                                      params: {
                                        menu_uid: mealMenu.menu_uid,
                                      }
                                    })
                                    .then(() => {
                                      const newMenu = [...state.editedMenu];
                                      newMenu.splice(mealMenuIndex, 1);
                                      dispatch({ type: 'EDIT_MENU', payload: newMenu });
                                      updateMenu();
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
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                              />
                            </button>
                            <button
                              className={'icon-button'}
                              onClick={
                                () => {
                                  axios
                                    .put(`${BASE_URL}menu`,mealMenu)
                                    .then(() => {
                                        updateMenu();
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
                            >
                              <FontAwesomeIcon
                                icon={faSave}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Modal
        show={state.showAddMeal}
        onHide={toggleAddMenu}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Menu Date
              </Form.Label>
              <Form.Control
                type="date"
                value={state.newMeal.menu_date}
                onChange={
                  (event) => {
                    const newDate = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_date: newDate,
                    }
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal Type
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_type}
                onChange={
                  (event) => {
                    const newMealType = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_type: newMealType,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Meal Type</option>
                {
                  getMealTypes().map(
                    (mealType) => (
                      <option value={mealType} key={mealType}>
                        {mealType}
                      </option>
                    ),
                  )
                }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_uid}
                onChange={
                  (event) => {
                    const newMealId = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      meal_uid: newMealId,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Meal</option>
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
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Meal Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.meal_cat}
                onChange={
                  (event) => {
                    const newMealCat = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      meal_cat: newMealCat,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Meal Category</option>
                {
                  getMealCategories().map(
                    (mealCategory) => (
                      <option value={mealCategory} key={mealCategory}>
                        {mealCategory}
                      </option>
                    ),
                  )
                }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Menu Category
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.menu_category}
                onChange={
                  (event) => {
                    const newMenuCategory = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      menu_category: newMenuCategory,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="" hidden>Choose Menu Category</option>
                {
                 getMenuCategories().map(
                   (menuCategory) => (
                     <option value={menuCategory} key={menuCategory}>
                       {menuCategory}
                     </option>
                   ),
                 )
               }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Default Meal
              </Form.Label>
              <Form.Control
                as="select"
                value={state.newMeal.default_meal}
                onChange={
                  (event) => {
                    const newDefaultMeal = event.target.value;
                    const newMeal = {
                      ...state.newMeal,
                      default_meal: newDefaultMeal,
                    };
                    dispatch({ type: 'EDIT_NEW_MEAL_MENU', payload: newMeal });
                  }
                }
              >
                <option value="FALSE"> FALSE </option>
                <option value="TRUE"> TRUE </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAddMenu}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              () => {
                const newMenuItemInfo = state.mealData.filter(
                  (meal) => meal.meal_uid === state.newMeal.meal_uid)[0];
                // YYYY-MM-DD seems to work for request parameter, no need to add HH:MM:SS
                const newMenuItem = {
                  ...state.newMeal,
                  ...newMenuItemInfo,
                  menu_meal_id: state.newMeal.meal_uid,
                  delivery_days:['Sunday', 'Monday'],
                  meal_price:'10',
                };
                axios
                  .post(`${BASE_URL}menu`,newMenuItem)
                  .then((response) => {
                    // Save New menu item with id on screen
                    const newMenuId = response.data.meal_uid;
                    const newMenuItemId = {
                      ...newMenuItem,
                      menu_uid: newMenuId,
                    }
                    const newEditedMenu = [...state.editedMenu];
                    newEditedMenu.push(newMenuItemId)
                    dispatch({ type: 'EDIT_MENU', payload: newEditedMenu });
                    // Save menu item after switching to different date and back
                    updateMenu();
                    toggleAddMenu()
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
          >
            Save Menu Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateMenu;
