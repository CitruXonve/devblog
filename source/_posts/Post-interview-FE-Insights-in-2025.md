---
title: Post-interview FE Coding Insights in 2025
tags:
  - Interview
  - React
  - TypeScript
abbrlink: d0983c6a
date: 2025-03-10 12:07:21
---

## Uber 60-min FE Interview - mid-July

Problem: on Hackerrank online IDE, given the function definitions, implement certain logic to obtain the expected output while ensuring the function calls running **in parallel**.

Note that (based on clarification made by the interviewer):

- Only JS/TS allowed for this problem;
- The function of `getNameById` is meant to simulate certain time consuming task; no change should be made other than under `TODO` inside `asyncMap`;
- `callback` param passed into `getNameById` is not the same as that in `asyncMap`.

```js
function getNameById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) * 200;
  setTimeout(() => {
    callback("User" + id);
  }, randomRequestTime);
}

// Input
const userIds = [1, 2, 3, 4, 5];
async function asyncMap(input, iterateeFn, callback) {
  // TODO: implement this function, ensuring parallelism and the correct ordering in the output
}

asyncMap(userIds, getNameById, (names) => {
  console.log(names); // * ["user1", "user2", "user3", "user4", "user5"]
});
```

<!--more-->

Revise via vibe coding:

```js
async function asyncMap(input, iterateeFn, callback) {
  const names = new Set();
  const output = [];
  // Convert callback-based function to Promise-based
  // This is needed because Promise.all() requires all promises to resolve before executing .then()
  // Without this conversion, Promise.all() would resolve immediately when setTimeout is scheduled,
  // not when the actual callback execution completes, leading to race conditions
  const promiseBasedIteratee = (id, taskCallback) => {
    return new Promise((resolve) => {
      iterateeFn(id, async (taskName) => {
        resolve();
        await taskCallback(taskName);
      });
    });
  };
  Promise.all(
    input.map(async (id) => {
      await promiseBasedIteratee(id, async (taskName) => {
        // wait for all previous tasks to finish before adding the current task to the set
        for (let prev = 1; prev < id; prev++) {
          while (!names.has(prev)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        names.add(id);
        // ensure taskName is added in the expected ordering
        output.push(taskName);
      });
    })
  ).then(async () => {
    while (output.length < userIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    callback(output);
  });
}
```

Notes:

- Beware of the location of `resolve` param inside Promise Object, which may affect parallelism.
- The original function param `iterateeFn` is callback-based and may lead to race conditions if not converted into Promise-based, in which case `Promise.all()` resolves immediately VS when the actual callback execution completes.
- `Promise.all()` resolves as soon as all calls complete regardless of ordering, not ensuring the resolving/completion.

### Reference:

https://shnoman97.medium.com/parallel-processing-in-javascript-with-concurrency-c214e9facefd

Non-native parallel implementation based on `Promise.all`.

Example:

```js
async function parallel(arr, fn, threads = 2) {
  const result = [];
  while (arr.length) {
    const res = await Promise.all(arr.splice(0, threads).map((x) => fn(x)));
    result.push(res);
  }
  return result.flat();
}
const res = await parallel(arr, apiLikeFunction, 5);
```

## Nuro 45-min FE Interview - late-June

Problem description:
```markdown
Self dismissing modal
1. When button is clicked, modal should cover the page
2. After 5 seconds, the modal closes on it's own
```

Revised implementation w/o error risk when using JSX element VS functional call:

```typescript App.tsx
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
```typescript ./src/App.js
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

```css ./src/App.css
@import '../node_modules/h8k-design/dist/index.css';
```

```typescript ./src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyPolyfills, defineCustomElements} from 'h8k-components/loader';

ReactDOM.render(<App />, document.getElementById('root'));
applyPolyfills().then(() => {
    defineCustomElements(window);
})
```

```json package.json
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
- [`Window.fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) -- no need to import `axios` when in a pitch.

    Basic usage:
    ```typescript
    const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

    const json = await response.json();
    ```

Revised implementation of `App` component:

```typescript App.tsx

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

## Wisdom AI 60-min Screening in FE - early-Feb

Problem: Implement a FE page of basic card game using [stackblitz.com](stackblitz.com) online IDE (JS only, no TS support).

```js Constants
const numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['♠', '♣', '♥', '♦'];
```

Revised coding ([online IDE](https://stackblitz.com/edit/react-prnflm6e) / [Live Demo](https://react-prnflm6e.stackblitz.io/)):

```css style.css
h1,
p {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.card-list {
  display: flex;
  column-gap: 4px;
}
.card {
  border: 2px solid green;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* text-align: center; */
  min-width: 50px;
  min-height: 30px;
}
```
```js App.js
import React, { useState } from 'react';
import './style.css';
const numbers = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];
const suits = ['♠', '♣', '♥', '♦'];
const generate_card = () => {
  const random_num = Math.floor(Math.random() * numbers.length);
  const random_suit = Math.floor(Math.random() * suits.length);
  return numbers[random_num] + suits[random_suit];
};
const draw_cards = (card_num) => {
  const cards = new Set();
  while (cards.size < card_num) {
    const new_card = generate_card();
    if (cards.has(new_card)) {
      continue;
    }
    cards.add(new_card);
  }
  return Array.from(cards);
};
export default function App() {
  const [cardNum, setCardNum] = useState(5);
  const [cardList, setCardList] = useState([]);
  const deal_a_hand = () => {
    setCardList(() => {
      const cards = draw_cards(cardNum);
      return cards.map((card) => <span className="card">{card}</span>);
    });
    setCardNum(4);
  };
  return (
    <div>
      {/* <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p> */}
      <button onClick={deal_a_hand}>Deal a Hand</button>
      <h2>Cards</h2>
      <div className="card-column">
        <p className="card-list">{cardList}</p>
      </div>
    </div>
  );
}
```
