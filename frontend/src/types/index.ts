export interface Employee {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'ADMIN';
  orgId: string;
}

export type RideStatus = 'SCHEDULED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
export type TransactionType = 'RECHARGE' | 'PAYMENT' | 'REFUND' | 'CREDIT';

export interface Ride {
  id: string;
  driverId: string;
  vehicleId: string;
  sourceAddress: string;
  destinationAddress: string;
  pickupAt: string;
  pricePerSeat: number | string;
  availableSeats: number;
  bookedSeats: number;
  femaleOnly: boolean;
  status: RideStatus;
  driver?: Employee;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  seatsBooked: number;
  status: BookingStatus;
  ride?: Ride;
  passenger?: Employee;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  amount: number | string;
  type: TransactionType;
  description: string | null;
  createdAt: string;
}

export interface Wallet {
  id: string;
  employeeId: string;
  balance: number | string;
}
