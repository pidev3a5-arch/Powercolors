/**
 * Utility function to compute the pagination range array with sibling pages and ellipsis (...),
 * matching the reference navigation pagination designs.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 2
): (number | '...')[] {
  if (totalPages <= 1) return [1];

  const totalNumbers = siblingCount * 2 + 5;

  // Case 1: If total pages is small enough to show all page numbers
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // Case 2: No left dots, but show right dots (e.g. [1, 2, 3, 4, 5, 6, 7, '...', 20])
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', lastPageIndex];
  }

  // Case 3: Show left dots, but no right dots (e.g. [1, '...', 14, 15, 16, 17, 18, 19, 20])
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, '...', ...rightRange];
  }

  // Case 4: Both left and right dots (e.g. [1, '...', 8, 9, 10, 11, 12, '...', 25])
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
