import { Request } from 'express';

export interface PageQuery {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const parsePagination = (req: Request): PageQuery => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;
  const sortBy = String(req.query.sortBy ?? 'createdAt');
  const sortOrder = String(req.query.sortOrder ?? 'desc') === 'asc' ? 'asc' : 'desc';

  return { page, limit, skip, sortBy, sortOrder };
};
