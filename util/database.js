var fs = require('fs');
const utf8 = require('utf8');
const dbFolder = "dbdata";

/*
const song = {
  info: null,
  title: playlist[i].title,
  url: playlist[i].url,
  length: null,
  requestor: message.author.tag,
  query: message.content
};
*/

module.exports = 
{
  write(songs, guildid) 
  {
    let obj = songs.map ((elem) => {
      return {
        title: elem.title,
        url: elem.url,
        length: elem.length,
        requestor: elem.requestor,
        query: elem.query
      }});
      this.writeObj(obj, guildid);    
  },

  writeObj(obj, guildid) 
  {
    const filename = dbFolder + "/" + guildid + ".json";
    try 
    {
      if (!fs.existsSync(dbFolder))
      {
        fs.mkdirSync(dbFolder);
      }

      let data = JSON.stringify(obj);
      let utf8data = utf8.encode(data);

//      fs.writeFile(filename, utf8data, (err) => {if (err) console.error(err);});      
      console.log("saving to " + filename);
      fs.writeFileSync(filename, utf8data);      
    } 
    catch (error) 
    {
        console.error(error);
    }
  },

  read(guildid)
  {
    let obj = this.readObj(guildid);

    let songs = obj.map ((elem) => {
      return {
        info: null,
        title: elem.title,
        url: elem.url,
        length: elem.length,
        requestor: elem.requestor,
        query: elem.query
      }});

    return songs;
  },

  readObj(guildid)
  {
    const filename = dbFolder + "/" + guildid + ".json";
    try 
    {
      if (fs.existsSync(filename))
      {
        let contents = fs.readFileSync(filename, 'utf8');
        let utf16Data = utf8.decode(contents);
        let obj = JSON.parse(utf16Data);
        
        return obj;
      }
      else
        return [];
    }
    catch (error)
    {
      console.error(error);
    }
    return [];
  }
};
