# Chroma Client

Проект использует PostgreSQL через Drizzle ORM. Авторизация, сессии, подписки, настройки пользователя и Dashboard работают через одну базу данных.

## Подключение базы

Скопируйте `.env.example` в `.env.local` и задайте `DATABASE_URL` с параметром `sslmode=require` для удалённой PostgreSQL-базы. Реальные пароли и ключи не должны попадать в Git.

После подключения примените схему проекта через используемый в окружении migration workflow Drizzle, затем запустите:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

## Auth flow

`POST /api/auth/register` создаёт пользователя, связанные записи `subscriptions` и `user_settings`, затем устанавливает HttpOnly session cookie и переводит пользователя на `/loader`.

`POST /api/auth/login` проверяет пароль из PostgreSQL, гарантирует наличие связанных subscription/settings записей, устанавливает HttpOnly session cookie и сразу переводит пользователя на `/loader` Dashboard. Тестовый hardcoded-аккаунт удалён.

По умолчанию используется русский язык. Английский можно включить через переключатель языка в интерфейсе.
