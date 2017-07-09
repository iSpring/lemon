import React, { Component } from 'react';
import PostListContainer from 'features/PostList/container';

class Root extends Component{
  render(){
    return (
      <div>
        <PostListContainer />
      </div>
    );
  }
}

export default Root;