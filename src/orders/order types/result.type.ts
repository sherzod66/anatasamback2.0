import { InvitationInfo } from '@prisma/client';
export type TResult = {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  sign_time: string;
  error: string;
  error_note: string;
  sign_string: string;
  merchant_prepare_id: string;
  merchant_confirm_id: string;
};

export type IInvitationInfo = {} & Omit<InvitationInfo, 'id' | 'orderId'>;
