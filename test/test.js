var expect    = require("chai").expect;
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const getSongInfo = require("../play/getSongInfo.js");
const ytdl = require("ytdl-core");
const c = require("googleapis");
const request = require('request-promise');
var select = require('soupselect').select;
var htmlparser = require('htmlparser');

const {google} = require('googleapis');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {JWT} = require('google-auth-library');
const keys = require('../secrets/MyProject-b427ed78b81d.json');

const youtube = google.youtube('v3');

function callGoogle()
{
  
  // initialize the Youtube API library
  
  // a very simple example of searching for youtube videos
  // this works.
  async function runSample() 
  {
    var keyfilepath = path.join(__dirname, '../secrets/client_secret_962603753191-3o0u03pi75oid7a3161efn4kl2sqvlu8.apps.googleusercontent.com.json');

    console.log("keyfilepath=" + keyfilepath );


    const auth = await authenticate({
      keyfilePath: keyfilepath,
      scopes: ['https://www.googleapis.com/auth/youtube'],
    });
    google.options({auth});

  
    const res = await youtube.search.list({
      part: 'id,snippet',
      q: '忘不了',
//      order: 'rating',
    });
    //console.log(res.data);
    var myJSON = JSON.stringify(res.data);
    console.log(myJSON);
  }
  
  runSample().catch(console.error);
  
}

// this does not work
function callGoogle2()
{


  async function aaa() {
    /*
    const keyFile = 'My Project-b427ed78b81d.json';
    const url = `https://www.googleapis.com/auth/youtube/`;
    const client = new JWT(
      keys.client_email,
      keyFile,
      keys.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
    );
*/
//    const res = await client.request({url});

    const res = await youtube.search.list({
      part: 'id,snippet',
      q: '潘越云 不了情',
    });
  
    console.log(res.data);
  }

  aaa().catch(console.error);
}

describe("Unit Test", function() 
{
  it("converts the basic colors", function() {
    var redHex   = 1;
//    var greenHex = converter.rgbToHex(0, 255, 0);
//    var blueHex  = converter.rgbToHex(0, 0, 255);

    expect(redHex).to.equal(1);
//    expect(greenHex).to.equal("00ff00");
//    expect(blueHex).to.equal("0000ff");
  });

  it("test getSongInfo", function() {
    var expected = '190';
/*    {
      info: songInfo,
      title:  songInfo.title,
      url: songInfo.video_url,
      length: songInfo.length_seconds,
    };
    */
    var url = "https://www.youtube.com/watch?v=0OhHf7FfdC0";

    async function ttt ()
    {
      var songInfo = await getSongInfo.get(url);
      /*
      songInfo.info.formats.forEach(format => 
        {
        console.log(format);
      });
      */
      ytdl.chooseFormat(songInfo.info.formats, {quality: 'highestaudio'});
      return songInfo;
    }

    ttt().then(info => {expect(expected).to.equal(info.length);});
  
  });


  it("print encoded text", function() 
  {
//    var clear   = "<XXX>NzEzNTUwM<XXX>zY3MTY1N<XXX>jQ0ODEw.XuRUKw.f6kL<XXX>RvAwKJV5KXLUlcaExJH<XXX>PqXs";
//    console.log(Buffer.from(clear).toString('base64'));
    

//    var encoded = "TnpFek5UVXdNelkzTVRZMU5qUTBPREV3Llh1UlVLdy5mNmtMUnZBd0tKVjVLWExVbGNhRXhKSFBxWHM=";
//    console.log(Buffer.from(encoded, 'base64').toString());
  });

  /* DO NOT USE THIS.  Use Ksoft
  it("STAND4 Test", function() 
  {
    var expected = '190';

//    const encodedURI = encodeURI('https://www.stands4.com/services/v2/lyrics.php?uid=7829&tokenid=1b9K06ed7UQkIRXt&term=忘不了&format=json');
    const encodedURI = encodeURI('https://www.lyrics.com/lyrics/忘不了');
    const options = 
    {
      method: 'GET',
//      uri: 'https://www.stands4.com/services/v2/lyrics.php?uid=7829&tokenid=1b9K06ed7UQkIRXt&term=%E5%BF%98%E4%B8%8D%E4%BA%86&format=json',
        uri: encodedURI,
        json: true
    }

    request(options)
      .then(function (response) 
      {
        // Request was successful, use the response object at will
        var handler = new htmlparser.DefaultHandler(function(err, dom) 
        {
          console.log("DefaultHandler");
          if (err) 
          {
              console.err('Error: ', + err);
              throw err;
          } 
          else 
          {
            console.log("inside else");
              var list = select(dom, 'pre');

              console.log("list.length=" + list.length);
              if (list.length >= 1)
              {
                var text = list[0];
//                console.log(text);
              }
          }

        });

        async function callParser()
        {
          console.log("callParser");
          var parser = new htmlparser.Parser(handler);

          await parser.parseComplete(response);
        }
        callParser();
      })
      .catch(function (err) {
        // Something bad happened, handle the error
        console.error(err);
      });

  });
*/

  it("Google API", function() 
  {
    //callGoogle2();
  });

  it("Test JSON parsing", function() 
  {
    const expected = 'bzd3Gh5IRgw';
    const ytData = require("../test/youtuberesponse.json");
    expect(expected).to.equal(ytData.items[0].id.videoId);
  });

  it("Test Retrieving youtube search using SOUP", function() 
  {
    let url = "https://www.youtube.com/results?search_query=Frozen";
//    let url = "https://www.youtube.com/playlist?list=PLYPW-sfMha5bKoBaVlnaPf80vPeyIyh7O";
    let videoList = [];


    async function requestCB(err, res, body)
      {

        if (err) {
          console.err('Error: ', + err);
          throw err;
      } else {
          var handler = new htmlparser.DefaultHandler(function(err, dom) {
              if (err) {
                  console.err('Error: ', + err);
                  throw err;
              } else {
                  var list = select(dom, '.yt-lockup-thumbnail');


                  console.log("inside RequestCB DefaultHandler, list.length=", list.length);
                  
                  list.forEach(function(node, i) 
                  {
                    let item = node.children[0].attribs.href;

                    if (item != null)
                    {
                      var url = 'https://www.youtube.com' + item;

                      var padLength = String(list.length).length;
                      var index = (Array(padLength).join('0') + (i+1)).slice(-padLength);

                      videoList.push({
                          url: url
                      });
                    }
                  });
              }
          });

          var parser = new htmlparser.Parser(handler);
          await parser.parseComplete(body);

          if (videoList.length == 0)
          {
              console.log("SOUP failed to find any songs and recurse");
              getSongs();
          }
          else
          {
              console.log("SOUP added " + videoList.length + " songs to the queue!");;
          }
      }
    }
    
    function getSongs()
    {
      try
      {
          request.get(url, requestCB);
      }
      catch (error) 
      {
        console.error(error);
        msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', error.message);
      }

    }
    getSongs();
  
  });


  it("Test Retrieving youtube search using Cheerio", function() 
  {
    let url1 = "https://www.youtube.com/results?search_query=Frozen";
    var PAGE_ENCODING = 'utf-8'; // change to match page encoding

    function parse(url1) 
    {
      let videoList = [];
      request({
            url: url1,
            encoding: null  // do not interpret content yet
        }, function (error, response, body) {
            var $ = cheerio.load(iconv.decode(body, PAGE_ENCODING));

            $('.yt-lockup-thumbnail a').each(function () 
            {
              var yturl = 'https://www.youtube.com' + $(this).attr('href');

//              console.table(yturl);
              videoList.push(yturl);
            });
            console.log("found " + videoList.length + " songs from Cheerio");
          })
        return videoList;
    }
  
    let videoListFromPromise = [];
    async function parsePromise(url1)
    {
      await request({uri: url1, encoding: null, transform: function (body) {return cheerio.load(body);}})
      .then(function($){           
        $('.yt-lockup-thumbnail a').each(function () 
          {
            var yturl = 'https://www.youtube.com' + $(this).attr('href');
            videoListFromPromise.push(yturl);
          });
        console.log("found " + videoListFromPromise.length + " songs from Cheerio Promise");
        if (videoListFromPromise.length == 0)
        {
          console.log("Recurse");          
          parsePromise(url1);
        }
      })
      .catch(function(err){console.error(err);});
    }

    console.log("before parsePromise");
    parsePromise(url1);
    console.log("after parsePromise");
  });

});



/*
  it("Youtube search API", function() {
    var expected = '190';
    var url = "https://www.youtube.com/watch?v=0OhHf7FfdC0";

    
// Each API may support multiple version. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
const blogger = google.youtube_v3({
  version: 'v3',
  auth: 'AIzaSyArNdSiqTFy8aFItbBKx_1FxHTBF6t5Aps'
});

// get the blog details
blogger.blogs.get(params, (err, res) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`The blog url is ${res.data.url}`);
});


    async function ttt ()
    {
      var songInfo = await getSongInfo.get(url);
      /*
      songInfo.info.formats.forEach(format => 
        {
        console.log(format);
      });
      
      ytdl.chooseFormat(songInfo.info.formats, {quality: 'highestaudio'});
      return songInfo;
    }

    ttt().then(info => {expect(expected).to.equal(info.length);});
  
  });
*/


