import React from 'react';
import Component from './routes/routescomp';
import Detail from './components/detail/Detail';
import Detail2 from './components/detail2/Detail'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Component />} />
        <Route path="/detail" element={<Detail />} />
        <Route path='/detail2' element={<Detail2 />} />
      </Routes>
    </Router>
  );
};

export default App;