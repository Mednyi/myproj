# Клонировать репозиторий
git clone <repo path> <path to folder>
# Перейти на ветку
git checkout <branch name>
# Проверить статус файлов репозитория
git status   
# Добавить файлы к коммиту
git add <[file/folder name] [.]>
# Закоммитить файлы в репозиторий
git commit -am "<commit message>"
# Положить изменения в удаленный репозиторий
git push <имя ветки>
# Обновить информацию о удаленном репозитории
git fetch
# Просмотр списка изменений
git log [--oneline] [--graph] [--decorate]
# Перейти к указанному коммиту и создать новый коммит для отката текущих изменений
git revert <номер коммита>