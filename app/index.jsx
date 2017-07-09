import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from './Root';
import configStore from './common/configStore';

const store = configStore();

const rootDiv = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>, 
  rootDiv
);