'use strict';

var assert = require('assert');

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver');


chrome.setDefaultService(
  new chrome.ServiceBuilder(chromeDriver.path).build()
);

var driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.firefox())
  .build();


driver.manage().timeouts().implicitlyWait(1000);
driver.get('http://lowesbuildandgrow.com/pages/default.aspx').then(function() {
return driver.isElementPresent(webdriver.By.css('#sign-in'));
}).then(function(present) {
  if (present) {
    return driver.findElement(webdriver.By.css('#sign-in')).click().then(function() {
      driver.sleep(1000);
      driver.switchTo().frame('fancybox-frame');
      return driver.findElement(webdriver.By.css('#emailID')).sendKeys('jason.live@me.com');
    }).then(function() {
      return driver.findElement(webdriver.By.css('.password-clear2')).sendKeys('h3zdwp', webdriver.Key.ENTER);

    });
  }

}).then(function(){
    return driver.findElement(webdriver.By.css('.form-style2')).sendKeys('91748', webdriver.Key.ENTER);   
});


driver.sleep(1000 * 5);
driver.quit();

