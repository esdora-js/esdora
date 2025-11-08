/**
 * 验证树节点的子节点属性是否为有效的数组类型。
 *
 * 当子节点属性存在但不是数组时，抛出类型错误。
 * 允许子节点属性为 undefined 或 null。
 *
 * @param item - 要验证的树节点对象
 * @param childrenKey - 子节点属性的键名
 * @throws {TypeError} 当子节点属性存在但不是数组时抛出异常
 *
 * @example
 * ```typescript
 * const node = { id: 1, children: [{ id: 2 }] };
 * validateChildrenProperty(node, 'children'); // 不抛出异常
 *
 * const invalidNode = { id: 1, children: 'invalid' };
 * validateChildrenProperty(invalidNode, 'children'); // 抛出 TypeError
 * ```
 */
export function validateChildrenProperty<T>(
  item: T,
  childrenKey: string,
): void {
  const childrenValue = (item as any)[childrenKey]

  if (
    childrenValue !== undefined
    && childrenValue !== null
    && !Array.isArray(childrenValue)
  ) {
    // 构建更详细的错误信息
    const itemInfo = (item as any).id !== undefined
      ? ` (node with id: ${(item as any).id})`
      : (item as any).name !== undefined
          ? ` (node with name: ${(item as any).name})`
          : ''

    const actualType = typeof childrenValue === 'object'
      ? `object (${Object.prototype.toString.call(childrenValue).slice(8, -1)})`
      : typeof childrenValue

    throw new TypeError(
      `Expected '${childrenKey}' to be an array${itemInfo}, but got ${actualType}`,
    )
  }
}
