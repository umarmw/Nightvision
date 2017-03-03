## Synopsis Welcome Welcome

Nightvision is a combination of Selenium, Nightwatch and resemblejs

## Motivation

This project came to light since this kind of combination doesnt exists and some examples are not fully working.
A biref description of the testcase is as follows: Browser opens url, check if element exists, if exists take screenshot in different screen size and check if it differs with existing baseline.
## Installation
**npm**

```
npm install
npm i nightwatch -g
```

**Imagemagic**

```
http://www.imagemagick.org/script/binary-releases.php
```

```
ImageMagick-6.9.3-5-Q16-x64-dll.exe	download	download	Win64 dynamic at 16 bits-per-pixel
```

## API Reference

See Nightwatch [Guide!](http://nightwatchjs.org/guide) for more explantion of the arguments and how to use it.


## Tests

To run the test,

1. click on `run.bat` in `selenium` folder to start the **Selenium server**

2. go in the appropriate directory where *nightwatch.json* is present and type `nightwatch`

3. to run test for a specific module: `nightwatch -g modulename`

4. *Happy testing*


## Known Issues

1. Screenshot doest work with chrome driver

2. Cant run Selenium with Safari driver in Windows

## upcoming

Adding MongoDB to the project


## Contributors

Top contributers: **Proximty MU Team**

Thanks to:

Assertions Libraries: [maxgalbu](https://github.com/maxgalbu/nightwatch-custom-commands-assertions)

ResembleJS Assertion Snippet : [richard-flosi](https://gist.github.com/richard-flosi)

## License

MIT
