import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
    credentials: true,
  });

  await app.listen(80, "0.0.0.0");
}
bootstrap();
