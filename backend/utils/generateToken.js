import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for an authenticated user
 * @param {string} id - User ID
 * @param {string} role - User Role (tenant, owner, admin)
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'stayrent_jwt_default_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

export default generateToken;
