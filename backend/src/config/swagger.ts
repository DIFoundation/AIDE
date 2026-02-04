import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CrisisAid API Documentation',
      version: version,
      description: `
        A comprehensive backend API for managing disaster relief resources, emergency alerts, 
        and community submissions during crisis situations.
        
        ## Features
        - **Resource Management**: Track shelters, food banks, medical facilities, water stations, and more
        - **Emergency Alerts**: Geographic-based emergency notifications with radius targeting
        - **Community Submissions**: Users can submit new resources, updates, and reports
        - **User Management**: Role-based access control (Admin, Volunteer, User)
        - **Location-Based Search**: Find nearby resources using coordinates
        - **Admin Dashboard**: Comprehensive statistics and analytics
        
        ## Authentication
        This API uses Bearer token authentication via Supabase Auth. 
        Include the token in the Authorization header: \`Bearer <your_token>\`
        
        ## Rate Limiting
        API requests may be rate limited. Please implement appropriate throttling in your client.
      `,
      contact: {
        name: 'CrisisAid Support',
        url: 'https://github.com/DIFoundation/CrisisAid',
        email: 'support@crisisaid.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://crisisaid-backend.onrender.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Resources',
        description: 'Disaster relief resource management'
      },
      {
        name: 'Alerts',
        description: 'Emergency alert management'
      },
      {
        name: 'Submissions',
        description: 'Community submission management'
      },
      {
        name: 'Users',
        description: 'User profile and management'
      },
      {
        name: 'Dashboard',
        description: 'Admin dashboard statistics and analytics'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Supabase JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              },
              description: 'Validation errors (if applicable)'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'VOLUNTEER', 'USER'],
              description: 'User role'
            },
            verified: {
              type: 'boolean',
              description: 'Whether user is verified'
            },
            organization: {
              type: 'string',
              nullable: true,
              description: 'User organization'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'User phone number'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Resource: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Resource ID'
            },
            name: {
              type: 'string',
              description: 'Resource name'
            },
            type: {
              type: 'string',
              enum: ['SHELTER', 'FOOD', 'MEDICAL', 'WATER', 'CLOTHING', 'OTHER'],
              description: 'Type of resource'
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'LIMITED', 'UNAVAILABLE', 'TEMPORARILY_CLOSED'],
              description: 'Current status of resource'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Resource description'
            },
            verified: {
              type: 'boolean',
              description: 'Whether resource is verified'
            },
            capacity: {
              type: 'integer',
              nullable: true,
              description: 'Maximum capacity'
            },
            current_occupancy: {
              type: 'integer',
              nullable: true,
              description: 'Current occupancy'
            },
            latitude: {
              type: 'number',
              format: 'double',
              nullable: true,
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              format: 'double',
              nullable: true,
              description: 'Longitude coordinate'
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Street address'
            },
            city: {
              type: 'string',
              nullable: true,
              description: 'City'
            },
            country: {
              type: 'string',
              nullable: true,
              description: 'Country'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Contact phone'
            },
            email: {
              type: 'string',
              format: 'email',
              nullable: true,
              description: 'Contact email'
            },
            operating_hours: {
              type: 'string',
              nullable: true,
              description: 'Operating hours'
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Additional notes'
            },
            submitted_by: {
              $ref: '#/components/schemas/User'
            },
            verified_by: {
              $ref: '#/components/schemas/User',
              nullable: true
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Alert: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Alert ID'
            },
            title: {
              type: 'string',
              description: 'Alert title'
            },
            message: {
              type: 'string',
              description: 'Alert message'
            },
            severity: {
              type: 'string',
              enum: ['INFO', 'WARNING', 'DANGER', 'CRITICAL'],
              description: 'Alert severity level'
            },
            latitude: {
              type: 'number',
              format: 'double',
              nullable: true,
              description: 'Center latitude'
            },
            longitude: {
              type: 'number',
              format: 'double',
              nullable: true,
              description: 'Center longitude'
            },
            radius_km: {
              type: 'number',
              format: 'double',
              description: 'Radius in kilometers'
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Address'
            },
            affected_areas: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
              description: 'List of affected areas'
            },
            instructions: {
              type: 'string',
              nullable: true,
              description: 'Safety instructions'
            },
            active: {
              type: 'boolean',
              description: 'Whether alert is active'
            },
            start_time: {
              type: 'string',
              format: 'date-time',
              description: 'Alert start time'
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Alert end time'
            },
            created_by: {
              $ref: '#/components/schemas/User'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Submission: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Submission ID'
            },
            type: {
              type: 'string',
              enum: ['NEW_RESOURCE', 'RESOURCE_UPDATE', 'REPORT'],
              description: 'Submission type'
            },
            resource_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Related resource ID (for updates)'
            },
            data: {
              type: 'object',
              description: 'Submission data (flexible JSON)'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
              description: 'Submission status'
            },
            submitted_by: {
              $ref: '#/components/schemas/User'
            },
            reviewed_by: {
              $ref: '#/components/schemas/User',
              nullable: true
            },
            review_notes: {
              type: 'string',
              nullable: true,
              description: 'Review notes'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            reviewed_at: {
              type: 'string',
              format: 'date-time',
              nullable: true
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Unauthorized'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Forbidden'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Validation error',
                errors: [
                  {
                    field: 'email',
                    message: 'Invalid email address'
                  }
                ]
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);