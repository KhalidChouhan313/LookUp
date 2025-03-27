import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './router'

const App = () => {
  return (
      <Routes>
        {
          routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            )
          })
        }
      </Routes>
  )
}

export default App
