const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {

  const logFilePath = path.join(__dirname, 'pChromeLog.txt');

  const args = process.argv.slice(2);

  // Check if the required argument is provided
  if (args.length < 1) {
    console.log('Usage: node script.js <argument>');
    process.exit(1);
  }

  // Get the first argument
  const fileHandleBase = args[0];
  const start = parseInt(args[1]);
  const end = parseInt(args[2]);


  // Use the input in your script
  console.log(`The fileHandleBase: ${fileHandleBase}`);
  console.log(`start = : ${start}`);
  console.log(`end = : ${end}`);

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   slowMo: 50, // slow down by 250ms
  // });
  const page = await browser.newPage();

  try {
    const cookiesString = fs.readFileSync('./cookies.json', 'utf8');
    // Parse and use the data if necessary
    const cookies = JSON.parse(cookiesString);
    console.info("Setting cookies")
    await page.setCookie.apply(page, cookies);

  } catch (error) {
      if (error.code === 'ENOENT') {
          // Handle file not found error
          console.error(`File not found: ${path}`);
          // You can create the file or handle it as needed
          // fs.writeFileSync(path, JSON.stringify(defaultData));
      } else {
          // Handle other types of errors
          console.error('An error occurred:', error);
      }
  }

  // Navigate the page to a URL
  await page.goto('https://fherma.io/challenges/6542c282100761da3b545c3e/test-cases');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));


  // Extract the HTML content of the page
  const htmlContent = await page.content();

  const searchString = "Sign in FHERMA";
  var needLogin = false;
  if (htmlContent.includes(searchString)) {
      console.log(`Need login.`);
      needLogin = true;
  } else {
      console.log(`The string "${searchString}" does not exist in the HTML content.`);
  }

  if (needLogin) {
       const inputField = 'input[placeholder="Email"]';
       const passField = 'input[placeholder="Password"]';

       // Wait for the login form to load
       await page.waitForSelector(inputField);
       await page.waitForSelector(passField);

       // Enter username and password
       await page.type(inputField, 'mykonosparty4@gmail.com'); // Replace with the actual selector and username
       await page.type(passField, '111111Aa'); // Replace with the actual selector and password

       const searchResultSelector = '.form__btn';
      //  const signInButton = await page.waitForSelector('button ::-p-text(Sign In)', {timeout: 1000}); // Replace with the actual selector
       const signInButton = await page.waitForSelector(searchResultSelector); // Replace with the actual selector

       if (signInButton) {
           console.log("Button 'Sign in' exists on the webpage.");
       } else {
           console.log("Button 'Sign in' does not exist on the webpage.");
       }

      await page.click(searchResultSelector);

      //  // Click the login button and wait for navigation
      // //  await signInButton.click(); // Replace with the actual selector for the login button
       await page.waitForNavigation(); // Wait for the navigation to complete

      console.log(`Login clicked.`);

      // Check for successful login indicator (e.g., a specific element that only appears after login)
      if (await page.waitForSelector('.test-case-list')) { // Replace with the actual selector
          console.log("Login successful!");
      } else {
          console.log("Login not successful");
      }

      for (let index = start; index <= end; index++) {
        // Construct the string
        const runButtonSelector = '.run-btn';
        // 1. click the upload "run" button the class is run-btn
        await page.waitForSelector(runButtonSelector);
        console.log("run button found on page");

        const buttons = await page.$$(runButtonSelector)
        console.log("length of buttons is " + buttons.length);
        const fileName = `out_${index}.bin`;

        // Print the string to the console
        console.log(fileName);
        const [fileChooser] = await Promise.all([
          page.waitForFileChooser(),
          buttons[2].click()
        ]);
        console.log("run button clicked");

        fileHandle = fileHandleBase + fileName;
        await fileChooser.accept([fileHandle]);

        // Additional actions can be added here, such as writing the string to a file
        const loadingBarSelector = '.loading-bar'
        await page.waitForFunction(selector => !document.querySelector(selector), {timeout: 240000}, loadingBarSelector);
        console.log("validation completed");

        const deepSelector = 'div.progress-circle text';
        const progresses = await page.$$eval(deepSelector, progresses => {
          return progresses.map(progress => progress.textContent);
        });
        console.log(`number of progresses: ${progresses.length}`);
        const progressText = progresses[5];

        console.log(`progressText: ${progressText}`);
        var correctVal = -1;
        if (progressText.includes("50.35%")){
          correctVal = 0;
        } else if (progressText.includes("50.36%")){
          correctVal = 1;
        }
        var resultToLog = `(${index}, ${correctVal})\n`;  // '\n' ensures the line ends with a newline character
        fs.appendFile(logFilePath, resultToLog, (err) => {
          if (err) {
            console.error('Error appending to file:', err);
            return;
          }
          console.log('Line successfully appended to file.');
         });
      }
  }

  // Write the HTML content to a file

  await browser.close();
})();
