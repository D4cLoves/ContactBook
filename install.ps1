# Скрипт для установки зависимостей
# Запустите этот файл: .\install.ps1

# Временно изменяем политику выполнения для текущей сессии
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Устанавливаем зависимости
npm install

Write-Host "Установка завершена!" -ForegroundColor Green

