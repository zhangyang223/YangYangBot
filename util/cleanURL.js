module.exports = 
{
  clean(url) 
  {
    try 
    {
      var returnVal = url;
      var index = url.indexOf(" ");
      if (index != -1)
      {
          returnVal = url.substring(index + 1);
          returnVal.trim();
      }
      return returnVal;
    } 
    catch (error) 
    {
        console.error(error);
    }
  
  }
};
