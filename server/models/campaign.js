import mongoose from 'mongoose'

// Stats subdocument schema for active and completed campaigns
const StatsSchema = new mongoose.Schema({
  completed: {
    type: Number,
    default: 0
  },
  inProgress: {
    type: Number,
    default: 0
  },
  queue: {
    type: Number,
    default: 0
  },
  answered: {
    type: Number,
    default: 0
  },
  notAnswered: {
    type: Number,
    default: 0
  },
  failed: {
    type: Number,
    default: 0
  },
  positive: {
    type: Number,
    default: 0
  },
  neutral: {
    type: Number,
    default: 0
  },
  negative: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Main Campaign Schema
const CampaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
    trim: true
  },
  campaignId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'scheduled', 'completed', 'draft', 'running', 'paused'],
    default: 'draft'
  },
  
  // Active campaign fields
  startedAt: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Scheduled campaign fields
  scheduledFor: {
    type: Date
  },
  totalContacts: {
    type: Number,
    default: 0
  },
  estimatedDuration: {
    type: String
  },
  
  // Completed campaign fields
  completedAt: {
    type: Date
  },
  completionRate: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Draft campaign fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  
  // Stats for active and completed campaigns
  stats: StatsSchema
  
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ campaignId: 1 });
CampaignSchema.index({ createdAt: -1 });

// Pre-save middleware to update lastModified
CampaignSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Instance method to get campaign by status
CampaignSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

// Instance method to update progress
CampaignSchema.methods.updateProgress = function(newProgress) {
  this.progress = newProgress;
  return this.save();
};

export default mongoose.model("Campaign", CampaignSchema);

