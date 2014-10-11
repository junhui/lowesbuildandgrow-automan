'use strict';

var assert = require('assert');

var webdriver = require('selenium-webdriver');
//var chrome = require('selenium-webdriver/chrome');
//var chromeDriver = require('chromedriver');

var setting = require('./setting.json');

//chrome.setDefaultService(
//new chrome.ServiceBuilder(chromeDriver.path).build()
//);

var driver;

function takeIt(zipcode) {
  return driver.get('http://lowesbuildandgrow.com/pages/default.aspx')
    .then(function() {
      return driver.wait(function() {
        return driver.isElementPresent(webdriver.By.css('.form-style2'));
      });
    })
    .then(function() {
      return driver.findElement(webdriver.By.css('.form-style2')).sendKeys(zipcode, webdriver.Key.ENTER)
        .then(function() {
          return driver.wait(function() {
            return driver.isElementPresent(webdriver.By.css('#storeList li'));
          });
        })
        .then(function() {
          return driver.findElement(webdriver.By.css('#storeList li'));
        }).then(function(el) {
          return el.getText();
        }).then(function(text) {
          if (text.indexOf('Available') > 0) {
            return driver.findElement(webdriver.By.css('#storeList li a')).then(function(el) {
              return el.click();
            }).then(function() {
              return driver.findElement(webdriver.By.css('#mainContent_kidsList_selectMarker_0')).then(function(el) {
                return el.click();
              }).then(function() {
                return driver.findElement(webdriver.By.css('#register_large')).then(function(el) {
                  return el.click();
                }).then(function() {
                  return driver.findElement(webdriver.By.css('body')).then(function(el) {
                    return el.getText();
                  }).then(function(text) {
                    if (text.indexOf('Thank you for registering for Build and Grow!') > 0) {
                      console.log('well done!');
                    }
                  });
                });
              });
            });
          }
        });
    });
}

function notTake() {
  return driver.wait(function() {
      return driver.isElementPresent(webdriver.By.css('#myAccountsButton_LoginView1_myaccount'));
    }).then(function() {
      return driver.findElement(webdriver.By.css('#myAccountsButton_LoginView1_myaccount'));
    })
    .then(function(el) {
      return el.click();
    }).then(function() {
      return driver.wait(function() {
        return driver.isElementPresent(webdriver.By.css('#wrapper'));
      });
    }).then(function() {
      return driver.findElement(webdriver.By.css('#wrapper')).then(function(el) {
        return el.getText();
      }).then(function(text) {
        return text.indexOf('You have no upcoming clinics') > 0;
      });
    });
}

function login() {
  return driver.get('http://lowesbuildandgrow.com/pages/default.aspx')
    .then(function() {
      return driver.isElementPresent(webdriver.By.css('#sign-in'));
    }).then(function(present) {
      if (present) {
        return driver.findElement(webdriver.By.css('#sign-in')).click()
          .then(function() {
            return driver.wait(function() {
              return driver.findElement(webdriver.By.css('#fancybox-frame')).then(function() {
                driver.switchTo().frame('fancybox-frame');
                return driver.isElementPresent(webdriver.By.css('#emailID'));
              });
            });
          })
          .then(function() {
            return driver.findElement(webdriver.By.css('#emailID')).sendKeys(setting.loginName);
          }).then(function() {
            return driver.findElement(webdriver.By.css('.password-clear2')).sendKeys(setting.password, webdriver.Key.ENTER);
          });
      }
    });
}

var interval;

function run() {
    console.log('running', new Date());
    driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
    driver.manage().timeouts().implicitlyWait(1000);
    login().then(function() {
      var nottake = notTake();
      if (!nottake) {
        clearInterval(interval);
      }
      return nottake;
    }).then(function(notTake) {
      if (notTake) {
        takeIt(setting.zipcode);
      } else {
        console.log('you already enrolled!');
        clearInterval(interval);
      }
    }).then(function() {
      driver.sleep(1000 * 5);
      driver.quit();
    });
  }
  // run every 2 mins
var minutes = 1000 * 60 * setting.frequency;
interval = setInterval(run, minutes);
run();
