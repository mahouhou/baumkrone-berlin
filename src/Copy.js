import React, { Component } from 'react';
import CopyMD from './markdown/copy.md';
import ReactMarkdown from 'react-markdown';

class Copy extends Component {

  constructor() {
    super();
    this.state = { markdown: '' };
  }

  // https://linguinecode.com/post/get-child-component-state-from-parent-component

  componentDidMount() {
    // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
    fetch(CopyMD).then(res => res.text()).then(text => this.setState({ markdown: text }));
  }

  render() {
    const { markdown } = this.state;
    const H2List = document.getElementsByTagName("h2");
    const H2Array = [...H2List];
    H2Array.map((a) => (
      a.setAttribute('id',
      `${H2Array[H2Array.indexOf(a)].childNodes[0].nodeValue
        .split(" ").join("-").toLowerCase()}`)
    ))
    console.log("Copy mounted")
    return <ReactMarkdown children={markdown} />;
  }
}

export default Copy;