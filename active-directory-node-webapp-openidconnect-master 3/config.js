  // Don't commit this file to your public repos. This config is for first-run
  //
 exports.creds = {
 	returnURL: 'http://localhost:3000/auth/openid/return',
	 realm:'8281fdb4-af16-40ed-816a-0161e1ca49fc',
 	identityMetadata: 'https://login.microsoftonline.com/8281fdb4-af16-40ed-816a-0161e1ca49fc/.well-known/openid-configuration', // For using Microsoft you should never need to change this.
 	clientID: '7884b735-fff7-4e26-8bdd-0db02a01d6b5',
 	clientSecret: 'PifsNV8gNO2EutWbQvxnElubnLCDFXlHO/MK6DUPrKg=', // if you are doing code or id_token code
 	skipUserProfile: true, // for AzureAD should be set to true.
 	responseType: 'id_token code', // for login only flows use id_token. For accessing resources use `id_token code`
 	responseMode: 'query', // For login only flows we should have token passed back to us in a POST
 	//scope: ['email', 'profile'] // additional scopes you may wish to pass
 };
