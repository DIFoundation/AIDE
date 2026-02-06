export const swaggerUIOptions = {
    customCss: `
      .swagger-ui .topbar { 
        display: none; 
      }
      .swagger-ui .info { 
        margin: 50px 0; 
      }
      .swagger-ui .info .title {
        color: #2563eb;
        font-size: 36px;
      }
    `,
    customSiteTitle: "AIDE API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: "monokai"
      }
    }
  };