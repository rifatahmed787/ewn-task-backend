

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'EWN task API',
    description: 'API Documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
    },
  ],
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Sign up a new user with OTP verification',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupWithOtpRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User signed up successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SignupResponse',
                },
              },
            },
          },
          '400': {
            description: 'OTP verification failed or invalid data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login a user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User logged in successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid login credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/send-otp': {
      post: {
        summary: 'Send OTP for verification',
        tags: ['OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SendOtpRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendOtpResponse',
                },
              },
            },
          },
          '400': {
            description: 'Failed to send OTP',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      // Signup Schema with OTP Verification
      SignupWithOtpRequest: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            example: 'john_doe',
          },
          email: {
            type: 'string',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            example: 'strong_password',
          },
          language: {
            type: 'string',
            example: 'en',
          },
          otp: {
            type: 'string',
            example: '123456',
          },
        },
      },
      SignupResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User signed up successfully',
          },
          user_details: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              username: {
                type: 'string',
                example: 'john_doe',
              },
              email: {
                type: 'string',
                example: 'john.doe@example.com',
              },
              verified: {
                type: 'boolean',
                example: true,
              },
              avatar: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/dztlowlu0/image/upload/v1700031261/avatar_ylo9mt.png',
              },
            },
          },
          accessToken: {
            type: 'string',
            example: 'jwt_access_token_string',
          },
          refreshToken: {
            type: 'string',
            example: 'jwt_refresh_token_string',
          },
        },
      },
      // Login Schema
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            example: 'strong_password',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User logged in successfully',
          },
          token: {
            type: 'string',
            example: 'jwt_token_string_here',
          },
        },
      },
      // OTP Schemas
      SendOtpRequest: {
        type: 'object',
        properties: {
          userIdentifier: {
            type: 'string',
            example: 'john.doe@example.com',
          },
        },
      },
      SendOtpResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'OTP sent successfully',
          },
        },
      },
      // Error Response Schema
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Error occurred',
          },
        },
      },
    },
  },
}

export default swaggerConfig
