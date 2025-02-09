# Используем официальный образ Go
FROM golang:1.20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы go.mod и go.sum
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod tidy

# Копируем исходный код
COPY . .

# Собираем приложение
RUN go build -o my-app .

# Финальный этап
FROM alpine:latest

# Копируем скомпилированное приложение
COPY --from=builder /app/my-app /usr/local/bin/my-app

# Устанавливаем рабочую директорию
WORKDIR /app

# Запускаем приложение
CMD ["my-app"]
