#!/bin/bash
# 文档链接验证脚本
# 用法: ./scripts/validate-doc-links.sh [directory]
# 示例: ./scripts/validate-doc-links.sh docs/contributing/documentation

set -e

# 默认检查目录
TARGET_DIR="${1:-docs/contributing/documentation}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory not found: $TARGET_DIR"
  exit 1
fi

echo "======================================"
echo "文档链接验证"
echo "======================================"
echo ""
echo "检查目录: $TARGET_DIR"
echo ""

TOTAL_LINKS=0
VALID_LINKS=0
BROKEN_LINKS=0
EXTERNAL_LINKS=0

# 提取所有 Markdown 文件中的链接
echo "## 提取链接..."
echo ""

# 查找所有 Markdown 文件
md_files=$(find "$TARGET_DIR" -name "*.md" -type f)

for file in $md_files; do
  echo "检查文件: $file"

  # 提取内部链接 [text](./path.md) 或 [text](./path)
  internal_links=$(rg '\[.*\]\(\./[^)]+\)' "$file" -o --no-line-number || echo "")

  if [ -n "$internal_links" ]; then
    while IFS= read -r link; do
      # 提取链接路径
      path=$(echo "$link" | sed 's/.*(\.\///' | sed 's/).*//')

      # 移除锚点 (# 后的部分)
      path_without_anchor=$(echo "$path" | sed 's/#.*//')

      # 构建完整路径
      # 如果路径不包含 .md 扩展名，添加 .md
      if [[ ! "$path_without_anchor" =~ \.md$ ]]; then
        path_without_anchor="${path_without_anchor}.md"
      fi

      # 计算相对于文件的目标路径
      dir=$(dirname "$file")
      target_file="$dir/$path_without_anchor"

      ((TOTAL_LINKS++))

      # 检查目标文件是否存在
      if [ -f "$target_file" ]; then
        ((VALID_LINKS++))
        echo "  ✅ $link"
      else
        ((BROKEN_LINKS++))
        echo "  ❌ $link (目标不存在: $target_file)"
      fi
    done <<< "$internal_links"
  fi

  # 提取外部链接 [text](http://...) 或 [text](https://...)
  external_links=$(rg '\[.*\]\(https?://[^)]+\)' "$file" -o --no-line-number || echo "")

  if [ -n "$external_links" ]; then
    while IFS= read -r link; do
      ((TOTAL_LINKS++))
      ((EXTERNAL_LINKS++))
      echo "  🌐 $link (外部链接，跳过验证)"
    done <<< "$external_links"
  fi
done

echo ""
echo "======================================"
echo "## 验证结果"
echo "======================================"
echo ""
echo "总链接数: $TOTAL_LINKS"
echo "有效内部链接: $VALID_LINKS"
echo "失效内部链接: $BROKEN_LINKS"
echo "外部链接: $EXTERNAL_LINKS"
echo ""

if [ "$BROKEN_LINKS" -eq 0 ]; then
  echo "✅ 所有内部链接有效"
  exit 0
else
  echo "❌ 发现 $BROKEN_LINKS 个失效链接"
  exit 1
fi
