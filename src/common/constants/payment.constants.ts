export enum PaymentStatus {
  pending = 'pending',
  processing = 'processing',
  success = 'success',
  failed = 'failed',
  canceled = 'canceled',
  dispute = 'dispute',
  incomplete = 'incomplete',
}

export enum PaymentChannel {
  car = 'card',
  transfer = 'transfer',
  p2p = 'p2p',
}
