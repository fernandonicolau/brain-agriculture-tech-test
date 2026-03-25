export type CreateProducerCommand = {
  document: string;
  name: string;
};

export type UpdateProducerCommand = Partial<CreateProducerCommand>;

export type ListProducersQuery = {
  page: number;
  limit: number;
};

export type ProducerResult = {
  id: string;
  document: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedProducersResult = {
  data: ProducerResult[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
