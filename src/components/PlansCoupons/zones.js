import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import {
  Row, Col, Table, Modal, Form, Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, 
} from '@fortawesome/free-solid-svg-icons';

const initialState = {
  zones: [],
  editingZone: false,
  editedZone: {
    zone_uid:'',
    z_business_uid:'',
    area:'',
    zone:'',
    zone_name:'',
    z_businesses:'',
    z_delivery_day:'',
    z_delivery_time:'',
    z_accepting_day:'',
    z_accepting_time:'',
    service_fee:'0',
    delivery_fee:'0',
    tax_rate:'0',
    LB_long:'',
    LB_lat:'',
    LT_long:'',
    LT_lat:'',
    RT_long:'',
    RT_lat:'',
    RB_long:'',
    RB_lat:'',
  },
};

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_ZONES':
      return {
        ...state,
        zones: action.payload,
      }
    case 'TOGGLE_EDIT_ZONE':
      return {
        ...state,
        editingZone: !state.editingZone,
        editedZone: action.payload,
      }
    case 'EDIT_ZONE':
      return {
        ...state,
        editedZone: action.payload,
      }
    default:
      return state;
  }
}

function Zones () {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleEditZone = (initialZone) => {
    dispatch({ type: 'TOGGLE_EDIT_ZONE', payload: initialZone});
  }

  const editZone = (property, value) => {
    const newZone = {
      ...state.editedZone,
      [property]: value,
    }
    dispatch({ type: 'EDIT_ZONE', payload: newZone})
  }

  const saveZone = () => {
    if(state.editedZone.zone_uid === '') {
      // Add New Zone
    } else {
      // Edit current zone
      axios
        .put(`${BASE_URL}Update_Zone`,state.editedZone)
        .then((response) => {
          if(response.status === 200) {
            const zoneIndex = state.zones.findIndex((zone) => zone.zone_uid === state.editedZone.zone_uid);
            const newZones = [...state.zones];
            newZones[zoneIndex] = state.editedZone;
            dispatch({ type: 'FETCH_ZONES', payload: newZones});
            toggleEditZone(initialState.editedZone)
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
    }
  }

  // Fetch Zones
  useEffect(() => {
    axios
      .get(`${BASE_URL}get_Zones`)
      .then((response) => {
        if(response.status === 200) {
          const zoneApiResult = response.data.result;
          // Convert property values to string and nulls to empty string
          for(let index = 0; index < zoneApiResult.length; index++) {
            for (const property in zoneApiResult[index]) {
              const value = zoneApiResult[index][property];
              zoneApiResult[index][property] = value ? value.toString() : '';
            } 
          }
          dispatch({ type: 'FETCH_ZONES', payload: zoneApiResult});
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

  return (
    <>
      <Row
        style={{
          marginTop: '4rem',
          marginBottom: '1rem',
        }}
      >
        <Col>
          <h5>
            Zones
          </h5>
        </Col>
        <Col
          style={{
            textAlign: 'right'
          }}
        >
          <Button
            onClick={() => {toggleEditZone(initialState.editedZone)}}
          >
            Add New Zone
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th> Zone Name </th>
                <th> Area </th>
                <th> Zone </th>
                <th> Delivery Day </th>
                <th> Delivery Time </th>
                <th> Accepting Day </th>
                <th> Accepting Time </th>
                <th> Service Fee </th>
                <th> Delivery Fee </th>
                <th> Tax Rate </th>
                <th> LB long </th>
                <th> LB lat </th>
                <th> LT long </th>
                <th> LT lat </th>
                <th> RB long </th>
                <th> RB lat </th>
                <th> RT long </th>
                <th> RT lat </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
            {
              state.zones.map(
                (zone) => {
                  return (
                    <tr
                      key={zone.zone_uid}
                    >
                      <td> {zone.zone_name} </td>
                      <td> {zone.area} </td>
                      <td> {zone.zone} </td>
                      <td> {zone.z_delivery_day} </td>
                      <td> {zone.z_delivery_time} </td>
                      <td> {zone.z_accepting_day} </td>
                      <td> {zone.z_accepting_time} </td>
                      <td> {zone.service_fee} </td>
                      <td> {zone.delivery_fee} </td>
                      <td> {zone.tax_rate} </td>
                      <td> {zone.LB_long} </td>
                      <td> {zone.LB_lat} </td>
                      <td> {zone.LT_long} </td>
                      <td> {zone.LT_lat} </td>
                      <td> {zone.RB_long} </td>
                      <td> {zone.RB_lat} </td>
                      <td> {zone.RT_long} </td>
                      <td> {zone.RT_lat} </td>
                      <td>
                          <button
                            className={'icon-button'}
                            onClick={() => {toggleEditZone(zone)}}
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
        show={state.editingZone}
        onHide={() => toggleEditZone(initialState.editedZone)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Add/Edit Zone </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> Zone Name </Form.Label>
              <Form.Control
                value={state.editedZone.zone_name}
                onChange={
                  (event) => {
                    editZone('zone_name',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Area </Form.Label>
              <Form.Control
                value={state.editedZone.area}
                onChange={
                  (event) => {
                    editZone('area',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Zone </Form.Label>
              <Form.Control
                value={state.editedZone.zone}
                onChange={
                  (event) => {
                    editZone('zone',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Delivery Day </Form.Label>
              <Form.Control
                value={state.editedZone.z_delivery_day}
                onChange={
                  (event) => {
                    editZone('z_delivery_day',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Delivery Time </Form.Label>
              <Form.Control
                value={state.editedZone.z_delivery_time}
                onChange={
                  (event) => {
                    editZone('z_delivery_time',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Accepting Day </Form.Label>
              <Form.Control
                value={state.editedZone.z_accepting_day}
                onChange={
                  (event) => {
                    editZone('z_accepting_day',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Accepting Time </Form.Label>
              <Form.Control
                value={state.editedZone.z_accepting_time}
                onChange={
                  (event) => {
                    editZone('z_accepting_time',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Service Fee </Form.Label>
              <Form.Control
                value={state.editedZone.service_fee}
                onChange={
                  (event) => {
                    editZone('service_fee',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Delivery Fee </Form.Label>
              <Form.Control
                value={state.editedZone.delivery_fee}
                onChange={
                  (event) => {
                    editZone('delivery_fee',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Tax Rate </Form.Label>
              <Form.Control
                value={state.editedZone.tax_rate}
                onChange={
                  (event) => {
                    editZone('tax_rate',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> LB long </Form.Label>
              <Form.Control
                value={state.editedZone.LB_long}
                onChange={
                  (event) => {
                    editZone('LB_long',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> LB lat </Form.Label>
              <Form.Control
                value={state.editedZone.LB_lat}
                onChange={
                  (event) => {
                    editZone('LB_lat',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> LT long </Form.Label>
              <Form.Control
                value={state.editedZone.LT_long}
                onChange={
                  (event) => {
                    editZone('LT_long',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> LT lat </Form.Label>
              <Form.Control
                value={state.editedZone.LT_lat}
                onChange={
                  (event) => {
                    editZone('LT_lat',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> RB long </Form.Label>
              <Form.Control
                value={state.editedZone.RB_long}
                onChange={
                  (event) => {
                    editZone('RB_long',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> RB lat </Form.Label>
              <Form.Control
                value={state.editedZone.RB_lat}
                onChange={
                  (event) => {
                    editZone('RB_lat',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> RT long </Form.Label>
              <Form.Control
                value={state.editedZone.RT_long}
                onChange={
                  (event) => {
                    editZone('RT_long',event.target.value);
                  }
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> RT lat </Form.Label>
              <Form.Control
                value={state.editedZone.RT_lat}
                onChange={
                  (event) => {
                    editZone('RT_lat',event.target.value);
                  }
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => toggleEditZone(initialState.editedZone)}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={() => saveZone()}
          >
            Save Zone
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Zones;