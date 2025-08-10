import * as IOCService from '../lib/IOCService';
import * as SourceService from '../lib/SourceService';

export const IOC = {
  list: IOCService.list,
  refresh: IOCService.refresh,
  create: IOCService.create,
  update: IOCService.update,
  delete: IOCService.remove,
};

export const Source = {
  list: SourceService.list,
  create: SourceService.create,
  update: SourceService.update,
  delete: SourceService.remove,
};
