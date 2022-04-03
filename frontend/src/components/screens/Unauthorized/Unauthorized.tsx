import {ReactElement} from 'react'

// TODO create unauthorized screen
const Unauthorized = (): ReactElement => (
  <div>
    <p>You are not authorized please login</p>
    <a href="/login">here</a>
  </div>
)

export default Unauthorized
