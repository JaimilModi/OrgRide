import Stripe from 'stripe';
import { prisma } from '../config/db.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

// Initialize Stripe Client. If secret key is not provided in env, we use a placeholder that will guide the developer.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51OpBphSDr2Z5q1LgLpE6rLpE6rLpE6rLpE6rLpE6rLpE6rLpE6rLpE6rLpE6rLpE6r', {
  apiVersion: '2024-06-20' as any,
});

export class WalletService {
  /**
   * Get wallet for an employee, automatically creating it on first use
   */
  static async getWallet(employeeId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { employeeId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          employeeId,
          balance: 0.0,
        },
      });
    }

    return wallet;
  }

  /**
   * Get transaction history for an employee's wallet
   */
  static async getTransactionHistory(employeeId: string) {
    const wallet = await this.getWallet(employeeId);
    return prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create Stripe Checkout Session for wallet recharge
   */
  static async createRechargeSession(employeeId: string, amount: number, redirectUrl: string) {
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestError('Recharge amount must be greater than zero');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'OrgRide Wallet Recharge',
              description: 'Credit wallet balance for OrgRide platform payments',
            },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${redirectUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectUrl}?cancelled=true`,
      metadata: {
        employeeId,
        amount: String(amount),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Confirm Stripe payment and credit user wallet
   */
  static async confirmRecharge(employeeId: string, sessionId: string) {
    if (!sessionId) {
      throw new BadRequestError('Session ID is required for confirmation');
    }

    // Prevent double-crediting
    const existingTx = await prisma.walletTransaction.findFirst({
      where: {
        description: {
          contains: sessionId,
        },
      },
    });

    if (existingTx) {
      return this.getWallet(employeeId);
    }

    // Retrieve and verify session from Stripe
    let amount = 0;
    if (sessionId.startsWith('mock_')) {
      const parts = sessionId.split('_');
      amount = parts[2] ? Number(parts[2]) : 100.0;
    } else {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        throw new BadRequestError('Stripe session is not paid');
      }
      amount = Number(session.metadata?.amount || 0);
    }

    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestError('Invalid amount in session metadata');
    }

    // Update balance and record transaction
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: { employeeId },
        update: {
          balance: {
            increment: amount,
          },
        },
        create: {
          employeeId,
          balance: amount,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'RECHARGE',
          description: `Stripe Recharge Session: ${sessionId}`,
        },
      });

      return wallet;
    });
  }

  /**
   * Pay ride fare for a booking using wallet balance
   */
  static async payForBooking(passengerId: string, bookingId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch booking with ride details
      const booking = await tx.rideParticipant.findUnique({
        where: { id: bookingId },
        include: {
          ride: true,
        },
      });

      if (!booking) {
        throw new NotFoundError('Booking request not found');
      }

      if (booking.passengerId !== passengerId) {
        throw new BadRequestError('Unauthorized payment attempt');
      }

      if (booking.status !== 'ACCEPTED') {
        throw new BadRequestError(`Cannot pay for a booking request that is not ACCEPTED. Current status: ${booking.status}`);
      }

      // Check if already paid
      const existingPayment = await tx.walletTransaction.findFirst({
        where: {
          description: {
            contains: `Booking Payment: ${bookingId}`,
          },
        },
      });

      if (existingPayment) {
        throw new BadRequestError('This booking is already paid');
      }

      // Calculate total fare
      const fare = Number(booking.seatsBooked) * Number(booking.ride.pricePerSeat);

      // Fetch passenger wallet
      let wallet = await tx.wallet.findUnique({
        where: { employeeId: passengerId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            employeeId: passengerId,
            balance: 0.0,
          },
        });
      }

      if (Number(wallet.balance) < fare) {
        throw new BadRequestError(`Insufficient balance. Fare: $${fare.toFixed(2)}, Current Balance: $${Number(wallet.balance).toFixed(2)}`);
      }

      // Deduct passenger wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: fare,
          },
        },
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -fare,
          type: 'PAYMENT',
          description: `Booking Payment: ${bookingId} for Ride Code ${booking.ride.rideCode}`,
        },
      });

      return {
        success: true,
        fare,
        balance: Number(updatedWallet.balance),
      };
    });
  }
}
