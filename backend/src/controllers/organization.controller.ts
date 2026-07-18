import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OrganizationService } from '../services/organization.service.js';
import { ForbiddenError } from '../utils/errors.js';

export const getOrganization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orgId = (req as any).user.orgId;
    const orgDetails = await OrganizationService.getOrganization(orgId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: orgDetails
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    
    // Enforce admin privileges
    if (user.role !== 'ADMIN') {
      throw new ForbiddenError('Only administrators can update organization details');
    }

    const orgId = user.orgId;
    const { name, logoUrl, description, address } = req.body;

    const updatedOrg = await OrganizationService.updateOrganization(orgId, {
      name,
      logoUrl,
      description,
      address
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Organization updated successfully',
      data: updatedOrg
    });
  } catch (error) {
    next(error);
  }
};
