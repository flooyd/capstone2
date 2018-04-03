module.exports = {
  checkMissingFields: (req, res, next) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }

    next();
  },

  checkNonStringFields: (req, res, next) => {
    const stringFields = ['username', 'password'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      });
    }

    next();
  },

  checkNonTrimmedFields: (req, res, next) => {
    
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      });
    }

    next();
  },

  checkFieldSize: (req, res, next) => {
    const sizedFields = {
      username: {
        min: 3,
        max: 20
      },
      password: {
        min: 8,
        max: 50
      }
    };

    const tooSmallField = Object.keys(sizedFields).find(field => {
      return 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min;
    }
      
    );
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField ?
          `Must be at least ${sizedFields[tooSmallField]
          .min} characters long` :
          `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
        location: tooSmallField || tooLargeField
      });
    }

    next();
  }
}