import {ThemeProvider} from '@emotion/react'
import {createTheme} from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import Router from './components/router/Router'
import './index.css'
import store from './redux/store'
import reportWebVitals from './reportWebVitals'

const theme = createTheme({
  palette: {
    primary: {
      light: '#B1D0E0',
      main: '#406882',
      dark: '#1A374D',
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
