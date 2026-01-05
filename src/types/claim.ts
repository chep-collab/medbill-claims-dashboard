export type Claim = {
  id: string;
  claim_number: string;
  patient_name: string;
  device_type: string;
  payer: string;
  status: string;
  amount: number;
  denial_reason: string | null;
  notes: string | null;
};
