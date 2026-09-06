const Asset = require('../models/Asset');

// @desc    Get user assets
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ userId: req.user._id });
    res.status(200).json(assets);
  } catch (error) {
    next(error);
  }
};

// @desc    Add an asset
// @route   POST /api/assets
// @access  Private
const addAsset = async (req, res, next) => {
  try {
    const { name, type, investedAmount, currentValue, purchaseDate, notes } = req.body;

    if (!name || !type || !investedAmount || !currentValue) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const asset = await Asset.create({
      userId: req.user._id,
      name,
      type,
      investedAmount,
      currentValue,
      purchaseDate,
      notes,
    });

    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset || asset.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Asset not found or not authorized');
    }

    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAsset);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset || asset.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Asset not found or not authorized');
    }

    await asset.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  addAsset,
  updateAsset,
  deleteAsset
};
