#!/bin/bash
# 珍宝签到生态 GitHub 一键上传脚本

# 1️⃣ 进入项目目录（把 checkin-ecosystem 改成你的项目目录）
cd checkin-ecosystem || exit

# 2️⃣ 初始化 git 仓库
git init

# 3️⃣ 添加所有文件
git add .

# 4️⃣ 提交文件
git commit -m "初始化珍宝签到生态 V1"

# 5️⃣ 设置 main 分支
git branch -M main

# 6️⃣ 关联远程仓库（替换为你的 GitHub 仓库地址）
git remote add origin https://github.com/wildZys/checkin-ecosystem.git

# 7️⃣ 推送到 GitHub
git push -u origin main

echo "✅ 上传完成，访问 https://github.com/wildZys/checkin-ecosystem 查看"
