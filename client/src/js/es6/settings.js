let httpApiHost = 'http://127.0.0.1:8088/api';


const SETTINGS = {
  api: {
    http: {
      baseUrl: httpApiHost,
      stateEndpoint: '/state/',
      tokenGetEndpoint: '/token/get/',
      tokenVerifyEndpoint: '/token/verify/',
      registrationEndpoint: '/registration/',
      userListEndpoint: '/users/',
      privateThreadListCreateEndpoint: '/threads/private/',
      groupThreadListCreateEndpoint: '/threads/group/',
      privateMessageListCreateEndpoint: '/messages/private/',
      groupMessagesListCreateEndpoint: '/messages/group/',
    }
  }
};

export {SETTINGS as default}

