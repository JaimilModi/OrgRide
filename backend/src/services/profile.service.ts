import { prisma } from '../config/db.js';
import { AppError } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';

export class ProfileService {
  /**
   * Fetches an employee profile by ID (excluding password hash)
   */
  static async getProfile(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        employeeId: true,
        email: true,
        name: true,
        role: true,
        gender: true,
        languagePreference: true,
        phone: true,
        avatarUrl: true,
        address: true,
        emergencyContact: true,
        department: true,
        designation: true,
        workShift: true,
        profilePhoto: true,
        isFirstLogin: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            domain: true,
            logoUrl: true,
            description: true,
            address: true
          }
        }
      }
    });

    if (!employee) {
      throw new AppError('Employee profile not found', StatusCodes.NOT_FOUND);
    }

    return employee;
  }

  /**
   * Updates an employee profile
   */
  static async updateProfile(employeeId: string, updateData: {
    name?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    languagePreference?: string;
    avatarUrl?: string;
    address?: string;
    emergencyContact?: string;
    department?: string;
    designation?: string;
    workShift?: string;
    profilePhoto?: string;
  }) {
    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new AppError('Employee profile not found', StatusCodes.NOT_FOUND);
    }

    // Perform database update
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        name: updateData.name,
        phone: updateData.phone,
        gender: updateData.gender,
        languagePreference: updateData.languagePreference,
        avatarUrl: updateData.avatarUrl,
        address: updateData.address,
        emergencyContact: updateData.emergencyContact,
        department: updateData.department,
        designation: updateData.designation,
        workShift: updateData.workShift,
        profilePhoto: updateData.profilePhoto
      },
      select: {
        id: true,
        employeeId: true,
        email: true,
        name: true,
        role: true,
        gender: true,
        languagePreference: true,
        phone: true,
        avatarUrl: true,
        address: true,
        emergencyContact: true,
        department: true,
        designation: true,
        workShift: true,
        profilePhoto: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedEmployee;
  }
}
