/**
 * Utility function to combine CSS class names
 * Filters out falsy values and joins with spaces
 *
 * @param classes - Array of class names (can include undefined, null, false, '')
 * @returns Combined class string
 *
 * @example
 * classList('base', condition && 'active', undefined, 'extra')
 * // Returns: "base active extra"
 */
export function classList(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to combine CSS Modules class names from multiple sources
 * Useful when working with multiple CSS module imports
 *
 * @param classArrays - Multiple arrays of class names
 * @returns Combined class string
 *
 * @example
 * classListFromModules(
 *   [styles.button, styles.primary],
 *   [utils.fontMedium, utils.textBase]
 * )
 */
export function classListFromModules(
  ...classArrays: Array<Array<string | undefined | null | false>>
): string {
  return classArrays.flat().filter(Boolean).join(' ');
}
