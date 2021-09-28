const jwt = require('jsonwebtoken');
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';
// app.get('/', async (req, res) => {
//
// })
module.exports = {
  authMiddleware: function ({ req, res }) {
    // allows token to be sent via req.body, req.query, or headers
    /*
    * axios.post('/someBackendURl', { token: localStorage.getItem('token' })
    *
    * const token = localStorage.getItem('token');
    * axios.post(`/someUrl?token=${token}&name=coolguy', { data: someData });
    *
    * axios.post('/someBackendURl', { data}, {
    *   headers: {
    *      authorization: localStorage.getItem('token'),
    *   }
    * })
    * */
    let token = req.body.token || req.query.token || req.headers.authorization;
    // We split the token string into an array and return actual token
    //  token = 'Bearer asuyhdgayuodgasoudgadoyagdayudgsaouydsaoudaas'
    //   [ 'Bearer', 'asuyhdgayuodgasoudgadoyagdayudgsaouydsaoudaas'];
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    if (!token) {
      return req;
    }
    // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // { email, name, _id };
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    // return the request object so it can be passed to the resolver as `context`
    return req;
  },
  signToken: function ({ email, name, _id }) {
    const payload = { email, name, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
