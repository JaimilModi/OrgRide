import { prisma } from '../config/db.js';
import { AppError } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';

export class OrganizationService {
  /**
   * Fetches organization details by ID
   */
  static async getOrganization(orgId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: orgId }
    });

    if (!organization) {
      throw new AppError('Organization not found', StatusCodes.NOT_FOUND);
    }

    return organization;
  }

  /**
   * Updates organization details
   */
  static async updateOrganization(orgId: string, updateData: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
  }) {
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: orgId }
    });

    if (!organization) {
      throw new AppError('Organization not found', StatusCodes.NOT_FOUND);
    }

    // Perform database update
    const updatedOrganization = await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: updateData.name,
        logoUrl: updateData.logoUrl,
        description: updateData.description,
        address: updateData.address
      }
    });

    return updatedOrganization;
  }
}
