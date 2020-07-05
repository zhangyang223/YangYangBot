var fs = require('fs');
const utf8 = require('utf8');

module.exports = 
{
  write(guildid, obj) 
  {
    try 
    {
      let data = JSON.stringify(obj);
            
      let utf8data = utf8.encode(data);

      // write to a new file named 2pac.txt
      fs.writeFileSync(guildid + ".json", utf8data);      
    } 
    catch (error) 
    {
        console.error(error);
    }
  },

  read(guildid)
  {
    try 
    {
      let filename = guildid + ".json";
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
