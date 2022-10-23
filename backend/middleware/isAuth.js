import jwt from 'jsonwebtoken';

export default (req, res, next) => {
   const authHeader = req.get('Authorization');
   if (!authHeader) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
   }
   const token = authHeader.split(' ')[1];
   let decodeToken;
   try {
      decodeToken = jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
      err.statusCode = 500;
      throw err;
   }
   if (!decodeToken) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
   }
   req.userId = decodeToken.userId;
   next();
};
