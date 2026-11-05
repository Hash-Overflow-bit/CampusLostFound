import handler from "../api/chat.js";

export function assistantDevPlugin() {
  return {
    name: "campus-assistant-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split("?")[0] !== "/api/chat") return next();
        response.status = (code) => { response.statusCode = code; return response; };
        response.json = (data) => {
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify(data));
          return response;
        };
        try {
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 12_000) return response.status(413).json({ error: "Keep your question and conversation history short." });
            chunks.push(chunk);
          }
          request.body = Buffer.concat(chunks).toString("utf8");
          await handler(request, response);
        } catch {
          if (!response.headersSent) response.status(500).json({ error: "The campus assistant is temporarily unavailable." });
          else if (!response.writableEnded) response.end();
        }
      });
    },
  };
}
