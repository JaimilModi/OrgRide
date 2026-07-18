import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError, UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';

export interface LoginResult {
  token: string;
  isFirstLogin: boolean;
  employee: {
    id: string;
    employeeId: string;
    email: string;
    name: string;
    role: string;
    orgId: string;
  };
}

export class AuthService {
  /**
   * Registers a new employee and optionally their vehicle
   */
  static async register(data: any): Promise<LoginResult> {
    const { name, email, phone, gender, password, ...driverFields } = data;
    
    // Check if employee already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      throw new BadRequestError('Email is already registered');
    }

    // Get first organization as default for hackathon
    let organization = await prisma.organization.findFirst();
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'OrgRide Default Org',
          domain: email.includes('@') ? email.split('@')[1] : 'orgride.com',
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate random employee ID
    const employeeId = 'EMP-' + Math.floor(10000 + Math.random() * 90000);

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        orgId: organization.id,
        employeeId,
        email,
        passwordHash,
        name,
        phone,
        gender: gender || 'MALE',
        isFirstLogin: false,
        status: 'ACTIVE',
      },
      include: {
        organization: true
      }
    });

    // If driver fields are provided, create a vehicle with dummy data for missing fields
    if (driverFields.vehicleNumber && driverFields.vehicleType) {
      await prisma.vehicle.create({
        data: {
          ownerId: employee.id,
          vehicleNumber: driverFields.vehicleNumber,
          type: driverFields.vehicleType,
          brand: 'Generic Brand',
          model: 'Generic Model',
          color: 'White',
          fuelType: driverFields.fuelType || 'PETROL',
          seatingCapacity: parseInt(driverFields.availableSeats) || 4,
          registrationYear: new Date().getFullYear(),
          vehicleImage: driverFields.vehiclePhoto || 'dummy-url',
          rcNumber: 'RC-' + Math.floor(10000 + Math.random() * 90000),
          rcImage: driverFields.rcPhoto || 'dummy-url',
          insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'ACTIVE'
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        orgId: employee.orgId
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      isFirstLogin: employee.isFirstLogin,
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        orgId: employee.orgId
      }
    };
  }

  /**
   * Authenticates an employee by email or employee ID
   */
  static async login(loginId: string, password: string): Promise<LoginResult> {
    // Find employee by email or employee ID, including organization domain
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: loginId },
          { employeeId: loginId }
        ]
      },
      include: {
        organization: true
      }
    });

    if (!employee) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify account status
    if (employee.status === 'INACTIVE') {
      throw new ForbiddenError('Your account is inactive. Access denied.');
    }
    if (employee.status === 'SUSPENDED') {
      throw new ForbiddenError('Your account is suspended. Access denied.');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Domain verification if loginId was an email
    if (loginId.includes('@')) {
      const emailDomain = loginId.split('@')[1];
      if (emailDomain.toLowerCase() !== employee.organization.domain.toLowerCase()) {
        throw new ForbiddenError('Email domain does not match organization domain');
      }
    }

    // Generate JWT token (including claims)
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        orgId: employee.orgId
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    // If it's first login, we don't update lastLogin yet (password change is required)
    if (!employee.isFirstLogin) {
      await prisma.employee.update({
        where: { id: employee.id },
        data: { lastLogin: new Date() }
      });
    }

    return {
      token,
      isFirstLogin: employee.isFirstLogin,
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        orgId: employee.orgId
      }
    };
  }

  /**
   * Resets/changes password for an authenticated employee
   */
  static async changePassword(employeeId: string, oldPassword: string, newPassword: string): Promise<void> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new AppError('Employee not found', StatusCodes.NOT_FOUND);
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, employee.passwordHash);
    if (!isOldPasswordValid) {
      throw new BadRequestError('Incorrect current password');
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password, flag, and lastLogin
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        passwordHash,
        isFirstLogin: false,
        lastLogin: new Date()
      }
    });
  }
}

// Extra local error helper import workaround since BadRequestError belongs to errors.ts
import { BadRequestError } from '../utils/errors.js';
