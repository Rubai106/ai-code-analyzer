const { analyzeCode } = require('../services/analysis.service');

const analyzeCodeController = async (req, res) => {
  try {
    const { code } = req.body;
    
    const analysisResult = await analyzeCode(code);
    
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Internal server error during analysis'
    });
  }
};

module.exports = {
  analyzeCodeController
};
