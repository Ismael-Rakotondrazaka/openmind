import type { Request } from '../../utils/request';
import type { RecordViewBody } from './view.schema';

export type RecordViewRequest = Request<{ success: boolean }, RecordViewBody>;
