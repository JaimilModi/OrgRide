import { prisma } from '../config/db.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { ReportCategory, ReportStatus } from '@prisma/client';

export class ReportService {
  /**
   * File a report on a ride
   */
  static async createReport(reporterId: string, data: any) {
    const { rideId, reportedUserId, category, description } = data;

    if (reporterId === reportedUserId) {
      throw new BadRequestError('You cannot report yourself');
    }

    // 1. Verify ride exists
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { participants: true }
    });

    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    // 2. Verify reported user exists
    const reportedUser = await prisma.employee.findUnique({
      where: { id: reportedUserId }
    });
    if (!reportedUser) {
      throw new NotFoundError('Reported user not found');
    }

    // 3. Verify reporter is part of the ride (driver or participant)
    const isReporterDriver = ride.driverId === reporterId;
    const isReporterPassenger = ride.participants.some(p => p.passengerId === reporterId);
    if (!isReporterDriver && !isReporterPassenger) {
      throw new ForbiddenError('You can only report rides you participated in');
    }

    // 4. Verify reportedUser is part of the ride (driver or participant)
    const isReportedDriver = ride.driverId === reportedUserId;
    const isReportedPassenger = ride.participants.some(p => p.passengerId === reportedUserId);
    if (!isReportedDriver && !isReportedPassenger) {
      throw new BadRequestError('The reported user is not associated with this ride');
    }

    return prisma.report.create({
      data: {
        rideId,
        reporterId,
        reportedUserId,
        category,
        description,
        status: 'PENDING'
      },
      include: {
        ride: {
          select: {
            rideCode: true,
            sourceAddress: true,
            destinationAddress: true
          }
        },
        reporter: {
          select: {
            name: true,
            email: true
          }
        },
        reportedUser: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Get reports list, scoped by user permissions
   */
  static async getReports(userId: string, role: string) {
    if (role === 'ADMIN') {
      return prisma.report.findMany({
        include: {
          ride: true,
          reporter: { select: { name: true, email: true } },
          reportedUser: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return prisma.report.findMany({
      where: {
        OR: [
          { reporterId: userId },
          { reportedUserId: userId }
        ]
      },
      include: {
        ride: true,
        reporter: { select: { name: true, email: true } },
        reportedUser: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get a single report details by ID
   */
  static async getReportById(id: string, userId: string, role: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        ride: true,
        reporter: { select: { name: true, email: true } },
        reportedUser: { select: { name: true, email: true } }
      }
    });

    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (role !== 'ADMIN' && report.reporterId !== userId && report.reportedUserId !== userId) {
      throw new ForbiddenError('You are not authorized to view this report');
    }

    return report;
  }

  /**
   * Update status (Admin Only)
   */
  static async updateReportStatus(id: string, status: ReportStatus) {
    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      throw new NotFoundError('Report not found');
    }

    return prisma.report.update({
      where: { id },
      data: { status },
      include: {
        ride: true,
        reporter: { select: { name: true, email: true } },
        reportedUser: { select: { name: true, email: true } }
      }
    });
  }
}
