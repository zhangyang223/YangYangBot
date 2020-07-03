let expect    = require("chai").expect;
const artifact = require('@actions/artifact');
const path = require('path');

const artifactClient = artifact.create()
const artifactName = 'my-artifact111';
const rootDirectory = 'C:\\Newman\\DiscordBot\\dev\\yangyangbot\\YangYangBot\\test'

describe("Test GitHub Artifacts", function() 
{
  it("Upload", function() 
  {

  let filepath = path.join(__dirname, '../test/notes.txt');
  const files = [ filepath ];
/*
  artifactClient.uploadArtifact(artifactName, files, rootDirectory).then(
      (r) => {console.table(r);}, (e) => {console.error(e);}
      );
      */
  });

  it("Download", function() 
  {

  });
  

});

