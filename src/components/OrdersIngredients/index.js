import {
  Breadcrumb,
} from 'react-bootstrap';

function OrdersIngredients() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Orders & Ingredients </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default OrdersIngredients;
