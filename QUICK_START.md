# 🚀 Быстрый старт

## Проблема с PowerShell и npm?

Если вы видите ошибку о политике выполнения скриптов, используйте один из способов ниже:

### Способ 1: Использовать Command Prompt (cmd)

1. Откройте **Command Prompt** (cmd) вместо PowerShell
2. Перейдите в папку проекта:
   ```cmd
   cd D:\bjmbf\LifeCoding\react\ExamReactPlusTypescript\Phone-book
   ```
3. Запустите установку:
   ```cmd
   npm install
   ```

### Способ 2: Изменить политику выполнения PowerShell

Откройте PowerShell **от имени администратора** и выполните:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Затем в обычном PowerShell:
```powershell
cd D:\bjmbf\LifeCoding\react\ExamReactPlusTypescript\Phone-book
npm install
```

### Способ 3: Использовать скрипт install.ps1

В PowerShell выполните:
```powershell
cd D:\bjmbf\LifeCoding\react\ExamReactPlusTypescript\Phone-book
.\install.ps1
```

### Способ 4: Использовать npx напрямую

Если npm не работает, попробуйте:
```powershell
npx --yes npm install
```

## После установки

Запустите проект:
```bash
npm run dev
```

Откройте браузер по адресу: http://localhost:5173

## Если Node.js не установлен

1. Скачайте Node.js LTS: https://nodejs.org/
2. Установите с опцией "Add to PATH"
3. Перезапустите терминал
4. Проверьте: `node --version` и `npm --version`

