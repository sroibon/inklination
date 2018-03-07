// getUserMedia only works for secure pages
// if (!/https/.test(window.location.protocol)) window.location.protocol = 'https://';

import React, { Component } from 'react';
import './App.css';

import Header from './components/header/Header';
import ImageCapture from './components/image-capture/ImageCapture';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <ImageCapture />
      </div>
    );
  }
}

export default App;
