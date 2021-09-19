---
title: How to backup LinkedIn saved posts manually
tags:
  - js
abbrlink: 1cf8d649
date: 2021-08-03 22:10:36
---

## What?

To export account data from LinkedIn website can be of a lot of muddle and hassle, but the result may not be yet decent for the missing saved posts.

Let's do this in a ~~manual~~ automated way by scripting.

## Solution

Code snippet for saving data as a downloadable JSON file ([source](http://bgrins.github.io/devtools-snippets/#console-save)): 

```js
(function(console){
    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)
```

This line looks weird, just an ad-hoc cure when the error of `undefined $` occurs with the arrow function operating on the jQuery selector. The cause of error still remains a mystery...

<!--more-->

```javascript
const jq = $
```

Then it is able to pass `jq` into the arrow function to make `$` selector work.

```js
var results = Array()

var sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var operation = {}
operation.step1 = async (id, $, ms) => {
    $('main div.occludable-update.ember-view:nth-child('+id+') .artdeco-dropdown--justification-right button').click()
    await sleep(ms);
    return id
}
operation.step2 = async (id, $, ms) => {
    $('main div.occludable-update.ember-view:nth-child('+id+') .artdeco-dropdown--justification-right ul li:nth-child(2) div').click()
    await sleep(ms);
}
operation.step3 = async ($, results, ms) => {
    results.push($('.feed-shared-embed-modal__content textarea').value.match(/src="(.*?)"/)[1]); 
    await sleep(ms);
}
operation.step4 = async ($, ms) => {    
    $('button.artdeco-modal__dismiss').click()
    await sleep(ms);
}
operation.step5 = async ($, ms) => {
    results.push($('div#artdeco-toasts__wormhole p.artdeco-toast-item__message a').href)
}
operation.work = async (st, ed) => {
    for (var id = st; id <= ed; id++ ) {
        await operation.step1(id, jq, 300)
        await operation.step2(id, jq, 1200)
        // await operation.step3(jq, results, 300)
        // await operation.step4(jq, 300)
        await operation.step5(jq, 300)
    }
}

await operation.work(1, 10)
console.log(results)
console.save('LinkedInSavedPostsBackup.json')
```

## Knowledge

Useful jQuery selectors that help:

- `:eq()` [see more](https://stackoverflow.com/questions/1442925/how-to-get-nth-jquery-element)
- `:nth-child()` [see more](https://www.w3schools.com/jquery/sel_nthoftype.asp)

Sequential execution of multiple asynchronous operations with [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Simulation of `sleep()` - [see more](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)

[`async` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[`await` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)