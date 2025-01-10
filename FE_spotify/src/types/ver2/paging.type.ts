export type PagingDto = {
  limit?: number;
  page?: number;
  cursor?: number;
};

export const fullFill = (paging: PagingDto) => {
  if (!paging.page) {
    paging.page = 1;
  }
  if (!paging.limit) {
    paging.limit = 60;
  }
};
