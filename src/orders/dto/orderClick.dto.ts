export class orderClickPrepareDto {
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
}

export class orderClickCompleteDto {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  sign_time: string;
  error: string;
  error_note: string;
  merchant_prepare_id: string;
  sign_string: string;
}
