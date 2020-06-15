var expect    = require("chai").expect;
const parser = require("../util/parseArgs.js");

const cmd = "=move";

describe("Test Parse Arguments", function() 
{
  it("Move Arguments 1", function() 
  {
    let input = cmd + ' 9,2';
//    let input2 = 'move  9 , 2';

    let actual = parser.parse(input);
    let expected = ['9','2'];
    expect(actual).to.deep.equal(expected);
  });
  
  it("Move Arguments 2", function() 
  {
    let input = cmd + '  9 , 2';

    let actual = parser.parse(input);
    let expected = ['9','2'];
    expect(actual).to.deep.equal(expected);
  });

  it("Parse Integer", function() 
  {
    let input =  cmd + '  2 , 4';

    let actual = parser.parseIntegers(input);
    let expected = [2,4];
    expect(actual).to.deep.equal(expected);
  });

  it("Parse Integer one number", function() 
  {
    let input =  cmd + '  2';

    let actual = parser.parseIntegers(input);
    let expected = [2];
    expect(actual).to.deep.equal(expected);
  });


  it("Parse Integer Error", function() 
  {
    let input =  cmd + ' ';

    let actual = parser.parseIntegers(input);
    let expected = null;
    expect(actual).equal(expected);
  });

});

