export class PagingDto {
  limit: number;

  page: number;

  cursor: number;

  fullFill() {
    if (!this.page) {
      this.page = 1;
    }
    if (!this.limit) {
      this.limit = 20;
    }
  }
}
