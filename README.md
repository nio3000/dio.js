# DIO

[![dio.js](https://dio.js.org/assets/images/logo.svg)](https://dio.js.org/)

A Library For Building User Interfaces.

- ~7kb

[![licence](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat)](https://github.com/thysultan/dio.js/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/dio.js.svg?style=flat)](https://www.npmjs.com/package/dio.js)
[![Build Status](https://travis-ci.org/thysultan/dio.js.svg)](https://travis-ci.org/thysultan/dio.js)
[![Coverage Status](https://coveralls.io/repos/github/thysultan/dio.js/badge.svg)](https://coveralls.io/github/thysultan/dio.js)
![dependencies](https://img.shields.io/badge/dependencies-none-green.svg?style=flat)
[![Join the chat at https://gitter.im/thysultan/dio.js](https://img.shields.io/badge/chat-gitter-green.svg?style=flat)](https://gitter.im/thysultan/dio.js)

## Support

* Edge
* IE 9+
* Chrome
* Firefox
* Safari
* Node

---

## Installation

#### Direct Download

```html
<script src=dio.min.js></script>
```

#### CDN

```html
<script src=https://unpkg.com/dio.js></script>
<script src=https://cdn.jsdelivr.net/npm/dio.js></script>
```

#### NPM

```
npm install dio.js --save
```

---

## Getting started

```js
dio.render(
  h('h1', 'Hello, world!'),
  document.getElementById('root')
)
```

The easiest way to get started with DIO is to walk through the [Introduction to DIO](https://dio.js.org/introduction) or the [API Documentation](https://dio.js.org/api).

## Features

The following is an overview of the features DIO allows you to make use of.

1. ### Rendering

	1. Elements
	1. Components
	1. Primitives like strings, numbers, null, undefined
	1. Fragments like Arrays, Iterables
	1. and others renderables like Promises and Portals

1. ### Components

	1. Functional stateful components
	1. Class stateful components

1. ### Events

	1. Functions or [EventListener](https://developer.mozilla.org/en/docs/Web/API/EventListener)
	1. Preserve "this" reference

1. ### Errors

	1. Error boundaries through `componentDidCatch`

1. ### setState

	1. As with a Object
	1. As with a Promise
	1. As with an implicit return

1. ### Lifecycle

	1. async componentWillUnmount
	1. async getInitialState

## Example

This intentionally overloaded example presents a few features detailed above, namely – error boundaries, an implicit setState return, Promise setState and rendering Promises & Fragments.

```js
class Input {
	// Error Boundary
	componentDidCatch ({stack, message, ...error}, {componentStack}) {
		return {error: true}
	}
	// Isomorphic Async getInitialState
	async getInitialState() {
		return {value: 'Hi!'}
	}
	// Implicit Promise setState
	async handleInput({target}, props, state) {
		return {value: target.value}
	}
	// Rendering Promises
	async render(props, {value, error}, context) {
		if (error)
			return h('h1', 'Something went wrong!')

		// Rendering Fragments
		return [
			h('input', {
				value: value,
				// bonus: events preserve "this" reference
				onInput: this.handleInput
			}),
			h('p', value)
		]
	}
}

dio.render(h(Input))
```

--

## Links

1. [Introduction to DIO](https://dio.js.org/introduction)
2. [API Documentation](https://dio.js.org/api)
3. [REPL](https://dio.js.org/repl)
