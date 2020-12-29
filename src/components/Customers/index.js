import {
  Breadcrumb,
} from 'react-bootstrap';

function Customers() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Customers </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default Customers;
