let CLIENT_ID =
  "806463968374-s68d4qtmctnii0depe6vu13mss7blr81.apps.googleusercontent.com.apps.googleusercontent.com";
let API_KEY = "AIzaSyBo1dgqui7u0Vo9OTD5c_b6qpgWTTr9e_I";
let DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
let SCOPES = "https://www.googleapis.com/auth/drive.file";

let authorizeButton = document.getElementById("authorize_button");
let signoutButton = document.getElementById("signout_button");

/**
 *  Inicializa a API do cliente e a biblioteca de autenticação.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 * Inicializa a biblioteca do cliente com a chave da API e o OAuth 2.0.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(function () {
      // Inicializa os botões de autenticação
      let authInstance = gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(updateSigninStatus);

      // Verifica o status de autenticação
      updateSigninStatus(authInstance.isSignedIn.get());
      authorizeButton.onclick = function () {
        authInstance.signIn();
      };
      signoutButton.onclick = function () {
        authInstance.signOut();
      };
    });
}

/**
 * Atualiza o status de autenticação.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listFiles(); // Exemplo: listar arquivos
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 * Exemplo de função para listar arquivos no Google Drive.
 */
function listFiles() {
  gapi.client.drive.files
    .list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    })
    .then(function (response) {
      let files = response.result.files;
      if (files && files.length > 0) {
        let output = "Arquivos:\n";
        files.forEach((file) => {
          output += `${file.name} (${file.id})\n`;
        });
        document.getElementById("content").innerText = output;
      } else {
        document.getElementById("content").innerText =
          "Nenhum arquivo encontrado.";
      }
    });
}
