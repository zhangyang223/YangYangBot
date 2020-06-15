module.exports = 
{
    parse(text)
    {
        let index = text.indexOf(' ');
        if (index != -1 && index < text.length)
        {
            let result = text.slice(index + 1).split(',');
            return result.map(item => item.trim());
        }
        else
            return [];
    },

    parseIntegers(text)
    {
        let track = -1;
        let pos = -1;
        let result = null;

        const textArray = this.parse(text);

        if (textArray.length > 0)
        {
            try 
            {
                result = textArray.map(item => parseInt(item, 10));
                let foundNaN = false;

                for (var i = 0; i < result.length; i++)
                {
                    if (isNaN(result[i]))
                    {
                        foundNaN = true;
                        break;
                    }
                }

                if (foundNaN)
                {
                    result = null;
                }
            }
            catch(err) 
            {
                result = null;
            }
        }

        return result;
    }
}