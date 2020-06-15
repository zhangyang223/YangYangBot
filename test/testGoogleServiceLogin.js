const {google} = require('googleapis');
const youtube = google.youtube('v3');

// this does not work at the moment.  
// i am getting Daily Usage limitation so some reasons that I don't know how to fix.

async function main () {
  // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables.
  /*
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    keyFile: './secrets/GoogleServiceAccount.json',
    scopes: ['https://www.googleapis.com/auth/youtube']
  });


  const authClient = await auth.getClient();

  // obtain the current project Id
  const project = await auth.getProjectId();


  // Fetch the list of GCE zones within a project.
  //const res = await compute.zones.list({ project, auth: authClient });

  const res = await youtube.search.list({
    part: 'id,snippet',
    q: '忘不了',
    auth: authClient
  });

  
  //console.log(res.data);
  var myJSON = JSON.stringify(res.data);
  console.log(myJSON);
  */
}

main().catch(console.error);