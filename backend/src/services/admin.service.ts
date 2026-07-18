import { prisma } from '../config/db.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { VerificationStatus, AccountStatus } from '@prisma/client';

export class AdminService {
  /**
   * System Analytics
   */
  static async getSystemStats() {
    const [
      totalEmployees,
      activeEmployees,
      suspendedEmployees,
      totalVehicles,
      pendingVehicles,
      verifiedVehicles,
      activeRides,
      completedRides,
      totalBookings,
      totalWallets,
      reports
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.employee.count({ where: { status: 'SUSPENDED' } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.vehicle.count({ where: { verificationStatus: 'VERIFIED' } }),
      prisma.ride.count({ where: { status: { in: ['SCHEDULED', 'STARTED'] } } }),
      prisma.ride.count({ where: { status: 'COMPLETED' } }),
      prisma.rideParticipant.count(),
      prisma.wallet.aggregate({ _sum: { balance: true } }),
      prisma.report.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    const openReports = reports.find(r => r.status === 'PENDING' || r.status === 'REVIEWING')?._count || 0;
    const resolvedReports = reports.find(r => r.status === 'RESOLVED')?._count || 0;

    return {
      totalEmployees,
      activeEmployees,
      suspendedEmployees,
      totalVehicles,
      pendingVehicles,
      verifiedVehicles,
      activeRides,
      completedRides,
      totalBookings,
      totalWalletBalance: totalWallets._sum.balance || 0,
      openReports,
      resolvedReports
    };
  }

  /**
   * Vehicles Management
   */
  static async getVehicles() {
    return prisma.vehicle.findMany({
      include: {
        employee: {
          select: { name: true, employeeId: true, email: true, department: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateVehicleVerification(id: string, status: VerificationStatus) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    return prisma.vehicle.update({
      where: { id },
      data: { verificationStatus: status },
      include: { employee: { select: { name: true, email: true } } }
    });
  }

  /**
   * Employees Management
   */
  static async getEmployees() {
    return prisma.employee.findMany({
      include: {
        _count: {
          select: { vehicles: true, rides: true, bookings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateEmployeeStatus(id: string, status: AccountStatus) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundError('Employee not found');
    if (employee.role === 'ADMIN') throw new BadRequestError('Cannot modify ADMIN account status');

    return prisma.employee.update({
      where: { id },
      data: { status }
    });
  }

  /**
   * Rides Management
   */
  static async getRides() {
    return prisma.ride.findMany({
      include: {
        driver: { select: { name: true, employeeId: true } },
        vehicle: { select: { brand: true, model: true, vehicleNumber: true } },
        _count: { select: { participants: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Bookings Management
   */
  static async getBookings() {
    return prisma.rideParticipant.findMany({
      include: {
        passenger: { select: { name: true, employeeId: true } },
        ride: {
          include: {
            driver: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
