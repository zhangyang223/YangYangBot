let request = require('request-promise-native');
const https = require('https');
let expect    = require("chai").expect;

const myRequest = request.defaults({
  baseUrl: 'https://www.youtube.com',
  agent: new https.Agent({ keepAlive: true })
})

async function findResults() {
  const myResponse = await myRequest.get({
      uri: '/playlist?list=PLYPW-sfMha5bv9ggWsBOFLTOuRclSuXGJ'
  })
  return myResponse;
}

const initialTestResult = "initial";
let testResult = initialTestResult;
const tag = "AoAm4om0wTs";

function print(msg)
{
    var timestamp = new Date().toDateString();
    console.log(timestamp + " " + msg);    
}

async function cb1(res)
{
    expect(res.search(tag)).not.equal(-1);
    findResults();
    testResult += "cb1";
    return "cb1";
}

async function cb2(r)
{
    expect(r === "cb1").not.equal(-1);
    findResults();
    testResult += "cb2";
    return "cb2";
}

async function cb3(r)
{
    expect(r === "cb2").not.equal(-1);
    testResult += "cb3";
    return "cb3";
}

function resolveAfter1Second(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000);
  });
}

async function async1(r)
{
  await resolveAfter1Second(r);
  return r + "async1";
}

async function async2(r)
{
  await resolveAfter1Second(r);
  return r + "async2";
}

async function async3(r)
{
  await resolveAfter1Second(r);
  return r + "async3";
}

async function testAwait(a)
{
  const b = await async1(a);
  const c = await async2(b);
  const d = await async3(c);
  return d;
}

async function testAwaitAndCheckResult(expected)
{
  const actual = await testAwait(initialTestResult);
  expect(actual).equal(expected);
}

describe("Test Then", function() 
{

  it("Test Async 3 Then", function() {
    testResult = initialTestResult;
    findResults().then(cb1).then(cb2).then(cb3).then(() => {expect(testResult).not.equal(initialTestResult);});
  });
  
  it("3 awaits", function() {
    const expected = "";
    const actual = testAwait(initialTestResult);
    // NOTE: at this point, actual is a unresolved promise.
//    expect(actual).equal(expected);

  });

  it("3 awaits and checkresult", function() {
    const expected = initialTestResult + "async1async2async3";
    testAwaitAndCheckResult(expected);

  });
});


/*
describe("Test Get Lyrics 2", function() 
{
  it("Search", function() {
    var query = "小幸運";

    async function runAsync(query) 
    {
      return await getLyrics.get(query);
    }
    expect(runAsync(query)).not.equal("");
  });
  
});
*/

/*

const { KSoftClient } = require('@ksoft/api');

const ksoft = new KSoftClient('a4c6aef23cdde42913dc6d70e4de4a90b52f110b');

/* I use a helper asnyc function called main here.
 * This would also work using a lambda function or class method,
 * as long as it's asynchronous.
 *
async function main() 
{
    console.log("Testing KSoft");
    var query = "紅豆";
//    query = "小幸運";
//    query = "田馥甄  Hebe Tien 《小幸運》";
  query = "Michael Jackson - Smooth Criminal (Official Video)"
    var tracks = await ksoft.lyrics.search(query, { textOnly: true });

    var songFound = false;

    for(var item of tracks) 
    {
      console.table(item.lyrics);
      if (item.name != null)
        {
          if (item.name.search(query) != -1)
          {
            // found it.
            console.log("Found exact match");
            console.table(item.lyrics);
            songFound = true;
            break;
          }
        }
    };

    if (!songFound)
    {
      for(var item of tracks) 
      {
        if (item.lyrics != null)
        {
          if (item.lyrics.search(query) != -1)
          {
            // found it.
            console.log("Found through lyrics");
            console.table(item.lyrics);
            songFound = true;
            break;
          }
        }
      }
    }

    if (!songFound)
      console.log("Failed to find any lyrics");
        
//    var track = await ksoft.lyrics.get(query, { textOnly: true });

//    console.log("dumping track ****");
//    console.table(track);
}

main();

*/