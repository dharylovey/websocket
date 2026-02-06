cd /home/claude && cat > project-structure.txt << 'EOF'
nestjs-realtime-posts/
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ ├── common/
│ │ ├── filters/
│ │ │ └── http-exception.filter.ts
│ │ ├── interceptors/
│ │ │ ├── request-id.interceptor.ts
│ │ │ └── response-transform.interceptor.ts
│ │ ├── middleware/
│ │ │ └── request-id.middleware.ts
│ │ └── types/
│ │ └── api-response.type.ts
│ ├── config/
│ │ └── database.config.ts
│ ├── db/
│ │ ├── drizzle.module.ts
│ │ ├── drizzle.service.ts
│ │ └── schema/
│ │ └── posts.schema.ts
│ ├── posts/
│ │ ├── posts.module.ts
│ │ ├── posts.controller.ts
│ │ ├── posts.service.ts
│ │ ├── posts.repository.ts
│ │ ├── dto/
│ │ │ ├── create-post.dto.ts
│ │ │ ├── update-post.dto.ts
│ │ │ ├── list-posts.dto.ts
│ │ │ └── post-response.dto.ts
│ │ └── types/
│ │ └── post.types.ts
│ └── ws/
│ ├── ws.module.ts
│ ├── ws.gateway.ts
│ ├── ws.service.ts
│ └── types/
│ └── ws-event.types.ts
└── drizzle/
└── migrations/
EOF
cat project-structure.txt
Output

nestjs-realtime-posts/
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ ├── common/
│ │ ├── filters/
│ │ │ └── http-exception.filter.ts
│ │ ├── interceptors/
│ │ │ ├── request-id.interceptor.ts
│ │ │ └── response-transform.interceptor.ts
│ │ ├── middleware/
│ │ │ └── request-id.middleware.ts
│ │ └── types/
│ │ └── api-response.type.ts
│ ├── config/
│ │ └── database.config.ts
│ ├── db/
│ │ ├── drizzle.module.ts
│ │ ├── drizzle.service.ts
│ │ └── schema/
│ │ └── posts.schema.ts
│ ├── posts/
│ │ ├── posts.module.ts
│ │ ├── posts.controller.ts
│ │ ├── posts.service.ts
│ │ ├── posts.repository.ts
│ │ ├── dto/
│ │ │ ├── create-post.dto.ts
│ │ │ ├── update-post.dto.ts
│ │ │ ├── list-posts.dto.ts
│ │ │ └── post-response.dto.ts
│ │ └── types/
│ │ └── post.types.ts
│ └── ws/
│ ├── ws.module.ts
│ ├── ws.gateway.ts
│ ├── ws.service.ts
│ └── types/
│ └── ws-event.types.ts
└── drizzle/
└── migrations/
