
export function dumpObject (
  obj: any,
  lines: string[] = [],
  isLast = true,
  prefix = ''
) {
  const localPrefix = isLast ? '└─' : '├─'
  lines.push(
      `${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${
        obj.type
      }]`
  )
  const newPrefix = prefix + (isLast ? '  ' : '│ ')
  const lastNdx = obj.children.length - 1
  obj.children.forEach((child: any, ndx: number) => {
    const isLast = ndx === lastNdx
    dumpObject(child, lines, isLast, newPrefix)
  })
  return lines
}
