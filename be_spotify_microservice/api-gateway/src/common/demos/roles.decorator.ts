import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Define a custom decorator for roles
export const Roles = (roles: string[]) => SetMetadata('roles', roles);
