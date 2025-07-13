---
title: Post-interview FE Coding Insights in 2025
tags:
  - Interview
  - React
  - TypeScript
abbrlink: d0983c6a
date: 2025-03-10 12:07:21
---

## Nuro 45-min FE Interview - late-June

Problem description:
```markdown
Self dismissing modal
1. When button is clicked, modal should cover the page
2. After 5 seconds, the modal closes on it's own
```

Revised implementation w/o error risk when using JSX element VS functional call:
<!--more-->
```typescript
import './App.css';
import 'h8k-components';
import React, { useState, useEffect } from 'react';
const title = "React App";
const App = () => {
    const [count, setCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            const interval = setInterval(() => {
                if (modalVisible && count > 0) {
                    setCount(count => count - 1);
                }
            }, 1000);
            
            return () => {
                clearInterval(interval);
            }
        }
    }, [modalVisible]);
    // step 1: add a basic modal as an overlay
    // step 3: enable auto-closing in the modal
    const Modal = () => (
        <div style={{ display: modalVisible ? 'flex' : 'none', flexDirection: 'column', padding: '18px' }}>
            <h2>This is a modal</h2>
            <p>Countdown: {count} second(s) left ...</p>
        </div>);
    return (
        <div className="App">
            <Modal />
            {/* {Modal()} */}
            <h8k-navbar header={title}></h8k-navbar>
            <div className="fill-height layout-column justify-content-center align-items-center">
                {/* step 2: replace the button to open the model */}
                <button onClick={() => {
                    setModalVisible(true);
                    setCount(5);
                    setTimeout(() => setModalVisible(false), 5000);
                }} disabled={modalVisible}>Open Modal</button>
            </div>
        </div>
    );
}
export default App;
```

Original defective implementation during the interview:
```typescript
// challenge/src/App.js

import './App.css';
import 'h8k-components';
import React, { useState, useEffect } from 'react';
const title = "React App";
// Self dismissing modal
// 1. When button is clicked, modal should cover the page
// 2. After 5 seconds, the modal closes on it's own
const App = () => {
    const [count, setCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [countDown, setCountDown] = useState(false);
    // if (countDown) {
    //     setCountDown(false);
    //     setInterval(() => {
    //         if (modalVisible && count > 0) {
    //             console.log('time left:', count);
    //             setCount(count => count - 1);
    //         }
    //     }, 1000);
    // }
    useEffect(() => {
        console.log('modal visible:', modalVisible);
        if (modalVisible && !countDown) {
        setInterval(() => {
            if (modalVisible && count > 0) {
                console.log('time left:', count);
                // setCount(count => count - 1);
            }
        }, 1000);
        }
        return () => {
            clearTimeout();
        }
    }, [modalVisible]);
    // step 1: add a basic modal as an overlay
    const Modal = () => {
        // useEffect(() => {console.log('useEffect time left:', count);}, [count]);

        // step 3: enable auto-closing in the modal
        return (<div style={{ display: modalVisible ? 'flex' : 'none', flexDirection: 'column', padding: '18px' }}>
                <h2>This is a modal</h2>
                <p>Countdown: {count} second(s) left ...</p>
            </div>)
    };
    return (
        <div className="App">
            <Modal />
            {/* {Modal()} */}
            <h8k-navbar header={title}></h8k-navbar>
            <div className="fill-height layout-column justify-content-center align-items-center">
                {/* <p data-testid="output">You clicked {count} times ...</p> */}
                {/* <button data-testid="add-button" onClick={() => setCount(count + 1)}>Click Me</button> */}
                {/* step 2: replace the button to open the model */}
                <button onClick={() => {
                    setModalVisible(true);
                    setCount(5);
                    setTimeout(() => setModalVisible(false), 5000);
                    setCountDown(true);
                }} disabled={modalVisible}>Open Modal</button>
            </div>
        </div>
    );
}
export default App;
```
```css
/* challenge/src/App.css */
@import '../node_modules/h8k-design/dist/index.css';
```
```typescript
// challenge/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyPolyfills, defineCustomElements} from 'h8k-components/loader';

ReactDOM.render(<App />, document.getElementById('root'));
applyPolyfills().then(() => {
    defineCustomElements(window);
})

// challenge/package.json
{
  "name": "react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "h8k-components": "^1.0.0",
    "h8k-design": "^1.0.16",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "3.4.1",
    "@testing-library/jest-dom": "5.16.1",
    "@testing-library/react": "12.1.2"
  },
  "scripts": {
    "prestart": "npm install",
    "start": "cross-env HOST=0.0.0.0 PORT=8000 ./node_modules/.bin/react-scripts start"
  },
  "devDependencies": {
    "cross-env": "^7.0.2"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Yahoo Final Rounds - FE Section - mid-March

External references after revision:
- [`useRef`](https://react.dev/reference/react/useRef) is a React Hook that lets you reference a value that’s not needed for rendering.
- [`Window.fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) -- no need to import `axios`.

    Basic usage:
    ```typescript
    const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

    const json = await response.json();
    ```

Revised implementation of `App` component:

```typescript

function App() {
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState({
    id: '',
    name: '',
    email: '',
    body: '',
  });
  
  const getComments = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1/comments');
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log('resp:', json);
      setComments(json);
    } catch (error) {
      console.error(error.message);
    }
  };
  const submitComment = (event) => {
    event.preventDefault();
    
    // update comment list
    const newComment = {
      ...inputValue
    };
    console.log('inputs:', newComment);
    setComments((prevComments) => [newComment, ...prevComments]);
    setInputValue({ id: '', name: '', email: '', body: '' });
    // POST new comment ...
  };
  useEffect(() => {
    getComments();
  }, []);
  
  return (
    <div className="app">
      <h1>Comments</h1>
      <form>
        <div>
          <span>ID:</span>
          <input id="id-input" type="text" value={inputValue.id} onChange={(e) => setInputValue((prevInput) => {
            return { ...prevInput, id: e.target.value }
          })}/>
        </div>
        <div>
          <span>Name:</span>
          <input id="name-input" type="text" value={inputValue.name} onChange={(e) => setInputValue((prevInput) => {
            return { ...prevInput, name: e.target.value }
          })}/>
        </div>
        <div>
          <span>Email:</span>
          <input id="email-input" type="text" value={inputValue.email} onChange={(e) => setInputValue((prevInput) => {
            return { ...prevInput, email: e.target.value }
          })}/>
        </div>
        <div>
          <span>Content:</span>
          <input id="comment-input" type="text" value={inputValue.body} onChange={(e) => {
            // console.log('Input onchange:', e.target.value, e.currentTarget.value);
            // setInputValue(e.target.value);
            setInputValue((prevInput) => {
              return { ...prevInput, body: e.target.value }
            })
          }} />
        </div>
        <button type="submit" onClick={submitComment}>Submit Comment</button>
      </form>
      <ul>
        {
          comments.map((comment) => {
            const { id, name, email, body } = comment;
            return (
              <li key={`comment-key-${id}`}>
                <div>
                  <h4>{name} {email}</h4>
                  <p>{body}</p>
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  )
}
export default App;
```