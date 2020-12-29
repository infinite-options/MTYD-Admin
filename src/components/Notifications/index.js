import {
  Breadcrumb,
} from 'react-bootstrap';

function Notifications() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Notifications </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default Notifications;
