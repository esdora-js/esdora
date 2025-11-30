#!/usr/bin/env bash

# Get current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Check if current branch is main
if [ "$current_branch" = "main" ]; then
  echo ""
  echo "Error: You are not allowed to commit directly to the 'main' branch."
  echo "错误：不允许直接在 'main' 分支上提交。"
  echo ""
  echo "Please create a new branch for your work:"
  echo "请为您的工作创建一个新分支："
  echo "  git checkout -b feature/your-feature-name"
  echo ""
  exit 1
fi

exit 0
