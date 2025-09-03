export function toPageArgs({ page = 1, pageSize = 10 } = {}) {
  const limit = Math.min(Math.max(pageSize, 1), 100);
  const offset = Math.max((page - 1) * limit, 0);
  return { limit, offset };
}

export function toConnection({ rows, count, page, pageSize }) {
  const totalPages = Math.ceil(count / pageSize) || 1;
  return {
    nodes: rows,
    pageInfo: {
      page,
      pageSize,
      totalPages,
      totalCount: count,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
