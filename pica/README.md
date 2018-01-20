# pica


[![Code Climate](https://codeclimate.com/github/jameslawson/pica/badges/gpa.svg)](https://codeclimate.com/github/jameslawson/pica)
[![Test Coverage](https://codeclimate.com/github/jameslawson/pica/badges/coverage.svg)](https://codeclimate.com/github/jameslawson/pica/coverage)
[![Build Status](https://travis-ci.org/jameslawson/pica.svg?branch=master)](https://travis-ci.org/jameslawson/pica)    
*A Functional Reactive Richtext Editor*

Here are (or will be) our **favourite things** about pica:
- pica **doesn't use `contentedibable`**like most richtext editors 
- pica has **amazing cross-browser compatibility** 
- pica is written in a **functional reactive** style
- pica has great **test coverage**

> **Early Alpha**: pica is currently under heavy development and is not yet production ready

## Installation

```
npm install
npm run dist
open dist/index.html
```

## Running Tests

Pica is split into two groups:
- **Pure** - Pure functional code that *does not* manipulate the DOM/use browser APIs.
- [**Drivers**](http://cycle.js.org/drivers.html) - Side-effect laden code that *does* manipulate the DOM/use browser APIs.

To run the **unit tests**:
```bash
# Run pure unit tests in node environment
npm run test
# Runs driver unit tests in across several browser environments
npm run karma
```
