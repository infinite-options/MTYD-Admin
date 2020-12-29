import {
  Breadcrumb, Container,
} from 'react-bootstrap';

import Plans from './plans';
import Coupons from './coupons';
import Taxes from './taxes';

function PlansCoupons() {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
        <Breadcrumb.Item active> Plans & Coupons </Breadcrumb.Item>
      </Breadcrumb>
      <Container
        style={{
          maxWidth: 'inherit',
        }}
      >
        <Plans />
        <Coupons />
        <Taxes />
      </Container>
    </div>
  )
}

export default PlansCoupons;
