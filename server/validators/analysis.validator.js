const validateAnalysisInput = (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Code field is required'
    });
  }

  if (typeof code !== 'string') {
    return res.status(400).json({
      error: 'Code must be a string'
    });
  }

  if (code.trim().length === 0) {
    return res.status(400).json({
      error: 'Code cannot be empty'
    });
  }

  next();
};

module.exports = {
  validateAnalysisInput
};
