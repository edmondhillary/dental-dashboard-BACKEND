function middleware(request, response, next) {
    const url = request.url;
    const method = request.method;
    const origin = request.ip;
    const userAgent = request.headers["user-agent"];
    const user = request.user ? request.user : '-';
    const role = request.role ? request.role : '-';
    const timelog = new Date();
    
    console.log(`SERVERLOG ${timelog} --> Middleware: [ URL: ${url} // METHOD: ${method} // ORIGIN: ${origin} // USER-AGENT: ${userAgent} // USER: ${user} // ROLE: ${role} ]`);
    
    // Websites to allow
    response.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    // Request headers to allow
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Access-Token, XKey, Authorization');
  
    // Request credentials
    response.setHeader('Access-Control-Allow-Credentials', true);
  
    next();
  }
  
  export default middleware;
  