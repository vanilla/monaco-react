# monaco-react

Forked from https://nodei.co/npm/@monaco-editor/react/

Monaco Editor for React

[![NPM](https://nodei.co/npm/@monaco-editor/react.png)](https://nodei.co/npm/@monaco-editor/react/)

## Synopsis

Monaco editor wrapper for easy/one-line integration with React applications without need of webpack (or other module bundler) configuration files.

## Motivation
There is a well-known web technology based code editor called [Monaco Editor](https://microsoft.github.io/monaco-editor/) that powers [VS Code](https://code.visualstudio.com/). [There are also many ways to integrate](https://github.com/Microsoft/monaco-editor-samples/) it provided by monaco creators. But there were tons of problems with integration of monaco with modern technologies; e.g React.

There also exist solutions for integration with React; e.g [this one](https://github.com/react-monaco-editor/react-monaco-editor) and [this one](https://github.com/jaywcjlove/react-monacoeditor). But they need some custom webpack configuration to make Monaco fully work, which is not the "best" solution for such kind of things like create-react-app - [CRA](https://facebook.github.io/create-react-app/).

**With this solution, you don't need any kind of webpack configuration files and it works great with React apps created by CRA or created by something else.**

#### Demo
[Check it out!](https://monaco-react.surenatoyan.com/)

## Documentation

#### Contents

* [Installation](#installation)
* [Introduction](#introduction)
* Usage
	* [Simple Usage](#simple-usage)
	* [Get Value](#get-value)
	* [Monaco Instance](#monaco-instance)
  	* [Config](#config)
	* [Editor Instance](#editor-instance)
	* [Controlled Editor](#controlled-editor)
* Props
	* [Editor](#editor)
	* [Diff Editor](#diffeditor)
	* [Controlled Editor](#controlled-editor)

#### Installation

```bash
npm install @monaco-editor/react
```

or

```bash
yarn add @monaco-editor/react
```

NOTE: for type definitions, this package uses monaco-editor package and it is defined as a peer dependency. So, if you need types and you have not monaco-editor npm package installed in your project, you have to install it by yourself.

#### Introduction

Besides types three main components are also exported from the package:

* Editor
* DiffEditor
* ControlledEditor

And the utility that gives ability to access to monaco instance (simply called "monaco")

#### Simple Usage

Here is an example of a simple integration of monaco editor with a react project.
You just need to import and render the Editor component.
You can play with it [here](https://codesandbox.io/s/dreamy-lumiere-c8pib?fontsize=14)

```js
import React from "react";
import ReactDOM from "react-dom";

import Editor from '@monaco-editor/react';

const App = _ => <Editor height="90vh" language="javascript" />;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

<details><summary>Extended example</summary>

```js
import React, { useState } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import { FillSpinner as Loader } from "react-spinners-kit";

import examples from "./examples";

function App() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("javascript");
  const [isEditorReady, setIsEditorReady] = useState(false);

  function handleEditorDidMount() {
    setIsEditorReady(true);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function toggleLanguage() {
    setLanguage(language === "javascript" ? "python" : "javascript");
  }

  return (
    <>
      <button onClick={toggleTheme} disabled={!isEditorReady}>
        Toggle theme
      </button>
      <button onClick={toggleLanguage} disabled={!isEditorReady}>
        Toggle language
      </button>

      <Editor
        height="90vh" // By default, it fully fits with its parent
        theme={theme}
        language={language}
        loading={<Loader />}
        value={examples[language]}
        editorDidMount={handleEditorDidMount}
        options={{ lineNumbers: "off" }}
      />
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

You can play with it [here](https://codesandbox.io/s/monaco-editor-react-u0fyv?fontsize=14)

</details>

#### Get Value

You may ask how we can get the value of the editor. There is a prop called `editorDidMount`. It gets two arguments: the first one is a function to get editor value, the second one is the editor instance.
Here is an example of how you can implement it.
You can play with it [here](https://codesandbox.io/s/example-for-issue-2-1hzz8?fontsize=14)

```js
import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";

function App() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  function handleShowValue() {
    alert(valueGetter.current());
  }

  return (
    <>
      <button onClick={handleShowValue} disabled={!isEditorReady}>
        Show value
      </button>

      <Editor
        height="90vh"
        language="javascript"
        value={"// write your code here"}
        editorDidMount={handleEditorDidMount}
      />
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

#### Monaco Instance

If you want to create your own language or theme, or modify existing ones you may need to access to the monaco instance. So, to that purpose, there is a utility called "monaco" exported from library and you can use it like this:

```js
import { monaco } from '@monaco-editor/react';

monaco
  .init()
  .then(monaco => {/* here is the instance of monaco, so you can use the `monaco.languages` or whatever you want */})
  .catch(error => console.error('An error occurred during initialization of Monaco: ', error));
```

You can play with it [here](https://codesandbox.io/s/monaco-editorreact---monaco-instance-5pbmx?fontsize=14&hidenavigation=1&theme=dark)

#### Config

There is a config file with "urls" to load monaco files (at this moment; this file can be extended in the future). And there is a way to modify it. Here is an example:

NOTE: your passed object will be deeply merged with the [default one](./src/config/index.js).


```js
import { monaco } from '@monaco-editor/react';

monaco.config({ urls: { ... } });
```

#### Editor Instance

It's handy to have access to the editor instance for some reason.

As we have already mentioned, the `editorDidMount` prop gets the editor instance as a second argument.
Here is an example of how you can use the editor instance.
You can play with it [here](https://codesandbox.io/s/monaco-editorreact---editor-instance-zgh90)

```js
import React, { useRef } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";

function App() {
  const editorRef = useRef();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
    // Now you can use the instance of monaco editor
    // in this component whenever you want
  }

  function listenEditorChanges() {
    editorRef.current.onDidChangeModelContent(ev => {
      console.log(editorRef.current.getValue());
    });
  }

  return (
    <>
      <button onClick={listenEditorChanges} disabled={!!editorRef.current}>
        Press to listen editor changes (see console)
      </button>
      <Editor
        height="90vh"
        editorDidMount={handleEditorDidMount}
        language="javascript"
      />
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

#### Controlled Editor

The default export of the library is uncontrolled react component:

```import Editor from '@monaco-editor/react' ```

We make it by default uncontrolled to keep the nature of the monaco editor as much as it is possible. And based on our experience we can say that in most cases it will cover your needs, as you can see in the examples above. And we highly recommend using that one.

But in any case, if you want a controlled one, there is an option for that. The library exports `ControlledEditor` (as named export). It is the same as the default one (`Editor`), plus it has `onChange` method. It is working a little bit different comparing with, for example, the controlled `input` field.

Here is `onChange` prop, it will be called each time when the content of the editor is changed. It gets two arguments, first one is the "event" object of monaco, the second one is the current value of the editor.

You can use it without circulating the data, and just by returning it from `onChange` simple setting the new value; see the example (You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-2-7iqpv?fontsize=14))

```js
import React from "react";
import ReactDOM from "react-dom";

import { ControlledEditor } from "@monaco-editor/react";

const BAD_WORD = "eval";
const WARNING_MESSAGE = " <- hey man, what's this?";

function App() {
  const handleEditorChange = (ev, value) => {
    return value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
      ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
      : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
        ? value.replace(WARNING_MESSAGE, "")
        : value;
  };

  return (
    <ControlledEditor
      height="90vh"
      value={"// try to write e%v%a%l somewhere 😈 \n"}
      onChange={handleEditorChange}
      language="javascript"
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Or like in usual controlled components; see the example (You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-yg5il?fontsize=14))

```js
import React, { useState } from "react";
import ReactDOM from "react-dom";

import { ControlledEditor } from "@monaco-editor/react";

const BAD_WORD = "eval";
const WARNING_MESSAGE = " <- hey man, what's this?";

function App() {
  const [value, setValue] = useState("// try to write e%v%a%l somewhere 😈 \n");

  const handleEditorChange = (ev, value) => {
    setValue(
      value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
        ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
        : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
          ? value.replace(WARNING_MESSAGE, "")
          : value
    );
  };

  return (
    <ControlledEditor
      height="90vh"
      value={value}
      onChange={handleEditorChange}
      language="javascript"
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

<details><summary>Another example</summary>

```js
import React from "react";
import ReactDOM from "react-dom";

import { ControlledEditor } from "@monaco-editor/react";

function App() {
  const handleEditorChange = (ev, value) => {
    return `"it doesn't matter what you are writing, I am staying here!!!"`;
  };

  return (
    <ControlledEditor
      height="90vh"
      onChange={handleEditorChange}
      language="javascript"
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-3-h0uro?fontsize=14)

</details>

## Props

#### Editor

| Name   |      Type      |  Default |  Description |
|:----------|:-------------|:------|:------|
| value | string || The editor value |
| language | enum: ... | | All languages that are [supported](https://github.com/microsoft/monaco-languages) by monaco-editor |
| editorDidMount | func | noop | **Signature: function(getEditorValue: func, monaco: object) => void** <br/> This function will be called right after monaco editor is mounted and is ready to work. It will get the editor instance as a second argument |
| theme | enum: 'light' \| 'dark' | 'light' | Default themes of monaco |
| line | number |  | The line to jump on it |
| width | union: number \| string | '100%' | The width of the editor wrapper |
| height | union: number \| string | '100%' | The height of the editor wrapper |
| loading | union: React element \| string | 'Loading...' | The loading screen before the editor is loaded |
| options | object | {} | [IEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) |

#### DiffEditor

| Name   |      Type      |  Default |  Description |
|:----------|:-------------|:------|:------|
| original | string || The original source (left one) value |
| modified | string || The modified source (right one) value |
| language | enum: ... | | All languages that are [supported](https://github.com/microsoft/monaco-languages) by monaco-editor |
| originalLanguage | enum: ... | *language | This prop gives you the opportunity to specify the language of the `original` source separately, otherwise, it will get the value of `language` property. (Possible values are the same as `language`) |
| modifiedLanguage | enum: ... | *language | This prop gives you the opportunity to specify the language of the `modified` source separately, otherwise, it will get the value of `language` property. (Possible values are the same as `language`) |
| editorDidMount | func | noop | **Signature: function(getOriginalEditorValue: func, getModifiedEditorValue: func, monaco: object) => void** <br/> This function will be called right after monaco editor is mounted and is ready to work. It will get the editor instance as a third argument |
| theme | enum: 'light' \| 'dark' | 'light' | Default themes of monaco |
| line | number |  | The line to jump on it |
| width | union: number \| string | '100%' | The width of the editor wrapper |
| height | union: number \| string | '100%' | The height of the editor wrapper |
| loading | union: React element \| string | 'Loading...' | The loading screen before the editor is loaded |
| options | object | {} | [IDiffEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html) |

#### Controlled Editor

Extended from Editor (the same props as in Editor plus onChange introduced below)

| Name   |      Type      |  Default |  Description |
|:----------|:-------------|:------|:------|
| onChange | func | noop | **Signature: function(ev: any, value: string \| undefined) => string \| undefined** onChange method of monaco editor. It will be called right after the content of the current model is changed. It gets two arguments: first one is the "event" object of monaco, second one is the current value. NOTE: onChange can return the new value, which will be inserted to editor |

## License

[MIT](./LICENSE)
